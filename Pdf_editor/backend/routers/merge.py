from fastapi import APIRouter, UploadFile, File
from pypdf import PdfWriter
import io

router = APIRouter()

@router.post("/merge")
async def merge_pdfs(files: list[UploadFile] = File(...)):
    merger = PdfWriter()
    for file in files:
        content = await file.read()
        merger.append(io.BytesIO(content))
    
    # Create a unique filename for the output
    import uuid
    output_filename = f"merged_{uuid.uuid4()}.pdf"
    output_path = f"uploads/{output_filename}"
    
    with open(output_path, "wb") as f:
        merger.write(f)
    
    return FileResponse(output_path, media_type="application/pdf", filename="merged.pdf")
