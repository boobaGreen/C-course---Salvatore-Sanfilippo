import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Repeat, Layers, ArrowDown } from 'lucide-react';

export default function RecursionVisualizer() {
    const [depth, setDepth] = useState(3);
    
    return (
        <div className="glass-panel p-6 rounded-2xl border-white/10 my-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                        <Repeat size={22} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold dark:text-white">Recursion Visualizer</h3>
                        <p className="text-sm text-zinc-500">See the stack grow and shrink</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(d => (
                        <button 
                            key={d}
                            onClick={() => setDepth(d)}
                            className={`w-8 h-8 rounded-lg text-xs font-mono transition-all ${
                                depth === d ? 'bg-indigo-500 text-white' : 'bg-white/5 text-zinc-500 hover:bg-white/10'
                            }`}
                        >
                            {d}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col items-center gap-2 min-h-[300px] justify-end">
                <AnimatePresence>
                    {Array.from({ length: depth }).map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: -20, opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.9 }}
                            transition={{ delay: (depth - i) * 0.1 }}
                            className="w-full max-w-xs p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between shadow-lg backdrop-blur-sm"
                            style={{ zIndex: depth - i }}
                        >
                            <div className="flex items-center gap-3">
                                <Layers size={14} className="text-indigo-400" />
                                <span className="text-xs font-mono text-zinc-300">factorial({depth - i})</span>
                            </div>
                            {i === 0 && (
                                <div className="px-2 py-0.5 rounded bg-indigo-500/20 text-[10px] text-indigo-300 font-bold uppercase tracking-tighter">
                                    Active
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {depth === 0 && (
                    <div className="text-zinc-600 italic text-sm">Stack is empty</div>
                )}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-zinc-950/50 border border-white/5">
                <div className="flex items-start gap-3">
                    <ArrowDown size={16} className="text-indigo-400 mt-1" />
                    <p className="text-xs text-zinc-500 leading-relaxed">
                        Each recursive call adds a new "frame" to the **Call Stack**. The computer waits for the topmost function to finish before resuming the one below.
                    </p>
                </div>
            </div>
        </div>
    );
}
