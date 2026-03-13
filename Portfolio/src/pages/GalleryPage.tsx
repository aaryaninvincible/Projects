import React from 'react';
import { GlassCard } from '../components/GlassCard';

const galleryImages = [
    'https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=800',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800',
];

export const GalleryPage: React.FC = () => {
    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-6">
                <h1 className="text-5xl font-orbitron font-black text-light drop-shadow-[0_0_10px_rgba(56,189,248,0.7)]">
                    My <span className="text-gradient">Gallery</span>
                </h1>
                <p className="text-xl text-slate-300 font-mono">
                    Visual documentation of my work and setups.
                </p>
            </div>

            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {galleryImages.map((src, i) => (
                    <GlassCard key={i} className="break-inside-avoid">
                        <img
                            src={src}
                            alt={`Gallery Image ${i + 1}`}
                            className="w-full h-auto object-cover rounded-lg hover:scale-105 transition-transform duration-500"
                        />
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};
