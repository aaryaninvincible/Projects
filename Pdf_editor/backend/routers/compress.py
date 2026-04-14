from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
from pypdf import PdfReader, PdfWriter
import io
import os
import uuid

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/compress")
async def compress_pdf(file: UploadFile = File(...)):
    try:
        content = await file.read()
        reader = PdfReader(io.BytesIO(content))
        writer = PdfWriter()

        for page in reader.pages:
            page.compress_content_streams()  # This provides some compression
            writer.add_page(page)
        
        # Enable metadata optimization
        writer.add_metadata(reader.metadata)

        output_filename = f"compressed_{uuid.uuid4()}.pdf"
        output_path = os.path.join(UPLOAD_DIR, output_filename)
        
        with open(output_path, "wb") as f:
            writer.write(f)
            
        return FileResponse(output_path, media_type="application/pdf", filename="compressed.pdf")

    except Exception as e:
        return {"error": str(e)}
