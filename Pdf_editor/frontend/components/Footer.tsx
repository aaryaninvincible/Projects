export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <span className="text-xl font-bold text-gray-900">PDFWeb</span>
                        <p className="mt-4 text-gray-500 text-sm max-w-xs">
                            The all-in-one easy to use PDF tools for your daily needs. Process documents securely and efficiently.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Tools</h3>
                        <ul className="space-y-3">
                            <li><a href="/merge" className="text-gray-500 hover:text-blue-600 text-sm">Merge PDF</a></li>
                            <li><a href="/split" className="text-gray-500 hover:text-blue-600 text-sm">Split PDF</a></li>
                            <li><a href="/compress" className="text-gray-500 hover:text-blue-600 text-sm">Compress PDF</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Company</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-500 hover:text-blue-600 text-sm">About</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-blue-600 text-sm">Privacy</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-blue-600 text-sm">Terms</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-center text-gray-400 text-sm">
                        &copy; 2026 PDFWeb. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
