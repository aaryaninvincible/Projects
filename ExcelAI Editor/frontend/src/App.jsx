import React, { useState } from 'react';
import { uploadFile, processCommand, downloadUrl } from './api';
import FileUpload from './components/FileUpload';
import TablePreview from './components/TablePreview';
import ChatInterface from './components/ChatInterface';
import { Download, RefreshCw, AlertCircle } from 'lucide-react';

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [filename, setFilename] = useState('');

  const handleUpload = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const res = await uploadFile(file);
      setSessionId(res.session_id);
      setData(res.preview);
      setFilename(res.filename);
      setMessages([{ role: 'system', content: `Uploaded ${res.filename} successfully. 5 rows shown.` }]);
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (prompt) => {
    setProcessing(true);
    setMessages(prev => [...prev, { role: 'user', content: prompt }]);

    try {
      const res = await processCommand(sessionId, prompt);
      setData(res.preview);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.message,
        code: res.code
      }]);
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Processing failed";
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${errMsg}` }]);
    } finally {
      setProcessing(false);
    }
  };

  const resetSession = () => {
    setSessionId(null);
    setData(null);
    setMessages([]);
    setFilename('');
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-zinc-50 text-zinc-900">
      {/* Minimal Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-zinc-100 sticky top-0 z-10 transition-all">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-zinc-900 text-white p-2 rounded-lg">
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="bg-white/90 rounded-[1px]"></div>
                <div className="bg-white/50 rounded-[1px]"></div>
                <div className="bg-white/50 rounded-[1px]"></div>
                <div className="bg-white/90 rounded-[1px]"></div>
              </div>
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
              ExcelAI <span className="text-zinc-400 font-medium">Editor</span>
            </h1>
          </div>

          {sessionId && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-zinc-400 px-3 py-1 bg-zinc-100/50 rounded-full border border-zinc-100 hidden sm:inline-block">
                {filename}
              </span>
              <div className="h-4 w-px bg-zinc-200 mx-1"></div>
              <button
                onClick={resetSession}
                className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Start Over"
              >
                <RefreshCw size={18} />
              </button>
              <a
                href={downloadUrl(sessionId)}
                className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-800 transition-all duration-200 shadow-sm hover:shadow text-sm font-medium"
              >
                <Download size={16} />
                <span>Export</span>
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 overflow-hidden">
        <div className="max-w-[1600px] mx-auto h-full flex flex-col gap-6">

          {error && (
            <div className="bg-red-50/50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 text-sm shadow-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {!sessionId ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
              <div className="max-w-xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Upload your data</h2>
                  <p className="text-zinc-500">Transform your Excel sheets with natural language.</p>
                </div>

                <FileUpload onUpload={handleUpload} isLoading={loading} />

                <div className="grid grid-cols-2 gap-3 pt-4">
                  {[
                    { icon: '✨', text: 'Auto-clean data' },
                    { icon: '📊', text: 'Generate insights' },
                    { icon: '🔍', text: 'Advanced filtering' },
                    { icon: '🧮', text: 'Complex formulas' }
                  ].map((feat, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-zinc-100 text-center text-sm text-zinc-500 hover:border-zinc-200 transition-colors shadow-sm hover:shadow-md cursor-default">
                      <span className="mr-2">{feat.icon}</span> {feat.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0 animate-in fade-in duration-500">
              {/* Left: Table Preview */}
              <div className="lg:col-span-8 flex flex-col min-h-0 bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-50 flex justify-between items-center bg-white">
                  <h3 className="font-medium text-zinc-900">Live Preview</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </div>
                    <span className="text-xs font-medium text-zinc-400">Synced</span>
                  </div>
                </div>
                <div className="flex-1 overflow-auto bg-zinc-50/30">
                  <TablePreview data={data} />
                </div>
              </div>

              {/* Right: Chat */}
              <div className="lg:col-span-4 min-h-[500px] flex flex-col">
                <ChatInterface
                  messages={messages}
                  onSend={handleSend}
                  isProcessing={processing}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
