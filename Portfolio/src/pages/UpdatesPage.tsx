import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Youtube, Github, Trophy, Code, Link as LinkIcon, ExternalLink } from 'lucide-react';

const STATIC_UPDATES = [
    {
        id: 1,
        type: 'project',
        title: 'Launched Ouranos Robotics E-commerce Store',
        date: 'December 15, 2024',
        content: 'Successfully deployed a complete Shopify-based e-commerce solution with custom IoT integrations for Ouranos Robotics. The platform features enhanced user experience, real-time inventory management, and improved conversion rates by 30%.\n\nImplemented custom Shopify themes, payment gateway integration, and IoT device tracking system.',
        tags: ['Shopify', 'E-commerce', 'IoT', 'JavaScript', 'Web Development'],
        links: [
            { text: 'Visit Store', url: 'https://shop.ouranosrobotics.com', type: 'primary' },
            { text: 'Case Study', url: '#', type: 'secondary' }
        ]
    },
    {
        id: 2,
        type: 'youtube',
        title: 'New Tutorial: Building IoT Dashboard with React & Node.js',
        date: 'December 10, 2024',
        content: 'Published a comprehensive tutorial on creating real-time IoT dashboards using React.js and Node.js. The video covers:\n• Real-time data visualization with Chart.js\n• WebSocket integration for live updates\n• Responsive dashboard design\n• Deployment to AWS\n\nThe video has gained 150K+ views in the first week and positive feedback from the developer community.',
        tags: ['React.js', 'Node.js', 'IoT', 'Tutorial', 'WebSockets'],
        links: [
            { text: 'Watch Tutorial', url: 'https://youtube.com/@codesworld.exe', type: 'youtube' },
            { text: 'Source Code', url: 'https://github.com/aaryaninvincible/iot-dashboard', type: 'github' }
        ]
    },
    {
        id: 3,
        type: 'github',
        title: 'Open-Sourced Python POS System',
        date: 'December 5, 2024',
        content: 'Released the complete source code for my Python-based Point of Sale system on GitHub. This project demonstrates:\n• Efficient data handling with Pandas and NumPy\n• RESTful API design with Flask\n• Invoice generation and reporting\n• Performance optimization techniques\n\nThe repository has gained 45+ stars and several contributions from the open-source community.',
        tags: ['Python', 'Flask', 'Pandas', 'Open Source', 'POS System'],
        links: [
            { text: 'View Repository', url: 'https://github.com/aaryaninvincible/python-pos-system', type: 'github' },
            { text: 'Documentation', url: '#', type: 'secondary' }
        ]
    },
    {
        id: 4,
        type: 'achievement',
        title: 'Reached 13K+ Followers on Instagram 🎉',
        date: 'November 28, 2024',
        content: 'My tech content channel @codesworld.exe has crossed 13,000 followers on Instagram! This milestone was achieved through consistent sharing of:\n• Programming tutorials and tips\n• Project showcases and demos\n• Tech industry insights\n• Career advice for developers\n\nTotal content reach has exceeded 2 million views across all platforms.',
        tags: ['Achievement', 'Social Media', 'Content Creation', 'Tech Education'],
        links: [
            { text: 'Visit Profile', url: 'https://instagram.com/codesworld.exe', type: 'instagram' },
            { text: 'Analytics Report', url: '#', type: 'secondary' }
        ]
    },
    {
        id: 5,
        type: 'project',
        title: 'Voltros.in E-commerce Platform Launch',
        date: 'November 20, 2024',
        content: 'Successfully launched the Voltros.in e-commerce platform for electronics and tech products. Key features include:\n• Custom-built admin dashboard\n• Multiple payment gateway integration\n• Real-time order tracking\n• Advanced product filtering\n• Mobile-responsive design\n\nThe platform has processed 500+ orders in the first month with positive customer feedback.',
        tags: ['E-commerce', 'PHP', 'JavaScript', 'MySQL', 'Payment Gateway'],
        links: [
            { text: 'Visit Website', url: 'https://voltros.in', type: 'primary' },
            { text: 'Technical Details', url: '#', type: 'secondary' }
        ]
    }
];

