from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routers import convert, merge, split, compress, watermark, sign, security, utility

app.include_router(convert.router, prefix="/api/convert", tags=["convert"])
app.include_router(merge.router, prefix="/api/process", tags=["process"])
app.include_router(split.router, prefix="/api/process", tags=["process"])
app.include_router(compress.router, prefix="/api/process", tags=["process"])
app.include_router(watermark.router, prefix="/api/process", tags=["process"])
app.include_router(sign.router, prefix="/api/process", tags=["process"])
app.include_router(security.router, prefix="/api/security", tags=["security"])
app.include_router(utility.router, prefix="/api/utility", tags=["utility"])

@app.get("/")
def read_root():
    return {"message": "PDF Editor API is running"}
