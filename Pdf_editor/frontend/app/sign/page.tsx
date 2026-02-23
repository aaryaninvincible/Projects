'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DragAndDropUpload from '@/components/DragAndDropUpload';
import { Loader2, Download, PenTool } from 'lucide-react';

export default function SignPage() {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [signatureFile, setSignatureFile] = useState<File | null>(null);
    const [x, setX] = useState('100');
    const [y, setY] = useState('100');
    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const handlePdfUpload = (files: File[]) => {
        setPdfFile(files[0]);
        setDownloadUrl(null);
    };

    const handleSignatureUpload = (files: File[]) => {
        setSignatureFile(files[0]);
        setDownloadUrl(null);
    };

    const handleSign = async () => {
        if (!pdfFile || !signatureFile) {
            alert("Please upload both a PDF and a signature image.");
            return;
        }

        setIsProcessing(true);
        const formData = new FormData();
        formData.append('file', pdfFile);
        formData.append('signature', signatureFile);
        formData.append('x', x);
        formData.append('y', y);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/process/sign`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Signing failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setDownloadUrl(url);
        } catch (error) {
            console.error(error);
            alert("Failed to sign PDF.");
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
                        <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                            <PenTool className="w-8 h-8" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">E-Sign PDF</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Digitally sign your documents by uploading your signature image.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto space-y-8">

                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">1. Upload PDF</h3>
                        <DragAndDropUpload onUpload={handlePdfUpload} accept={{ 'application/pdf': ['.pdf'] }} maxFiles={1} />
                    </div>

                    {pdfFile && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">2. Upload Signature (Image)</h3>
                            <DragAndDropUpload onUpload={handleSignatureUpload} accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }} maxFiles={1} />
                        </div>
                    )}

                    {pdfFile && signatureFile && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">X Position</label>
                                <input
                                    type="number"
                                    value={x}
                                    onChange={(e) => setX(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Y Position</label>
                                <input
                                    type="number"
                                    value={y}
                                    onChange={(e) => setY(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center pt-4">
                        {downloadUrl ? (
                            <a
                                href={downloadUrl}
                                download="signed.pdf"
                                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                            >
                                <Download className="w-5 h-5" />
                                Download Signed PDF
                            </a>
                        ) : (
                            <button
                                onClick={handleSign}
                                disabled={!pdfFile || !signatureFile || isProcessing}
                                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-white transition-all
                  ${!pdfFile || !signatureFile || isProcessing
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg'}`}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Signing...
                                    </>
                                ) : (
                                    <>
                                        <PenTool className="w-5 h-5" />
                                        Sign PDF
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
