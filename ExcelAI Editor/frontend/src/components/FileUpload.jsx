import React, { useCallback } from 'react';
// import { useDropzone } from 'react-dropzone'; // Removed unused import 
// Actually I didn't install react-dropzone. I'll stick to a simple custom implementation to avoid issues, or simpler input.
// Let's use a simple hidden input + styled label.

import { Upload, FileSpreadsheet } from 'lucide-react';

const FileUpload = ({ onUpload, isLoading }) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onUpload(file);
        }
    };

    return (
        <div className="group relative flex flex-col items-center justify-center p-12 border border-zinc-200 border-dashed rounded-2xl hover:border-zinc-400 hover:bg-zinc-50/50 transition-all duration-300 bg-white shadow-sm hover:shadow-md cursor-pointer">
            <div className="bg-blue-50 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <FileSpreadsheet className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 mb-1">Click to browse</h3>
            <p className="text-zinc-400 text-sm mb-6 text-center max-w-xs">Upload your Excel file (.xlsx) to start editing with AI</p>

            <label className={`relative cursor-pointer`}>
                <span className={`inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 bg-zinc-900 rounded-lg hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}>
                    {isLoading ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></span>
                            Uploading...
                        </>
                    ) : 'Select File'}
                </span>
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isLoading}
                />
            </label>
        </div>
    );
};

export default FileUpload;
