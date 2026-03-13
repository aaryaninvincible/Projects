import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { MiniGames } from '../components/MiniGames';
import { Github, Instagram, Linkedin, FileSpreadsheet, Utensils, Languages, Youtube, Mail, Zap, Bot, Leaf, ExternalLink, Download } from 'lucide-react';

const skills = [
    'JavaScript', 'Python', 'React.js', 'Node.js', 'IoT', 'MongoDB',
    'PHP', 'SQL', 'AI/ML', 'Flask', 'AWS', 'Shopify'
];

const projects = [
    {
        title: 'Excel AI Editor',
        desc: 'An intelligent Excel editor powered by AI for data manipulation and advanced spreadsheet management.',
        tech: ['AI', 'JavaScript', 'HTML', 'CSS'],
        icon: <FileSpreadsheet className="w-16 h-16 text-primary group-hover:scale-110 transition-transform duration-500 relative z-10" />,
        linkLive: '../ExcelAI Editor/index.html',
        linkSource: 'https://github.com/aaryaninvincible/ExcelAI_Editor'
    },
    {
        title: 'Bawarchi 2.0',
        desc: 'A modern restaurant website featuring a dynamic menu, responsive design, and an elegant user interface.',
        tech: ['HTML', 'CSS', 'JavaScript'],
        icon: <Utensils className="w-16 h-16 text-primary group-hover:scale-110 transition-transform duration-500 relative z-10" />,
        linkLive: '../Bawarchi_2.0/index.html',
        linkSource: 'https://github.com/aaryaninvincible/Projects/tree/main/Bawarchi_2.0'
    },
    {
        title: 'Linguistic Academy',
        desc: 'A comprehensive language learning platform with interactive lessons and a beautiful user interface.',
        tech: ['HTML', 'CSS', 'Vanilla JS'],
        icon: <Languages className="w-16 h-16 text-primary group-hover:scale-110 transition-transform duration-500 relative z-10" />,
        linkLive: '../Linguistic Academy/index.html',
        linkSource: 'https://github.com/aaryaninvincible/Projects/tree/main/Linguistic%20Academy'
    }
];

const clients = [
    {
        name: 'Voltros',
        desc: 'Complete e-commerce platform for electronics and tech products. Built with modern web technologies and integrated payment gateways.',
        icon: <Zap className="text-secondary w-10 h-10" />,
        link: 'https://voltros.in'
    },
    {
        name: 'Ouranos Robotics',
        desc: 'E-commerce platform for IoT devices and robotics products. Integrated Shopify with custom IoT solutions for enhanced user experience.',
        icon: <Bot className="text-primary w-10 h-10" />,
        link: 'https://shop.ouranosrobotics.com'
    },
    {
        name: 'Krishi Verse',
        desc: 'IoT-based agricultural solutions platform. Developed patented smart devices and scalable e-commerce integration.',
        icon: <Leaf className="text-accent w-10 h-10" />,
        link: '#'
    }
];

