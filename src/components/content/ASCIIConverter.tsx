import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Type, Binary as BinaryIcon } from 'lucide-react';

export default function ASCIIConverter() {
    const [char, setChar] = useState('A');
    const code = char.charCodeAt(0) || 0;
    const binary = code.toString(2).padStart(8, '0');
    const hex = code.toString(16).toUpperCase().padStart(2, '0');

    return (
        <div className="glass-panel p-6 rounded-2xl border-white/10 my-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <Type size={22} />
                </div>
                <div>
                    <h3 className="text-xl font-bold dark:text-white">ASCII Converter</h3>
                    <p className="text-sm text-zinc-500">Character to Number bridge</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Input Character</label>
                        <input
                            type="text"
                            maxLength={1}
                            value={char}
                            onChange={(e) => setChar(e.target.value)}
                            className="bg-zinc-900 border border-white/10 rounded-xl p-4 text-4xl text-center font-bold text-[var(--color-brand-primary)] focus:outline-none focus:border-cyan-500/50 transition-colors shadow-inner"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4 text-center">
                        <div className="flex justify-center mb-2 text-zinc-600"><Hash size={16} /></div>
                        <div className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Decimal</div>
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={code}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-2xl font-black text-cyan-400 font-mono"
                            >
                                {code}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4 text-center">
                        <div className="flex justify-center mb-2 text-zinc-600 font-bold text-xs">#</div>
                        <div className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Hex</div>
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={hex}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-2xl font-black text-cyan-400 font-mono"
                            >
                                0x{hex}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4 text-center col-span-3 md:col-span-1">
                        <div className="flex justify-center mb-2 text-zinc-600"><BinaryIcon size={16} /></div>
                        <div className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Binary</div>
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={binary}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-lg font-black text-cyan-400 font-mono"
                            >
                                {binary}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
