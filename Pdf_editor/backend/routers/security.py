from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from pypdf import PdfReader, PdfWriter
import os
import uuid
import shutil

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/protect")
async def protect_pdf(file: UploadFile = File(...), password: str = Form(...)):
    try:
        input_filename = f"input_{uuid.uuid4()}.pdf"
        input_path = os.path.join(UPLOAD_DIR, input_filename)
        
        with open(input_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
            
        reader = PdfReader(input_path)
        writer = PdfWriter()

        for page in reader.pages:
            writer.add_page(page)

        writer.encrypt(password)

        output_filename = f"protected_{uuid.uuid4()}.pdf"
        output_path = os.path.join(UPLOAD_DIR, output_filename)

        with open(output_path, "wb") as f:
            writer.write(f)

        return FileResponse(output_path, media_type="application/pdf", filename="protected.pdf")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/unlock")
async def unlock_pdf(file: UploadFile = File(...), password: str = Form(...)):
    try:
        input_filename = f"input_{uuid.uuid4()}.pdf"
        input_path = os.path.join(UPLOAD_DIR, input_filename)
        
        with open(input_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
            
        reader = PdfReader(input_path)
        if reader.is_encrypted:
            try:
                reader.decrypt(password)
            except Exception:
                raise HTTPException(status_code=400, detail="Incorrect password or unable to decrypt.")
        else:
             raise HTTPException(status_code=400, detail="PDF is not encrypted.")

        writer = PdfWriter()
        for page in reader.pages:
            writer.add_page(page)

        output_filename = f"unlocked_{uuid.uuid4()}.pdf"
        output_path = os.path.join(UPLOAD_DIR, output_filename)

        with open(output_path, "wb") as f:
            writer.write(f)

        return FileResponse(output_path, media_type="application/pdf", filename="unlocked.pdf")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
