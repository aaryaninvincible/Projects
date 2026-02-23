# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Setup Backend
FROM python:3.9-slim
WORKDIR /app/backend

# Install system dependencies for PDF tools and potential docx2pdf needs (though docx2pdf needs Windows/Office)
# Note: docx2pdf on Linux won't work as is. We rely on LibreOffice for Linux usually.
# For this Dockerfile, we'll assume a standard Linux environment where docx2pdf might fail or we switch to LibreOffice.
# Installing LibreOffice for potential fallback (if we implemented it)
RUN apt-get update && apt-get install -y libreoffice && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

# Copy built frontend static files (if serving from backend or Nginx)
# For this simple setup, we might run them separately or use a process manager.
# Let's just set up the backend container for now, as frontend usually runs on Vercel/Netlify.
# But for a single container, we can serve frontend via FastAPI or Nginx.
# Let's keep it simple: This Dockerfile runs the Backend.

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
