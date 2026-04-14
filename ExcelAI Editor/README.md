# ExcelAI Editor

A full-stack AI-powered Excel Editor web application. Upload Excel files, edit them using natural language prompts, and download the results.

## Features
- **File Upload**: Support for `.xlsx` files.
- **AI-Powered Editing**: Use natural language (e.g., "Filter rows where Age > 30") to manipulate data.
- **Live Preview**: See changes in real-time.
- **Secure Execution**: Pandas code is executed in a restricted sandbox environment.
- **Modern UI**: Built with React and Tailwind CSS.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Axios
- **Backend**: FastAPI, Pandas, OpenAI API

## Prerequisites
- Node.js & npm
- Python 3.8+
- OpenAI API Key

## Setup Instructions

### 1. Clone the repository
(If you downloaded this code, navigate to the project directory)
```bash
cd "ExcelAI Editor"
```

### 2. Backend Setup
Navigate to the `backend` directory:
```bash
cd backend
```

Create a virtual environment (optional but recommended):
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Set up environment variables:
Open `.env` in the backend folder and add your OpenAI API Key:
```
OPENAI_API_KEY=sk-your-api-key-here
```

start the server:
```bash
uvicorn main:app --reload
```
The backend will run at `http://localhost:8000`.

### 3. Frontend Setup
Open a new terminal and navigate to the `frontend` directory:
```bash
cd ../frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
The frontend will run at `http://localhost:5173`.

## Usage
1. Open the frontend URL in your browser.
2. Upload an Excel file.
3. Type commands in the chat box to edit your data.
4. Download the modified file.

## Deployment (Optional)

### Backend (Render/Vercel)
- **Render**: Connect your repo, select "Web Service", set Build Command to `pip install -r requirements.txt` and Start Command to `uvicorn main:app --host 0.0.0.0 --port $PORT`. Add `OPENAI_API_KEY` as an environment variable.

### Frontend (Vercel/Netlify)
- **Vercel**: Import project, set Build Command to `npm run build` and Output Directory to `dist`.
