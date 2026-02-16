import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';

const ChatInterface = ({ messages, onSend, isProcessing }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !isProcessing) {
            onSend(input);
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
            <div className="p-4 border-b border-zinc-50 bg-white flex items-center gap-3">
                <div className="bg-indigo-50 p-1.5 rounded-lg">
                    <Bot size={18} className="text-indigo-600" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-zinc-900">AI Assistant</h3>
                    <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Online</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                        <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center">
                            <Bot size={24} className="text-zinc-300" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-zinc-600">No messages yet</p>
                            <p className="text-xs text-zinc-400 max-w-[200px]">Start by asking the AI to filter, sort, or modify your data.</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-zinc-900 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                            </div>
                            <div className={`max-w-[85%] space-y-2`}>
                                <div className={`p-3.5 text-sm leading-relaxed rounded-2xl ${msg.role === 'user'
                                        ? 'bg-zinc-900 text-white rounded-br-sm'
                                        : 'bg-zinc-50 text-zinc-700 rounded-bl-sm border border-zinc-100'
                                    }`}>
                                    {msg.content}
                                </div>
                                {msg.code && (
                                    <div className="text-xs bg-zinc-900 text-zinc-300 p-3 rounded-xl overflow-x-auto border border-zinc-800/50 shadow-inner font-mono">
                                        <div className="flex items-center gap-2 mb-2 border-b border-zinc-700 pb-2 opacity-50">
                                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            <span className="ml-auto text-[10px]">Python</span>
                                        </div>
                                        {msg.code}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
                {isProcessing && (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                        </div>
                        <div className="text-xs text-zinc-400 animate-pulse">Thinking...</div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-50 bg-white">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe your edit..."
                        className="w-full pl-4 pr-12 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition-all text-sm placeholder:text-zinc-400"
                        disabled={isProcessing}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isProcessing}
                        className="absolute right-2 p-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-zinc-900 transition-all shadow-sm"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;
