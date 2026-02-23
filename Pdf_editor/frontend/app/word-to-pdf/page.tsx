'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DragAndDropUpload from '@/components/DragAndDropUpload';
import { Loader2, Download, FileText } from 'lucide-react';

export default function WordToPdfPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const handleUpload = (uploadedFiles: File[]) => {
        setFiles([uploadedFiles[0]]);
        setDownloadUrl(null);
    };

    const handleConvert = async () => {
        if (files.length === 0) return;

        setIsProcessing(true);
        const formData = new FormData();
        formData.append('file', files[0]);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/convert/word-to-pdf`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Conversion failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setDownloadUrl(url);
        } catch (error) {
            console.error(error);
            alert("Failed to convert Word to PDF. Server implementation missing or failed.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full">
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
                            <FileText className="w-8 h-8" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Word to PDF</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Convert your Word documents (.docx) to PDF format instantly.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
                    <DragAndDropUpload
                        onUpload={handleUpload}
                        accept={{ 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], 'application/msword': ['.doc'] }}
                        maxFiles={1}
                    />

                    <div className="mt-8 flex justify-center">
                        {downloadUrl ? (
                            <a
                                href={downloadUrl}
                                download="converted.pdf"
                                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                            >
                                <Download className="w-5 h-5" />
                                Download PDF
                            </a>
                        ) : (
                            <button
                                onClick={handleConvert}
                                disabled={files.length === 0 || isProcessing}
                                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-white transition-all
                  ${files.length === 0 || isProcessing
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-orange-600 hover:bg-orange-700 shadow-md hover:shadow-lg'}`}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Converting...
                                    </>
                                ) : (
                                    <>
                                        <FileText className="w-5 h-5" />
                                        Convert to PDF
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
