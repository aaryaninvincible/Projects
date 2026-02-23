from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import io
import os
import uuid

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/sign")
async def sign_pdf(file: UploadFile = File(...), signature: UploadFile = File(...), x: int = Form(100), y: int = Form(100)):
    try:
        content = await file.read()
        reader = PdfReader(io.BytesIO(content))
        writer = PdfWriter()

        # Create signature PDF overlay
        packet = io.BytesIO()
        can = canvas.Canvas(packet)
        
        sig_content = await signature.read()
        sig_img = ImageReader(io.BytesIO(sig_content))
        
        # Draw signature at specified location (simplification: fixed size 100x50 for now)
        can.drawImage(sig_img, x, y, width=150, height=75, mask='auto')
        can.save()
        packet.seek(0)
        
        sig_pdf = PdfReader(packet)
        sig_page = sig_pdf.pages[0]

        # Apply to the last page (common use case) or all? Let's do last page for now.
        # Or better: Apply to all pages if needed, but signature usually goes on one.
        # Let's apply to the first page for simplicity or iterate.
        
        # For simplicity in this demo: Apply to the first page.
        first_page = reader.pages[0]
        first_page.merge_page(sig_page)
        writer.add_page(first_page)
        
        for page in reader.pages[1:]:
            writer.add_page(page)

        output_filename = f"signed_{uuid.uuid4()}.pdf"
        output_path = os.path.join(UPLOAD_DIR, output_filename)
        
        with open(output_path, "wb") as f:
            writer.write(f)
            
        return FileResponse(output_path, media_type="application/pdf", filename="signed.pdf")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
