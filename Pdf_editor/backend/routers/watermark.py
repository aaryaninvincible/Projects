from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
import io
import os
import uuid

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/watermark")
async def watermark_pdf(file: UploadFile = File(...), text: str = Form(...)):
    try:
        content = await file.read()
        reader = PdfReader(io.BytesIO(content))
        writer = PdfWriter()

        # Create watermark PDF in memory
        packet = io.BytesIO()
        can = canvas.Canvas(packet, pagesize=letter)
        can.setFont("Helvetica-Bold", 36)
        can.setFillColorRGB(0.5, 0.5, 0.5, 0.5) # Grey, semi-transparent
        can.saveState()
        can.translate(300, 400)
        can.rotate(45)
        can.drawCentredString(0, 0, text)
        can.restoreState()
        can.save()
        packet.seek(0)
        
        watermark_pdf = PdfReader(packet)
        watermark_page = watermark_pdf.pages[0]

        for page in reader.pages:
            page.merge_page(watermark_page)
            writer.add_page(page)

        output_filename = f"watermarked_{uuid.uuid4()}.pdf"
        output_path = os.path.join(UPLOAD_DIR, output_filename)
        
        with open(output_path, "wb") as f:
            writer.write(f)
            
        return FileResponse(output_path, media_type="application/pdf", filename="watermarked.pdf")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