const getTypeConfig = (type: string) => {
    switch (type) {
        case 'project':
            return { icon: <Code className="w-5 h-5" />, color: 'text-primary', borderColor: 'border-primary', bgColor: 'bg-primary/10' };
        case 'youtube':
            return { icon: <Youtube className="w-5 h-5" />, color: 'text-[#FF0000]', borderColor: 'border-[#FF0000]', bgColor: 'bg-[#FF0000]/10' };
        case 'github':
            return { icon: <Github className="w-5 h-5" />, color: 'text-[#6cc644]', borderColor: 'border-[#6cc644]', bgColor: 'bg-[#6cc644]/10' };
        case 'achievement':
            return { icon: <Trophy className="w-5 h-5" />, color: 'text-[#FFD700]', borderColor: 'border-[#FFD700]', bgColor: 'bg-[#FFD700]/10' };
        default:
            return { icon: <LinkIcon className="w-5 h-5" />, color: 'text-secondary', 'borderColor': 'border-secondary', 'bgColor': 'bg-secondary/10' };
    }
};

export const UpdatesPage: React.FC = () => {
    const [liveGithubUpdate, setLiveGithubUpdate] = useState<any>(null);

    useEffect(() => {
        const fetchGithub = async () => {
            try {
                const response = await fetch('https://api.github.com/users/aaryaninvincible/events/public');
                if (!response.ok) return;
                const events = await response.json();
                const pushEvent = events.find((event: any) => event.type === 'PushEvent');
                if (pushEvent) {
                    setLiveGithubUpdate(pushEvent);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchGithub();
    }, []);

    return (
        <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto space-y-16">
            <div className="text-center space-y-6">
                <h1 className="text-5xl font-orbitron font-black text-light drop-shadow-[0_0_10px_rgba(56,189,248,0.7)]">
                    Latest <span className="text-gradient">Updates</span>
                </h1>
                <p className="text-xl text-slate-300 font-mono">
                    Stay updated with my latest projects, tutorials, achievements, and professional milestones.
                </p>
            </div>

            <div className="relative border-l border-white/10 pl-8 space-y-12">
                {/* Live Github Update */}
                {liveGithubUpdate && (
                    <div className="relative group">
                        <div className="absolute -left-[41px] top-6 w-5 h-5 rounded-full bg-[#6cc644] border-4 border-darker shadow-[0_0_10px_#6cc644] animate-pulse glow"></div>
                        <GlassCard className="p-8 border-[#6cc644]/30 group-hover:border-[#6cc644]/60 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                                <div className="flex items-center gap-3">
                                    <span className={`px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase bg-[#6cc644]/10 text-[#6cc644]`}>
                                        GitHub Push
                                    </span>
                                    <span className="bg-[#6cc644] text-dark font-bold text-xs px-2 py-0.5 rounded-full animate-pulse">LIVE NOW</span>
                                </div>
                                <span className="text-slate-400 font-mono text-sm">
                                    {new Date(liveGithubUpdate.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>

                            <h3 className="text-2xl font-orbitron text-light font-bold mb-4">
                                Pushed Code to <span className="text-[#6cc644]">{liveGithubUpdate.repo.name.split('/')[1]}</span>
                            </h3>
                            <div className="text-slate-300 font-mono text-sm whitespace-pre-wrap leading-relaxed mb-6 space-y-4">
                                <p className="border-l-2 border-[#6cc644] pl-4 italic">
                                    "{liveGithubUpdate.payload.commits?.[0]?.message || 'Updated project files'}"
                                </p>
                                <p>I just pushed new code to my GitHub repository. Click below to view the commit or check out the entire project.</p>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {['GitHub API', 'Live Activity', 'Code Push'].map((tag: string) => (
                                    <span key={tag} className="text-xs font-mono px-3 py-1 rounded-full bg-[#6cc644]/5 text-[#6cc644] border border-[#6cc644]/20">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-4 mt-6 border-t border-white/5 pt-6">
                                <a href={`https://github.com/${liveGithubUpdate.repo.name}/commit/${liveGithubUpdate.payload.commits?.[0]?.sha}`} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg font-mono text-sm font-bold tracking-widest uppercase transition-all bg-[#6cc644] text-dark hover:shadow-[0_0_15px_#6cc644]`}>
                                    View Commit <ExternalLink size={16} />
                                </a>
                                <a href={`https://github.com/${liveGithubUpdate.repo.name}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-2 rounded-lg font-mono text-sm font-bold tracking-widest uppercase transition-all glass hover:bg-white/5 border border-white/10 text-slate-300 hover:text-white">
                                    View Repo <ExternalLink size={16} />
                                </a>
                            </div>
                        </GlassCard>
                    </div>
                )}

                {/* Static Updates */}
                {STATIC_UPDATES.map((update) => {
                    const config = getTypeConfig(update.type);

                    return (
                        <div key={update.id} className="relative group">
                            <div className={`absolute -left-[41px] top-6 w-5 h-5 rounded-full ${config.bgColor} border-4 border-darker shadow-[0_0_10px_currentColor] ${config.color} transition-all duration-500 group-hover:scale-125 glow`}></div>

                            <GlassCard className={`p-8 border-l-4 ${config.borderColor} transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]`}>
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase ${config.bgColor} ${config.color}`}>
                                            {update.type}
                                        </span>
                                        {update.id === 1 && <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full animate-pulse">NEW</span>}
                                    </div>
                                    <span className="text-slate-400 font-mono text-sm">{update.date}</span>
                                </div>

                                <h3 className="text-2xl font-orbitron text-light font-bold mb-4 flex items-center gap-3">
                                    <span className={config.color}>{config.icon}</span>
                                    {update.title}
                                </h3>

                                <div className="text-slate-300 font-mono text-sm whitespace-pre-wrap leading-relaxed mb-6">
                                    {update.content}
                                </div>

                                <div className="flex flex-wrap gap-2 mb-8 border-b border-light/5 pb-6">
                                    {update.tags.map((tag, idx) => (
                                        <span key={idx} className={`text-xs font-mono px-3 py-1 rounded-full ${config.bgColor} ${config.color} border border-current/20`}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-4 mt-6">
                                    {update.links.map((link, idx) => {
                                        let linkClasses = "inline-flex items-center gap-2 px-6 py-2 rounded-lg font-mono text-sm font-bold tracking-widest uppercase transition-all ";

                                        if (link.type === 'primary') {
                                            linkClasses += "bg-primary text-dark hover:shadow-[0_0_15px_rgba(56,189,248,0.5)]";
                                        } else if (link.type === 'youtube') {
                                            linkClasses += "bg-[#FF0000] text-white hover:shadow-[0_0_15px_rgba(255,0,0,0.5)]";
                                        } else if (link.type === 'github') {
                                            linkClasses += "bg-[#6cc644] text-white hover:shadow-[0_0_15px_rgba(108,198,68,0.5)]";
                                        } else if (link.type === 'instagram') {
                                            linkClasses += "bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white hover:shadow-[0_0_15px_rgba(225,48,108,0.5)]";
                                        } else {
                                            linkClasses += "glass hover:bg-white/5 border border-white/10 text-slate-300 hover:text-white";
                                        }

                                        return (
                                            <a key={idx} href={link.url} target="_blank" rel="noreferrer" className={linkClasses}>
                                                {link.text} <ExternalLink size={16} />
                                            </a>
                                        );
                                    })}
                                </div>
                            </GlassCard>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
