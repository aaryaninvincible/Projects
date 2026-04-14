from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from pypdf import PdfReader, PdfWriter
import io
import os
import uuid
import zipfile

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/split")
async def split_pdf(file: UploadFile = File(...), pages: str = Form(...)): # pages: "1,2-5" (1-based)
    try:
        content = await file.read()
        pdf_file = io.BytesIO(content)
        reader = PdfReader(pdf_file)
        
        # Parse pages string
        # Expected format: "1,3,5-7"
        selected_pages = set()
        parts = pages.split(',')
        
        for part in parts:
            part = part.strip()
            if '-' in part:
                start, end = map(int, part.split('-'))
                # pypdf is 0-indexed, user input is 1-indexed
                for i in range(start, end + 1):
                    if 1 <= i <= len(reader.pages):
                        selected_pages.add(i - 1)
            else:
                i = int(part)
                if 1 <= i <= len(reader.pages):
                    selected_pages.add(i - 1)
        
        if not selected_pages:
             raise HTTPException(status_code=400, detail="No valid pages selected")

        # Create output PDF
        writer = PdfWriter()
        for page_num in sorted(selected_pages):
            writer.add_page(reader.pages[page_num])
            
        output_filename = f"split_{uuid.uuid4()}.pdf"
        output_path = os.path.join(UPLOAD_DIR, output_filename)
        
        with open(output_path, "wb") as f:
            writer.write(f)
            
        return FileResponse(output_path, media_type="application/pdf", filename="split.pdf")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
