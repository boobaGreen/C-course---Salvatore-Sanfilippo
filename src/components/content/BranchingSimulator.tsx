import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Box } from 'lucide-react';

export default function BranchingSimulator() {
    const [inputValue, setInputValue] = useState(5);
    const isGreater = inputValue > 3;

    return (
        <div className="glass-panel p-6 rounded-2xl border-white/10 my-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                        <GitBranch size={22} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold dark:text-white">Branching Simulator</h3>
                        <p className="text-sm text-zinc-500">Visualize if-else execution paths</p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <input 
                        type="range" min="0" max="10" value={inputValue} 
                        onChange={(e) => setInputValue(parseInt(e.target.value))}
                        className="w-32 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <span className="text-xs font-mono mt-1 text-zinc-500">i = {inputValue}</span>
                </div>
            </div>

            <div className="relative h-64 bg-zinc-950/50 rounded-2xl border border-white/5 overflow-hidden p-6 flex items-center justify-center">
                {/* Condition Box */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-16 bg-zinc-900 border-2 border-orange-500/50 rounded-lg flex flex-col items-center justify-center rotate-45 z-20">
                    <div className="-rotate-45 text-sm font-mono font-bold text-orange-400 text-center">
                        if (i &gt; 3)
                    </div>
                </div>

                {/* Paths */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <motion.path 
                        d="M 288 120 L 150 200" 
                        stroke={isGreater ? '#f97316' : '#27272a'} 
                        strokeWidth="3" fill="none"
                        animate={{ strokeOpacity: isGreater ? 1 : 0.2 }}
                    />
                    <motion.path 
                        d="M 288 120 L 426 200" 
                        stroke={!isGreater ? '#f97316' : '#27272a'} 
                        strokeWidth="3" fill="none"
                        animate={{ strokeOpacity: !isGreater ? 1 : 0.2 }}
                    />
                </svg>

                {/* Branch Results */}
                <div className="absolute bottom-8 left-12 w-32 h-12 bg-zinc-900 border border-white/10 rounded-lg flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {isGreater ? (
                            <motion.span 
                                key="true" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                className="text-xs font-mono text-green-400"
                            >
                                Printing: "Greater"
                            </motion.span>
                        ) : (
                            <span className="text-xs font-mono text-zinc-700">Inactive</span>
                        )}
                    </AnimatePresence>
                </div>

                <div className="absolute bottom-8 right-12 w-32 h-12 bg-zinc-900 border border-white/10 rounded-lg flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {!isGreater ? (
                            <motion.span 
                                key="false" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                className="text-xs font-mono text-blue-400"
                            >
                                Printing: "Smaller..."
                            </motion.span>
                        ) : (
                            <span className="text-xs font-mono text-zinc-700">Inactive</span>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 flex gap-3">
                <Box size={18} className="text-orange-400 shrink-0" />
                <p className="text-xs text-zinc-500 leading-relaxed">
                    Note how only **one** path is taken. In C, if the condition is any value other than **0**, it's considered **true**.
                </p>
            </div>
        </div>
    );
}
