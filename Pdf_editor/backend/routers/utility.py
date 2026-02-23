from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
import io
import os
import uuid
import shutil

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/rotate")
async def rotate_pdf(file: UploadFile = File(...), rotation: int = Form(90)):
    try:
        if rotation not in [90, 180, 270]:
            raise HTTPException(status_code=400, detail="Rotation must be 90, 180, or 270 degrees")

        input_filename = f"input_{uuid.uuid4()}.pdf"
        input_path = os.path.join(UPLOAD_DIR, input_filename)
        
        with open(input_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
            
        reader = PdfReader(input_path)
        writer = PdfWriter()

        for page in reader.pages:
            page.rotate(rotation)
            writer.add_page(page)

        output_filename = f"rotated_{uuid.uuid4()}.pdf"
        output_path = os.path.join(UPLOAD_DIR, output_filename)

        with open(output_path, "wb") as f:
            writer.write(f)

        return FileResponse(output_path, media_type="application/pdf", filename="rotated.pdf")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/add-page-numbers")
async def add_page_numbers(file: UploadFile = File(...), position: str = Form("bottom_center")):
    # Simplified page numbering implementation
    try:
        input_filename = f"input_{uuid.uuid4()}.pdf"
        input_path = os.path.join(UPLOAD_DIR, input_filename)
        
        with open(input_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
            
        reader = PdfReader(input_path)
        writer = PdfWriter()
        
        for i, page in enumerate(reader.pages):
            packet = io.BytesIO()
            # Dimensions
            width = float(page.mediabox.width)
            height = float(page.mediabox.height)
            
            x = width / 2.0
            y = 30.0
            
            if position == 'bottom_right':
                x = width - 50.0
            elif position == 'bottom_left':
                x = 50.0
                
            can = canvas.Canvas(packet, pagesize=(width, height))
            can.drawString(x, y, str(i + 1))
            can.save()
            packet.seek(0)
            
            number_pdf = PdfReader(packet)
            number_page = number_pdf.pages[0]
            
            page.merge_page(number_page)
            writer.add_page(page)

        output_filename = f"numbered_{uuid.uuid4()}.pdf"
        output_path = os.path.join(UPLOAD_DIR, output_filename)

        with open(output_path, "wb") as f:
            writer.write(f)

        return FileResponse(output_path, media_type="application/pdf", filename="numbered.pdf")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
