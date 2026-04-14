'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DragAndDropUpload from '@/components/DragAndDropUpload';
import { Loader2, Download, Image as ImageIcon } from 'lucide-react';

export default function WatermarkPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [text, setText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const handleUpload = (uploadedFiles: File[]) => {
        setFiles([uploadedFiles[0]]);
        setDownloadUrl(null);
    };

    const handleWatermark = async () => {
        if (files.length === 0 || !text) {
            alert("Please upload a PDF and enter watermark text.");
            return;
        }

        setIsProcessing(true);
        const formData = new FormData();
        formData.append('file', files[0]);
        formData.append('text', text);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/process/watermark`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Watermarking failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setDownloadUrl(url);
        } catch (error) {
            console.error(error);
            alert("Failed to add watermark.");
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
                        <div className="p-3 bg-red-100 rounded-xl text-red-600">
                            <ImageIcon className="w-8 h-8" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Add Watermark</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Protect your documents by adding a custom text watermark.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
                    <DragAndDropUpload onUpload={handleUpload} accept={{ 'application/pdf': ['.pdf'] }} maxFiles={1} />

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Watermark Text</label>
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="e.g. DRAFT, CONFIDENTIAL"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                    </div>

                    <div className="mt-8 flex justify-center">
                        {downloadUrl ? (
                            <a
                                href={downloadUrl}
                                download="watermarked.pdf"
                                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                            >
                                <Download className="w-5 h-5" />
                                Download Watermarked PDF
                            </a>
                        ) : (
                            <button
                                onClick={handleWatermark}
                                disabled={files.length === 0 || !text || isProcessing}
                                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-white transition-all
                  ${files.length === 0 || !text || isProcessing
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg'}`}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Adding Watermark...
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon className="w-5 h-5" />
                                        Add Watermark
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
