import { motion } from 'framer-motion';
import { Palette, Zap, Sparkles } from 'lucide-react';

export default function AttributeGrid() {
    const bitMeanings = [
        { bit: 7, label: 'Flash', desc: 'Swap INK/PAPER periodically', icon: <Zap size={14} /> },
        { bit: 6, label: 'Bright', desc: 'High intensity colors (+20%)', icon: <Sparkles size={14} /> },
        { bit: '5-3', label: 'Paper', desc: 'Background color (8 choices)', icon: <Palette size={14} className="text-emerald-400" /> },
        { bit: '2-0', label: 'Ink', desc: 'Foreground color (8 choices)', icon: <Palette size={14} className="text-indigo-400" /> },
    ];

    return (
        <div className="glass-panel p-6 rounded-2xl border-white/10 my-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Palette size={22} />
                </div>
                <div>
                    <h3 className="text-xl font-bold dark:text-white">The Attribute Byte</h3>
                    <p className="text-sm text-zinc-500">How 8 bits define color for 64 pixels</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bitMeanings.map((m, i) => (
                    <motion.div
                        key={m.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 flex items-start gap-4 hover:border-emerald-500/30 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 shadow-inner shrink-0">
                            {m.icon}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">Bit {m.bit}</span>
                                <span className="text-sm font-bold text-white">{m.label}</span>
                            </div>
                            <p className="text-xs text-zinc-500 leading-snug">{m.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center gap-8">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded border-2 border-dashed border-white/20 flex items-center justify-center mb-1">
                        <div className="w-4 h-4 bg-emerald-500 rounded-sm" />
                    </div>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">1 Pixel</span>
                </div>
                <div className="text-zinc-600 text-xl font-mono">/</div>
                <div className="flex flex-col items-center">
                    <div className="grid grid-cols-8 gap-0.5 mb-1">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div key={i} className="w-2 h-2 bg-zinc-800 rounded-[1px]" />
                        ))}
                    </div>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">8x8 Block</span>
                </div>
            </div>
            
            <p className="mt-4 text-[10px] text-zinc-600 italic text-center">
                This "attribute clash" is the reason why character colors often "bleed" into the background in old games.
            </p>
        </div>
    );
}
