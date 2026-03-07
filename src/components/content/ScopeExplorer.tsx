import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Box, Globe, Shield, Info } from 'lucide-react';

interface Variable {
    name: string;
    type: 'local' | 'global' | 'static';
    value: number;
    description: string;
}

export default function ScopeExplorer() {
    // Initial state
    const [globalX, setGlobalX] = useState(0);
    const [staticX, setStaticX] = useState(0);
    const [localX, setLocalX] = useState(0); 
    const [calls, setCalls] = useState(0);
    const [activeX, setActiveX] = useState<number | null>(null);

    const handleCall = () => {
        setCalls(prev => prev + 1);
        
        // Logic for each type
        setGlobalX(prev => prev + 1);
        setStaticX(prev => prev + 1);
        setLocalX(1); // Local is always reset or set within the scope, in the video it starts at 1 and becomes 2
        
        // Show local animation
        setActiveX(2);
        setTimeout(() => setActiveX(null), 1000);
    };

    const reset = () => {
        setGlobalX(0);
        setStaticX(0);
        setLocalX(0);
        setCalls(0);
    };

    return (
        <div className="glass-panel p-6 rounded-2xl border-white/10 my-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] flex items-center justify-center">
                        <Box size={22} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold dark:text-white">Scope & Lifetime Explorer</h3>
                        <p className="text-sm text-zinc-500">Visualizing Local, Global, and Static behavior</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={reset}
                        className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
                    >
                        <RotateCcw size={18} />
                    </button>
                    <button 
                        onClick={handleCall}
                        className="btn-primary flex items-center gap-2 group"
                    >
                        <Play size={18} className="group-hover:translate-x-0.5 transition-transform" />
                        Call function()
                    </button>
                </div>
            </div>

            {/* Simulation Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                
                {/* Visual Representation */}
                <div className="relative min-h-[400px] bg-zinc-950/50 rounded-2xl border border-white/5 p-6 flex flex-col gap-8">
                    
                    {/* Global Scope Pool */}
                    <div className="flex flex-col gap-2 relative">
                        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-zinc-600">
                             <Globe size={12} /> Global Scope
                        </div>
                        <div className="h-24 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center relative overflow-hidden">
                             <AnimatePresence mode="popLayout">
                                <motion.div 
                                    key={globalX}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    className="flex items-center gap-4"
                                >
                                    <span className="text-sm font-mono text-zinc-400">int x_global = </span>
                                    <span className="text-3xl font-black text-[var(--color-brand-primary)] drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">{globalX}</span>
                                </motion.div>
                             </AnimatePresence>
                             <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 pointer-events-none" />
                        </div>
                    </div>

                    {/* Function Scope Bubble */}
                    <motion.div 
                        animate={{ scale: activeX ? [1, 1.02, 1] : 1 }}
                        className="flex-1 bg-zinc-900/40 border border-white/10 rounded-xl p-4 flex flex-col gap-4 relative"
                    >
                         <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-zinc-600">
                             <Box size={12} /> incr() Function Scope
                        </div>

                        <div className="grid grid-cols-2 gap-4 h-full pt-2">
                            {/* Static Variable (Outside but inside) */}
                            <div className="bg-zinc-900 border border-blue-500/30 rounded-lg p-3 flex flex-col justify-center items-center gap-1 relative group">
                                <div className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white p-1 rounded-md shadow-lg shadow-blue-500/40">
                                    <Shield size={10} />
                                </div>
                                <span className="text-[10px] font-mono text-zinc-500">static int x</span>
                                <AnimatePresence mode="popLayout">
                                    <motion.span 
                                        key={staticX}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-2xl font-black text-blue-400"
                                    >
                                        {staticX}
                                    </motion.span>
                                </AnimatePresence>
                                <span className="text-[8px] text-zinc-600 mt-1 uppercase tracking-tighter">Persists</span>
                            </div>

                            {/* Local Variable */}
                            <div className="bg-zinc-900 border border-yellow-500/30 rounded-lg p-3 flex flex-col justify-center items-center gap-1 relative">
                                <span className="text-[10px] font-mono text-zinc-500">int x_local</span>
                                <AnimatePresence mode="popLayout">
                                    {activeX ? (
                                        <motion.span 
                                            key={activeX}
                                            initial={{ y: 5, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="text-2xl font-black text-yellow-400"
                                        >
                                            {activeX}
                                        </motion.span>
                                    ) : (
                                        <span className="text-2xl font-black text-zinc-700">?</span>
                                    )}
                                </AnimatePresence>
                                <span className="text-[8px] text-zinc-600 mt-1 uppercase tracking-tighter">Transient</span>
                            </div>
                        </div>

                        {/* Function Execution Light */}
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${activeX ? 'bg-yellow-400 animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'bg-zinc-700'}`} />
                             <span className="text-[10px] uppercase font-bold text-zinc-500">{activeX ? 'Executing' : 'Idle'}</span>
                        </div>
                    </motion.div>
                </div>

                {/* Legend & Details */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="group space-y-2">
                            <div className="flex items-center gap-2 text-[var(--color-brand-primary)]">
                                <Globe size={16} />
                                <h4 className="font-bold">Global Variables</h4>
                            </div>
                            <p className="text-sm text-zinc-500 leading-relaxed">
                                Declared outside any function. They are initialized at start and <span className="text-zinc-300">persist for the entire program life</span>. Access is possible from anywhere.
                            </p>
                        </div>

                        <div className="group space-y-2">
                            <div className="flex items-center gap-2 text-blue-400">
                                <Shield size={16} />
                                <h4 className="font-bold">Static Locals</h4>
                            </div>
                            <p className="text-sm text-zinc-500 leading-relaxed">
                                Declared with <code>static</code> inside a function. Like globals, they persist in memory, but are <span className="text-zinc-300">only visible inside that function</span>. They keep their state between calls.
                            </p>
                        </div>

                        <div className="group space-y-2">
                            <div className="flex items-center gap-2 text-yellow-400">
                                <Box size={16} />
                                <h4 className="font-bold">Local Variables</h4>
                            </div>
                            <p className="text-sm text-zinc-500 leading-relaxed">
                                Created on the <strong>stack</strong> when the function is called. They are <span className="text-zinc-300">destroyed as soon as the function returns</span>. Every call gets a fresh copy.
                            </p>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[var(--color-brand-secondary)]/5 border border-[var(--color-brand-secondary)]/10 flex gap-3">
                        <Info className="text-[var(--color-brand-secondary)] shrink-0" size={20} />
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Call Count: {calls}</p>
                            <p className="text-sm text-zinc-500">
                                Note how <strong>Local</strong> resets every time, while <strong>Global</strong> and <strong>Static</strong> continue to count upwards.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
