'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';

interface DragAndDropUploadProps {
    onUpload: (files: File[]) => void;
    accept?: Record<string, string[]>;
    maxFiles?: number;
}

export default function DragAndDropUpload({ onUpload, accept, maxFiles = 1 }: DragAndDropUploadProps) {
    const [files, setFiles] = useState<File[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
        onUpload(acceptedFiles); // In a real app, you might normally handle upload logic here or in parent
    }, [onUpload]);

    const removeFile = (name: string) => {
        setFiles(files.filter(f => f.name !== name));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxFiles
    });

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-white rounded-full shadow-sm">
                        <Upload className={`w-8 h-8 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
                    </div>
                    <div>
                        <p className="text-lg font-medium text-gray-700">
                            {isDragActive ? "Drop files here" : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            PDF, Word, or Image files
                        </p>
                    </div>
                </div>
            </div>

            {files.length > 0 && (
                <div className="mt-6 space-y-3">
                    {files.map((file) => (
                        <div key={file.name} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <File className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(file.name);
                                }}
                                className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
