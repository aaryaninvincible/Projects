'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DragAndDropUpload from '@/components/DragAndDropUpload';
import { Loader2, Download, Split } from 'lucide-react';

export default function SplitPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [pages, setPages] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const handleUpload = (uploadedFiles: File[]) => {
        setFiles([uploadedFiles[0]]); // Only allow single file for split
        setDownloadUrl(null);
    };

    const handleSplit = async () => {
        if (files.length === 0 || !pages) {
            alert("Please upload a PDF and specify pages.");
            return;
        }

        setIsProcessing(true);
        const formData = new FormData();
        formData.append('file', files[0]);
        formData.append('pages', pages);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/process/split`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Split failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setDownloadUrl(url);
        } catch (error) {
            console.error(error);
            alert("Failed to split PDF.");
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
                        <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
                            <Split className="w-8 h-8" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Split PDF File</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Extract pages from your PDF file. Specify ranges like "1-3, 5".
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
                    <DragAndDropUpload onUpload={handleUpload} accept={{ 'application/pdf': ['.pdf'] }} maxFiles={1} />

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Page Ranges</label>
                        <input
                            type="text"
                            value={pages}
                            onChange={(e) => setPages(e.target.value)}
                            placeholder="e.g. 1-5, 8, 11-13"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter page numbers or ranges separated by commas.</p>
                    </div>

                    <div className="mt-8 flex justify-center">
                        {downloadUrl ? (
                            <a
                                href={downloadUrl}
                                download="split.pdf"
                                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                            >
                                <Download className="w-5 h-5" />
                                Download Split PDF
                            </a>
                        ) : (
                            <button
                                onClick={handleSplit}
                                disabled={files.length === 0 || !pages || isProcessing}
                                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-white transition-all
                  ${files.length === 0 || !pages || isProcessing
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'}`}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Splitting...
                                    </>
                                ) : (
                                    <>
                                        <Split className="w-5 h-5" />
                                        Split PDF
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
