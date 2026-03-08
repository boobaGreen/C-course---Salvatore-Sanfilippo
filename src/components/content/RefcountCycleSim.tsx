import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, AlertTriangle, UserCheck, Link } from 'lucide-react';

export default function RefcountCycleSim() {
    const [hasCycle, setHasCycle] = useState(false);

    const toggleCycle = () => {
        setHasCycle(!hasCycle);
    };

    return (
        <div className="glass-panel p-6 rounded-2xl border-white/10 my-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
                        <RefreshCw size={22} className={hasCycle ? "animate-spin-slow" : ""} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold dark:text-white">Refcount Cycle Simulator</h3>
                        <p className="text-sm text-zinc-500">The "Leak" trap in Reference Counting</p>
                    </div>
                </div>
                <button 
                    onClick={toggleCycle}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${hasCycle ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20'}`}
                >
                    {hasCycle ? "Break Cycle" : "Create Cycle"}
                </button>
            </div>

            <div className="relative h-64 bg-zinc-950/50 rounded-xl border border-white/5 flex items-center justify-center overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 600 300" className="absolute inset-0">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-zinc-700" />
                        </marker>
                    </defs>

                    {/* Node A */}
                    <g transform="translate(150, 150)">
                        <rect x="-60" y="-40" width="120" height="80" rx="12" className="fill-zinc-900 stroke-zinc-700" strokeWidth="2" />
                        <text y="-5" textAnchor="middle" className="fill-white text-xs font-bold">Node A</text>
                        <text y="20" textAnchor="middle" className="fill-orange-400 text-sm font-mono font-bold">REF: {hasCycle ? "2" : "1"}</text>
                    </g>

                    {/* Node B */}
                    <g transform="translate(450, 150)">
                        <rect x="-60" y="-40" width="120" height="80" rx="12" className="fill-zinc-900 stroke-zinc-700" strokeWidth="2" />
                        <text y="-5" textAnchor="middle" className="fill-white text-xs font-bold">Node B</text>
                        <text y="20" textAnchor="middle" className="fill-orange-400 text-sm font-mono font-bold">REF: 1</text>
                    </g>

                    {/* Connections */}
                    <motion.path 
                        d="M 210,150 L 390,150" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        className="text-zinc-700" 
                        strokeDasharray="5,5"
                        initial={{ pathLength: 1 }}
                    />
                    
                    <AnimatePresence>
                        {hasCycle && (
                            <motion.path 
                                key="cycle-path"
                                d="M 450,110 Q 300,40 150,110" 
                                fill="none" 
                                stroke="#ef4444" 
                                strokeWidth="3" 
                                markerEnd="url(#arrowhead)"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                exit={{ pathLength: 0, opacity: 0 }}
                                className="drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                            />
                        )}
                    </AnimatePresence>
                </svg>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <AnimatePresence>
                        {hasCycle && (
                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="bg-red-500/10 border border-red-500/30 px-6 py-3 rounded-2xl backdrop-blur-md flex items-center gap-3"
                            >
                                <AlertTriangle className="text-red-500" />
                                <div className="text-xs font-bold text-red-200">
                                    MEMORY LEAK DETECTED! <br/>
                                    <span className="font-normal opacity-70 italic text-[10px]">Nodes will never drop to 0 ref_count.</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                        <UserCheck size={14} className="text-orange-400" />
                        <span className="text-xs font-bold uppercase tracking-wider dark:text-zinc-400">Normal Logic</span>
                    </div>
                    <p className="text-[11px] text-zinc-500">Root owns A, A owns B. When Root drops A, B's ref_count drops to 0. All memory freed.</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                        <Link size={14} className="text-red-400" />
                        <span className="text-xs font-bold uppercase tracking-wider dark:text-zinc-400">Circular Logic</span>
                    </div>
                    <p className="text-[11px] text-zinc-500">A owns B, and B owns A. Even if Root drops A, they keep each other "alive" forever. 1 MB leak per node chain!</p>
                </div>
            </div>
        </div>
    );
}
