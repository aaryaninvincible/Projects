import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface ToolCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    color?: string;
}

export default function ToolCard({ title, description, icon: Icon, href, color = "blue" }: ToolCardProps) {
    return (
        <Link href={href} className="group relative block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200">
            <div className={`inline-flex p-3 rounded-lg bg-${color}-50 text-${color}-600 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
            <p className="text-gray-500 text-sm">{description}</p>
        </Link>
    );
}
