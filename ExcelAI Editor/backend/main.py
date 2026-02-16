from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import uuid
import io
import os
from typing import Dict, Any, List
from ai_engine import generate_pandas_code
from sandbox import execute_code
from fastapi.responses import StreamingResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage: {session_id: dataframe}
# In a real app, use Redis or a database + object storage
datasets: Dict[str, pd.DataFrame] = {}

class ProcessRequest(BaseModel):
    session_id: str
    prompt: str

@app.get("/")
def read_root():
    return {"message": "ExcelAI Editor Backend is running"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload an Excel file.")
    
    try:
        content = await file.read()
        df = pd.read_excel(io.BytesIO(content))
        
        # Create a session ID
        session_id = str(uuid.uuid4())
        datasets[session_id] = df
        
        # Prepare preview
        preview = get_preview(df)
        
        return {
            "session_id": session_id,
            "filename": file.filename,
            "preview": preview
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/process")
async def process_command(request: ProcessRequest):
    session_id = request.session_id
    if session_id not in datasets:
        raise HTTPException(status_code=404, detail="Session not found")
    
    df = datasets[session_id]
    
    try:
        # 1. Get code from AI
        columns = list(df.columns)
        head_data = df.head().to_dict(orient='records')
        code = generate_pandas_code(columns, head_data, request.prompt)
        
        if code.startswith("Error"):
             raise HTTPException(status_code=500, detail=f"AI Generation Error: {code}")

        # 2. Execute code
        new_df = execute_code(df.copy(), code) # Operate on a copy first
        
        # 3. Update dataset
        datasets[session_id] = new_df
        
        return {
            "session_id": session_id,
            "code": code,
            "preview": get_preview(new_df),
            "message": "Processed successfully"
        }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Execution Error: {str(e)}")

@app.get("/download/{session_id}")
async def download_file(session_id: str):
    if session_id not in datasets:
        raise HTTPException(status_code=404, detail="Session not found")
    
    df = datasets[session_id]
    
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False)
    output.seek(0)
    
    headers = {
        'Content-Disposition': f'attachment; filename="edited_{session_id}.xlsx"'
    }
    return StreamingResponse(output, headers=headers, media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

def get_preview(df):
    # Handle NaN values for JSON serialization
    df_filled = df.fillna("")
    return {
        "columns": list(df.columns),
        "rows": df_filled.head(10).to_dict(orient='records'),
        "total_rows": len(df),
        "total_columns": len(df.columns)
    }
