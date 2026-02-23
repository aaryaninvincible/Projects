import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToolCard from '@/components/ToolCard';
import { FileText, Type, Split, Merge, Minimize2, Image, PenTool } from 'lucide-react';

export default function Home() {
  const tools = [
    {
      title: "Merge PDF",
      description: "Combine multiple PDFs into one unified document.",
      icon: Merge,
      href: "/merge",
      color: "blue"
    },
    {
      title: "Split PDF",
      description: "Separate PDF pages or split into multiple documents.",
      icon: Split,
      href: "/split",
      color: "indigo"
    },
    {
      title: "Compress PDF",
      description: "Reduce file size while optimizing for maximal quality.",
      icon: Minimize2,
      href: "/compress",
      color: "green"
    },
    {
      title: "Word to PDF",
      description: "Convert Word documents to PDF formatting.",
      icon: FileText,
      href: "/word-to-pdf",
      color: "orange"
    },
    {
      title: "PDF to Word",
      description: "Convert PDFs to editable Word documents.",
      icon: Type,
      href: "/pdf-to-word",
      color: "blue"
    },
    {
      title: "Watermark",
      description: "Add an image or text watermark to your PDF.",
      icon: Image,
      href: "/watermark",
      color: "red"
    },
    {
      title: "E-Sign PDF",
      description: "Sign your PDF document with an electronic signature.",
      icon: PenTool,
      href: "/sign",
      color: "purple"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
              Every tool you need to work with <span className="text-blue-600">PDFs</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
              All the tools you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
            </p>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <ToolCard key={index} {...tool} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
