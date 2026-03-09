import { useState } from 'react';
import { motion } from 'framer-motion';
import { ToggleRight, CheckCircle2, Circle } from 'lucide-react';

export default function SwitchBoard() {
    const [selected, setSelected] = useState(1);

    return (
        <div className="glass-panel p-6 rounded-2xl border-white/10 my-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <ToggleRight size={22} />
                </div>
                <div>
                    <h3 className="text-xl font-bold dark:text-white">Switch Board</h3>
                    <p className="text-sm text-zinc-500">Interactive jump table simulation</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-2">
                    {[1, 2, 3].map(val => (
                        <button
                            key={val}
                            onClick={() => setSelected(val)}
                            className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                                selected === val
                                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                                    : 'bg-white/5 border-white/5 text-zinc-500 hover:bg-white/10'
                            }`}
                        >
                            <span className="font-mono font-bold text-sm">Case {val}</span>
                            {selected === val ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                        </button>
                    ))}
                </div>

                <div className="bg-zinc-950/50 rounded-2xl border border-white/5 p-6 font-mono text-xs leading-loose">
                    <div className="text-zinc-600 italic mb-4">// Visualizing Execution</div>
                    <div className="space-y-1">
                        <div className="text-indigo-400">switch <span className="text-white">(n)</span> {'{'}</div>
                        {[1, 2, 3].map(val => (
                            <div key={val} className="pl-4 relative">
                                <div className={selected === val ? 'text-emerald-400 font-bold' : 'text-zinc-600'}>
                                    case {val}:
                                </div>
                                <div className={`pl-4 py-1 border-l ${selected === val ? 'border-emerald-500/50 text-white' : 'border-zinc-800 text-zinc-700'}`}>
                                    printf("Option {val}");
                                    <br />
                                    <span className="text-pink-500">break;</span>
                                </div>
                                {selected === val && (
                                    <motion.div 
                                        layoutId="pointer"
                                        className="absolute left-0 top-1 -translate-x-full pr-2 text-emerald-500"
                                    >
                                        
                                    </motion.div>
                                )}
                            </div>
                        ))}
                        <div className="text-indigo-400">{'}'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
