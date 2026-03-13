import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Globe, Github, MonitorPlay, Palette, Microchip, Bot, ShieldAlert } from 'lucide-react';

const categories = ['All', 'Web', 'Graphics', 'IoT', 'AI', 'Content'];

const works = [
    {
        title: 'Ambulance Booking System',
        desc: 'PHP, SQL, JavaScript, SCSS based platform for emergency ambulance booking with real-time tracking.',
        cat: 'Web',
        date: 'Jan 2024',
        img: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        icon: <ShieldAlert className="w-5 h-5" />
    },
    {
        title: 'YouTube Thumbnails Pack',
        desc: '100+ engaging thumbnails designed for tech tutorials with high click-through rates.',
        cat: 'Graphics',
        date: 'Ongoing',
        img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        icon: <Palette className="w-5 h-5" />
    },
    {
        title: 'Smart Agriculture Device',
        desc: 'IoT-based agricultural monitoring system with real-time sensor data and automated controls.',
        cat: 'IoT',
        date: 'Aug 2024',
        img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        icon: <Microchip className="w-5 h-5" />
    },
    {
        title: 'AI Career Counseling',
        desc: 'AI-powered career guidance platform using NLP and machine learning algorithms.',
        cat: 'AI',
        date: 'Mar 2024',
        img: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        icon: <Bot className="w-5 h-5" />
    },
    {
        title: 'React IoT Dashboard',
        desc: 'Complete tutorial on building real-time IoT dashboards with React.js and Node.js.',
        cat: 'Content',
        date: 'Nov 2024',
        img: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        icon: <MonitorPlay className="w-5 h-5" />
    },
    {
        title: 'Python POS System',
        desc: 'Point of Sale system built with Python, Pandas, NumPy and Flask for efficient billing.',
        cat: 'Web',
        date: 'Jul 2024',
        img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        icon: <Github className="w-5 h-5" />
    },
    {
        title: 'Voltros E-commerce',
        desc: 'Complete e-commerce platform for electronics with payment integration and admin dashboard.',
        cat: 'Web',
        date: 'Oct 2024',
        img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        icon: <Globe className="w-5 h-5" />
    },
    {
        title: 'Digital Marketing Banners',
        desc: 'Collection of 50+ banner designs for digital marketing campaigns across various platforms.',
        cat: 'Graphics',
        date: 'Sep 2024',
        img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        icon: <Palette className="w-5 h-5" />
    }
];

export const AllWorkPage: React.FC = () => {
    const [filter, setFilter] = useState('All');

    const filtered = filter === 'All' ? works : works.filter(w => w.cat === filter);

    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-6">
                <h1 className="text-5xl font-orbitron font-black text-light drop-shadow-[0_0_10px_rgba(56,189,248,0.7)]">
                    All <span className="text-gradient">Work</span>
                </h1>
                <p className="text-xl text-slate-300 font-mono">
                    Explore my complete portfolio of digital and physical creations.
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-4">
                {categories.map(c => (
                    <button
                        key={c}
                        onClick={() => setFilter(c)}
                        className={`px-6 py-2 rounded-full font-mono text-sm tracking-wide transition-all border ${filter === c
                            ? 'bg-primary/20 text-primary border-primary shadow-[0_0_15px_rgba(56,189,248,0.5)]'
                            : 'bg-glass text-light border-white/10 hover:border-primary/50'
                            }`}
                    >
                        {c}
                    </button>
                ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((work, i) => (
                    <GlassCard key={i} className="group cursor-pointer flex flex-col h-full">
                        <div className="h-48 overflow-hidden relative border-b border-light/5">
                            <img
                                src={work.img}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                                alt={work.title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-darker to-transparent opacity-80 mix-blend-multiply"></div>
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                <div className="bg-dark/80 backdrop-blur-md p-2 rounded-lg text-primary border border-white/10">
                                    {work.icon}
                                </div>
                                <span className="text-xs font-mono font-bold text-light bg-dark/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-lg">
                                    {work.date}
                                </span>
                            </div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <span className="text-xs font-bold text-secondary uppercase tracking-widest self-start bg-secondary/10 px-3 py-1 rounded-full">{work.cat}</span>
                            <h3 className="font-orbitron font-bold text-xl text-primary mt-4 mb-2">{work.title}</h3>
                            <p className="font-mono text-sm text-slate-300 leading-relaxed flex-grow">{work.desc}</p>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};