export const HomePage: React.FC = () => {
    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-32">
            {/* Hero */}
            <section className="text-center space-y-8 relative">
                <div className="relative w-48 h-48 mx-auto mb-8 rounded-full p-[4px] bg-gradient-to-tr from-primary via-secondary to-accent animate-[spinRGB_4s_linear_infinite] shadow-[0_0_30px_rgba(56,189,248,0.5)]">
                    <img src="/Profile.jpg" alt="Aryan Raikwar" className="w-full h-full object-cover rounded-full border-4 border-dark block" />
                </div>

                <h1 className="text-5xl md:text-7xl font-orbitron font-black text-light drop-shadow-[0_0_10px_rgba(56,189,248,0.7)]">
                    Aryan <span className="text-gradient">Raikwar</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-mono leading-relaxed">
                    IoT & Full Stack Developer | AI Engineer | Tech Content Creator with 13K+ followers | Passionate about innovation and tackling real-world challenges with cutting-edge technology.
                </p>
                <div className="h-1 w-64 mx-auto !bg-[length:300%_100%] animate-[smoothRgbFlow_3s_linear_infinite]"
                    style={{ background: 'linear-gradient(90deg, #38bdf8, #818cf8, #10b981, #38bdf8, #818cf8)' }} />

                <div className="flex justify-center gap-6 mt-12 flex-wrap">
                    <a href="#projects" className="glass hover:bg-white/10 text-primary border-primary px-8 py-3 rounded-lg font-mono font-medium transition-all hover:shadow-[0_0_15px_rgba(56,189,248,0.5)]">
                        Wait Let's See Projects
                    </a>
                    <a href="AryanRaikwarResume.pdf" download className="glass hover:bg-white/10 text-secondary border-secondary px-8 py-3 rounded-lg font-mono font-medium transition-all hover:shadow-[0_0_15px_rgba(129,140,248,0.5)] flex items-center justify-center gap-2">
                        <Download size={20} /> Download Resume
                    </a>
                </div>
            </section>

            {/* About & Content Creator Segment */}
            <section className="grid lg:grid-cols-2 gap-12 items-start" id="about">
                <div className="space-y-12">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-orbitron mb-8 relative">
                            About <span className="text-primary">Me</span>
                            <span className="absolute -bottom-4 left-0 w-24 h-1 bg-primary rounded-full"></span>
                        </h2>
                        <p className="text-slate-300 font-mono text-lg mb-4 leading-relaxed">
                            I am an IoT & Full Stack Developer ready to take on complex projects and see them through to completion with a focus on excellence. Passionate about innovation and always looking for ways to expand my skills and tackle real-world challenges.
                        </p>
                        <p className="text-slate-300 font-mono text-lg leading-relaxed">
                            With experience in IoT development at Krishi Verse (Ouranos Robotics) and full-stack development at Inocrypt Infosoft, I've honed my skills in creating scalable solutions that drive efficiency and growth.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-3xl md:text-5xl font-orbitron mb-8 relative">
                            @codesworld.exe
                            <span className="absolute -bottom-4 left-0 w-24 h-1 bg-[#E1306C] rounded-full"></span>
                        </h2>
                        <p className="text-slate-300 font-mono text-lg mb-8 leading-relaxed">
                            Sharing tech tutorials, coding tips, and project showcases with a growing community.
                        </p>
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="glass p-4 rounded-xl text-center border-white/5">
                                <div className="text-2xl font-black font-orbitron text-[#E1306C]">13K+</div>
                                <div className="text-sm font-mono text-slate-400">Followers</div>
                            </div>
                            <div className="text-center glass p-4 rounded-xl border-white/5">
                                <div className="text-2xl font-black font-orbitron text-[#E1306C]">2M+</div>
                                <div className="text-sm font-mono text-slate-400">Views</div>
                            </div>
                            <div className="text-center glass p-4 rounded-xl border-white/5">
                                <div className="text-2xl font-black font-orbitron text-[#E1306C]">100M+</div>
                                <div className="text-sm font-mono text-slate-400">Reach</div>
                            </div>
                        </div>
                        <a href="https://instagram.com/codesworld.exe" target="_blank" rel="noreferrer" className="inline-flex glass border-[#E1306C] text-[#E1306C] hover:bg-[#E1306C] hover:text-white px-6 py-3 rounded-lg font-mono items-center gap-2 transition-all">
                            <Instagram size={20} /> Visit Instagram Channel
                        </a>
                    </div>
                </div>
                <div>
                    <h2 className="text-3xl md:text-5xl font-orbitron mb-8 relative">
                        Tech Stack
                        <span className="absolute -bottom-4 left-0 w-24 h-1 bg-secondary rounded-full"></span>
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        {skills.map(skill => (
                            <GlassCard key={skill} className="px-6 py-3 cursor-default text-center hover:-translate-y-1 transition-transform">
                                <span className="font-bold text-light uppercase tracking-wider text-sm">{skill}</span>
                            </GlassCard>
                        ))}
                    </div>

                    <div className="mt-16 p-8 glass border-t border-white/10 rounded-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10 space-y-8">
                            <div>
                                <h3 className="font-orbitron text-2xl mb-4 text-light flex items-center gap-2"><Bot className="text-primary" /> Gaming Highlights</h3>
                                <p className="font-mono text-slate-300 text-sm leading-relaxed mb-6">
                                    Explore my 3 quick solo 2D games originally built for mobile and desktop. Play them right here!
                                </p>
                            </div>

                            <MiniGames />

                            <div className="pt-4 border-t border-white/5">
                                <a href="https://github.com/aaryaninvincible" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-sm font-bold tracking-widest text-primary hover:text-white transition-colors">
                                    View Game Repositories <ExternalLink size={16} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Clients */}
            <section id="clients">
                <h2 className="text-3xl md:text-5xl font-orbitron text-center mb-16 relative">
                    Client Projects
                    <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-accent rounded-full"></span>
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {clients.map((client, i) => (
                        <GlassCard key={i} className="p-8 group flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-6">
                                {client.icon}
                                <h3 className="text-2xl font-orbitron font-bold text-light">{client.name}</h3>
                            </div>
                            <p className="text-slate-300 font-mono text-sm leading-relaxed mb-8 flex-grow">
                                {client.desc}
                            </p>
                            <a href={client.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-sm font-bold tracking-widest uppercase text-light hover:text-primary transition-colors">
                                Visit Site <ExternalLink size={16} />
                            </a>
                        </GlassCard>
                    ))}
                </div>
            </section>

            {/* Featured Projects Highlight */}
            <section id="projects">
                <h2 className="text-3xl md:text-5xl font-orbitron text-center mb-16 relative">
                    Featured Work
                    <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((item, index) => (
                        <GlassCard key={index} className="group flex flex-col h-full">
                            <div className="h-48 bg-black/40 relative overflow-hidden flex items-center justify-center border-b border-white/5">
                                {item.icon}
                                <div className="absolute inset-[-50%] w-[200%] h-[200%] bg-[linear-gradient(45deg,transparent,rgba(56,189,248,0.2),transparent)] animate-shine opacity-50 z-0"></div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="font-orbitron text-2xl text-primary mb-2 font-bold">{item.title}</h3>
                                <p className="text-slate-300 text-sm mb-6 font-mono leading-relaxed flex-grow">{item.desc}</p>
                                <div className="flex gap-2 flex-wrap mb-6">
                                    {item.tech.map(t => (
                                        <span key={t} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-mono border border-primary/20">{t}</span>
                                    ))}
                                </div>
                                <div className="flex gap-4">
                                    <a href={item.linkLive} target="_blank" rel="noreferrer" className="text-sm font-bold font-mono tracking-widest text-light hover:text-primary transition-colors flex items-center gap-1">
                                        LIVE
                                    </a>
                                    <a href={item.linkSource} target="_blank" rel="noreferrer" className="text-sm font-bold font-mono tracking-widest text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                                        CODE
                                    </a>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <a href="/all-work" className="inline-flex glass text-light px-8 py-3 rounded-lg font-mono tracking-widest uppercase hover:bg-white/5 transition-all mt-4 border border-white/10 hover:border-primary/50">
                        Explore Full Gallery &rarr;
                    </a>
                </div>
            </section>


            {/* Socials & Footer Area */}
            <footer id="contact" className="text-center pt-20 border-t border-white/10">
                <div className="flex justify-center gap-4 md:gap-6 mb-12 flex-wrap">
                    <a href="https://github.com/aaryaninvincible" target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full glass flex items-center justify-center text-white hover:text-primary hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] transition-all">
                        <Github size={24} />
                    </a>
                    <a href="https://instagram.com/codesworld.exe" target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full glass flex items-center justify-center text-white hover:text-[#E1306C] hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(225,48,108,0.5)] transition-all">
                        <Instagram size={24} />
                    </a>
                    <a href="https://linkedin.com/in/aryanraikwar" target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full glass flex items-center justify-center text-white hover:text-[#0077b5] hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(0,119,181,0.5)] transition-all">
                        <Linkedin size={24} />
                    </a>
                    <a href="https://www.youtube.com/@codesworld.exe" target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full glass flex items-center justify-center text-white hover:text-[#FF0000] hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(255,0,0,0.5)] transition-all">
                        <Youtube size={24} />
                    </a>
                    <a href="mailto:aryanraikwar78@gmail.com" className="w-14 h-14 rounded-full glass flex items-center justify-center text-white hover:text-accent hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all">
                        <Mail size={24} />
                    </a>
                </div>
                <p className="text-slate-400 font-mono text-sm tracking-wide">&copy; {new Date().getFullYear()} Aryan Zone / aaryaninvincible. All rights reserved.</p>
            </footer>
        </div>
    );
};
