import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Updates', path: '/updates' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'All Work', path: '/all-work' },
    { name: 'Admin', path: '/admin' }
];

export const Navbar: React.FC = () => {
    const location = useLocation();

    return (
        <header className="fixed w-full top-0 z-50 glass border-b border-white/10 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-black font-orbitron tracking-wider text-gradient animate-pulse-glow">
                    ARYAN ZONE
                </Link>
                <nav className="hidden md:flex gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`font-mono transition-colors relative group py-1 ${location.pathname === link.path ? 'text-primary' : 'text-light hover:text-primary'
                                }`}
                        >
                            {link.name}
                            <span className={`absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                                }`} />
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
};
