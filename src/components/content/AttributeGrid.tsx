import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Zap, Sparkles, Info } from 'lucide-react';

export default function AttributeGrid() {
    const [selectedBit, setSelectedBit] = useState<number | string | null>(null);

    const bitMeanings = [
        { bit: 7, label: 'Flash', desc: 'Swap INK/PAPER periodically (blinking effect)', icon: <Zap size={14} />, details: "When set, the screen periodically swaps the background and foreground colors for this 8x8 block. Used for warnings or highlights." },
        { bit: 6, label: 'Bright', desc: 'High intensity colors (+20% RGB)', icon: <Sparkles size={14} />, details: "Boosts the brightness of both INK and PAPER colors. This is why the Spectrum has 8 basic colors but 15 visual variations (Bright Black is still Black)." },
        { bit: '5-3', label: 'Paper', desc: 'Background color (8 choices)', icon: <Palette size={14} className="text-emerald-400" />, details: "3 bits (2^3 = 8) that define the color of the 'empty' space in this 8x8 grid." },
        { bit: '2-0', label: 'Ink', desc: 'Foreground color (8 choices)', icon: <Palette size={14} className="text-indigo-400" />, details: "3 bits (2^3 = 8) that define the color of the 'filled' pixels in this 8x8 grid." },
    ];

    const currentDetails = bitMeanings.find(m => m.bit === selectedBit);

    return (
        <div className="glass-panel p-6 rounded-2xl border-white/10 my-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Palette size={22} />
                </div>
                <div>
                    <h3 className="text-xl font-bold dark:text-white">The Attribute Byte</h3>
                    <p className="text-sm text-zinc-500 italic">How 8 bits define color for 64 pixels</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bitMeanings.map((m, i) => (
                    <motion.div
                        key={m.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => setSelectedBit(m.bit)}
                        className={`p-4 rounded-xl cursor-pointer border transition-all duration-300 ${
                            selectedBit === m.bit 
                            ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                            : 'bg-zinc-900/50 border-white/5 hover:border-emerald-500/30'
                        } flex items-start gap-4`}
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-inner shrink-0 ${
                            selectedBit === m.bit ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                            {m.icon}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                                    selectedBit === m.bit ? 'bg-emerald-500/30 text-emerald-200' : 'bg-zinc-800 text-zinc-500'
                                }`}>Bit {m.bit}</span>
                                <span className="text-sm font-bold text-white">{m.label}</span>
                            </div>
                            <p className="text-xs text-zinc-500 leading-snug">{m.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {selectedBit && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 overflow-hidden"
                    >
                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex gap-3 italic">
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 h-fit">
                                <Info size={16} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Historical Context</h4>
                                <p className="text-xs text-zinc-400 leading-relaxed font-serif">
                                    {currentDetails?.details}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-8 p-6 rounded-2xl bg-zinc-950/80 border border-white/5 flex flex-col items-center gap-6">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-xl border-2 border-dashed border-emerald-500/30 flex items-center justify-center mb-2 bg-emerald-500/5">
                            <div className="w-6 h-6 bg-emerald-500 rounded-sm shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse" />
                        </div>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">1 Pixel Bitmap</span>
                    </div>
                    
                    <div className="hidden md:block text-zinc-800 text-3xl font-light">{'→'}</div>
                    
                    <div className="flex flex-col items-center group">
                        <div className="grid grid-cols-8 gap-1 mb-2 p-2 bg-zinc-900 rounded-xl border border-white/5 transition-all duration-500 group-hover:border-emerald-500/40 shadow-inner">
                            {Array.from({ length: 64 }).map((_, i) => (
                              <div key={i} className="w-2.5 h-2.5 bg-zinc-800 rounded-[1px] transition-colors duration-300 group-hover:bg-emerald-500/40" />
                            ))}
                        </div>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">8x8 Attribute Block</span>
                    </div>
                </div>
                
                <div className="max-w-md text-center">
                    <p className="text-xs text-zinc-500 leading-relaxed">
                        One <span className="text-emerald-400 font-mono">Attribute Byte</span> governs the colors of <span className="text-white font-bold">64 pixels</span> simultaneously. This is the physical cause of <span className="text-[var(--color-brand-secondary)] font-bold italic">Attribute Clash</span>.
                    </p>
                </div>
            </div>
            
            <p className="mt-4 text-[9px] text-zinc-700 italic text-center uppercase tracking-widest">
                Verification: [0.75 KB Total Attribute RAM / 6.75 KB Total Graphics RAM]
            </p>
        </div>
    );
}
