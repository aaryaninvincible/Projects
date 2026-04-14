import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-blue-600 text-white p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
                                <FileText className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                PDFWeb
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/merge" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Merge</Link>
                        <Link href="/split" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Split</Link>
                        <Link href="/compress" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Compress</Link>
                        <Link href="/word-to-pdf" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Word to PDF</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="text-sm font-medium text-gray-600 hover:text-gray-900">Login</button>
                        <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-transform hover:scale-105 active:scale-95">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
