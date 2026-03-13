import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Lock, LogIn } from 'lucide-react';

export const AdminPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username !== 'aryan' || password !== 'demo') {
            setError(true);
            setTimeout(() => setError(false), 3000);
        }
    };

    return (
        <div className="pt-32 pb-20 px-6 min-h-screen flex items-center justify-center">
            <GlassCard className="w-full max-w-md p-10 relative overflow-hidden">
                <div className="text-center space-y-4 mb-8">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto border border-primary/50 shadow-[0_0_15px_rgba(56,189,248,0.5)]">
                        <Lock className="text-primary w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-orbitron font-bold text-light">
                        System <span className="text-gradient">Access</span>
                    </h1>
                    <p className="text-sm font-mono text-slate-400">Restricted zone. Authentication required.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-light focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(56,189,248,0.3)] transition-all font-mono"
                            placeholder="Enter ID"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">Passcode</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-light focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(56,189,248,0.3)] transition-all font-mono"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-xs text-red-400 bg-red-400/10 py-2 px-3 rounded text-center border border-red-400/20 animate-pulse">
                            Access Denied: Invalid Credentials
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full glass bg-primary/10 text-primary border-primary/30 py-3 rounded-lg font-orbitron tracking-widest uppercase hover:bg-primary/20 hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all flex justify-center items-center gap-2"
                    >
                        <LogIn size={18} /> Authenticate
                    </button>
                </form>
            </GlassCard>
        </div>
    );
};
