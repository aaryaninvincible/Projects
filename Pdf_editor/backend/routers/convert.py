from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from pdf2docx import Converter
import platform
import subprocess
import os
import uuid
import shutil
import fitz # PyMuPDF
from PIL import Image
import zipfile
import io

# Conditional imports for Windows
if platform.system() == "Windows":
    import pythoncom
    from docx2pdf import convert

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/word-to-pdf")
async def word_to_pdf(file: UploadFile = File(...)):
    try:
        # Generate unique filenames
        input_filename = f"input_{uuid.uuid4()}.docx"
        input_path = os.path.join(UPLOAD_DIR, input_filename)
        abs_input_path = os.path.abspath(input_path)
        
        output_filename = f"converted_{uuid.uuid4()}.pdf"
        output_path = os.path.join(UPLOAD_DIR, output_filename)
        abs_output_path = os.path.abspath(output_path)
        
        # Save uploaded file
        with open(input_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
            
        system_platform = platform.system()

        if system_platform == "Windows":
            # Initialize COM library for Windows
            pythoncom.CoInitialize()
            try:
                convert(abs_input_path, abs_output_path)
            except Exception as e:
                if "Word" in str(e) or "win32com" in str(e):
                     raise HTTPException(status_code=500, detail="Microsoft Word is required on the server for this conversion.")
                raise e
            finally:
                pythoncom.CoUninitialize()
                
        elif system_platform == "Linux":
            # Use LibreOffice on Linux
            try:
                # libreoffice --headless --convert-to pdf input.docx --outdir output_dir
                subprocess.run(
                    ["libreoffice", "--headless", "--convert-to", "pdf", abs_input_path, "--outdir", UPLOAD_DIR],
                    check=True,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE
                )
                # LibreOffice uses the same basename, so we need to rename or ensure we pick the right file
                # The output will be in UPLOAD_DIR with the same basename as input but .pdf extension
                generated_pdf = os.path.join(UPLOAD_DIR, input_filename.replace(".docx", ".pdf"))
                if os.path.exists(generated_pdf):
                    os.rename(generated_pdf, abs_output_path)
                else:
                    raise HTTPException(status_code=500, detail="LibreOffice conversion failed to produce output.")
            except FileNotFoundError:
                raise HTTPException(status_code=500, detail="LibreOffice is not installed. Please install it to use this feature on Linux.")
            except subprocess.CalledProcessError as e:
                 raise HTTPException(status_code=500, detail=f"LibreOffice conversion failed: {e.stderr.decode()}")
        
        else:
             raise HTTPException(status_code=501, detail=f"Unsupported platform: {system_platform}")

        return FileResponse(output_path, media_type="application/pdf", filename="converted.pdf")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/pdf-to-word")
async def pdf_to_word(file: UploadFile = File(...)):
    try:
        input_filename = f"input_{uuid.uuid4()}.pdf"
        input_path = os.path.join(UPLOAD_DIR, input_filename)
        
        with open(input_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
            
        output_filename = f"converted_{uuid.uuid4()}.docx"
        output_path = os.path.join(UPLOAD_DIR, output_filename)
        
        cv = Converter(input_path)
        cv.convert(output_path, start=0, end=None)
        cv.close()
        
        return FileResponse(output_path, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", filename="converted.docx")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/excel-to-pdf")
async def excel_to_pdf(file: UploadFile = File(...)):
    # Reusing the LibreOffice conversion logic for Excel
    return await convert_office_to_pdf(file, ".xlsx")

@router.post("/powerpoint-to-pdf")
async def powerpoint_to_pdf(file: UploadFile = File(...)):
    # Reusing the LibreOffice conversion logic for PowerPoint
    return await convert_office_to_pdf(file, ".pptx")

async def convert_office_to_pdf(file: UploadFile, extension: str):
    try:
        input_filename = f"input_{uuid.uuid4()}{extension}"
        input_path = os.path.join(UPLOAD_DIR, input_filename)
        abs_input_path = os.path.abspath(input_path)
        
        output_filename = f"converted_{uuid.uuid4()}.pdf"
        output_path = os.path.join(UPLOAD_DIR, output_filename)
        abs_output_path = os.path.abspath(output_path)
        
        with open(input_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
            
        system_platform = platform.system()

        if system_platform == "Linux":
            try:
                subprocess.run(
                    ["libreoffice", "--headless", "--convert-to", "pdf", abs_input_path, "--outdir", UPLOAD_DIR],
                    check=True,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE
                )
                generated_pdf = os.path.join(UPLOAD_DIR, input_filename.replace(extension, ".pdf"))
                if os.path.exists(generated_pdf):
                    os.rename(generated_pdf, abs_output_path)
                else:
                    raise HTTPException(status_code=500, detail="LibreOffice conversion failed to produce output.")
            except FileNotFoundError:
                raise HTTPException(status_code=500, detail="LibreOffice is not installed.")
            except subprocess.CalledProcessError as e:
                 raise HTTPException(status_code=500, detail=f"LibreOffice conversion failed: {e.stderr.decode()}")
        else:
             raise HTTPException(status_code=501, detail=f"Unsupported platform for Office conversion: {system_platform}. Use Linux container.")

        return FileResponse(output_path, media_type="application/pdf", filename="converted.pdf")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/pdf-to-jpg")
async def pdf_to_jpg(file: UploadFile = File(...)):
    try:
        input_filename = f"input_{uuid.uuid4()}.pdf"
        input_path = os.path.join(UPLOAD_DIR, input_filename)
        
        with open(input_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
            
        doc = fitz.open(input_path)
        
        output_zip_filename = f"converted_images_{uuid.uuid4()}.zip"
        output_zip_path = os.path.join(UPLOAD_DIR, output_zip_filename)
        
        with zipfile.ZipFile(output_zip_path, 'w') as zipf:
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                pix = page.get_pixmap(dpi=150)
                img_data = pix.tobytes("jpeg")
                zipf.writestr(f"page_{page_num + 1}.jpg", img_data)

        doc.close()
        return FileResponse(output_zip_path, media_type="application/zip", filename="converted_images.zip")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/jpg-to-pdf")
async def jpg_to_pdf(file: UploadFile = File(...)):
    try:
        input_filename = f"input_{uuid.uuid4()}.jpg"
        input_path = os.path.join(UPLOAD_DIR, input_filename)
        
        with open(input_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
            
        output_filename = f"converted_{uuid.uuid4()}.pdf"
        output_path = os.path.join(UPLOAD_DIR, output_filename)
        
        image = Image.open(input_path)
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
            
        image.save(output_path, "PDF", resolution=100.0)
        
        return FileResponse(output_path, media_type="application/pdf", filename="converted.pdf")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
