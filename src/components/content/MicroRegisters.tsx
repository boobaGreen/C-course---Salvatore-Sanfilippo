import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Play, RotateCcw, Box } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function MicroRegisters() {
    const { t } = useTranslation();
    const [regA, setRegA] = useState(5); // Valore del colore/carattere
    const [regX, setRegX] = useState(1); // Numero di pixel/iterazioni
    const [memory, setMemory] = useState<number[]>(new Array(16).fill(0));
    const [isExecuting, setIsExecuting] = useState(false);
    const [currentIdx, setCurrentIdx] = useState<number | null>(null);

    const colors = [
        'bg-zinc-800',       // 0: Empty
        'bg-red-500',        // 1
        'bg-blue-500',       // 2
        'bg-yellow-500',     // 3
        'bg-purple-500',     // 4
        'bg-green-500',      // 5
        'bg-pink-500',       // 6
        'bg-orange-500',     // 7
        'bg-cyan-500'        // 8
    ];

    const runSimulation = async () => {
        setIsExecuting(true);
        const newMem = [...memory];

        for (let i = 0; i < regX; i++) {
            if (i >= 16) break;
            setCurrentIdx(i);
            await new Promise(r => setTimeout(r, 300));
            newMem[i] = regA;
            setMemory([...newMem]);
        }

        setCurrentIdx(null);
        setIsExecuting(false);
    };

    const reset = () => {
        setMemory(new Array(16).fill(0));
        setRegA(5);
        setRegX(1);
    };

    return (
        <div className="my-10 rounded-2xl border border-white/10 glass-panel overflow-hidden shadow-2xl theme-asm">
            <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Cpu size={18} className="text-[var(--color-brand-secondary)]" />
                    <h4 className="text-sm font-bold uppercase tracking-widest text-white">{t('lesson.micro.title', '6502 Micro-Emulator')}</h4>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={reset}
                        className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 transition-colors"
                    >
                        <RotateCcw size={16} />
                    </button>
                    <button
                        onClick={runSimulation}
                        disabled={isExecuting}
                        className="px-4 py-1.5 bg-[var(--color-brand-secondary)] text-black rounded-lg font-bold text-xs transition-all hover:scale-105 disabled:opacity-50"
                    >
                        {isExecuting ? <Zap size={14} className="animate-pulse" /> : <Play size={14} />}
                        <span className="ml-2">EXEC</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Registers Control */}
                <div className="p-6 space-y-8 bg-black/20 border-b md:border-b-0 md:border-r border-white/5">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                <Box size={14} className="text-orange-400" />
                                Register A (Accumulator)
                            </label>
                            <span className="font-mono text-[var(--color-brand-secondary)] font-bold">{regA}</span>
                        </div>
                        <input
                            type="range" min="1" max="8" value={regA}
                            onChange={(e) => setRegA(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--color-brand-secondary)]"
                        />
                        <p className="text-[10px] text-zinc-500 italic">Sets the "color" value to write into memory.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                <Box size={14} className="text-cyan-400" />
                                Register X (Index)
                            </label>
                            <span className="font-mono text-[var(--color-brand-secondary)] font-bold">{regX}</span>
                        </div>
                        <input
                            type="range" min="1" max="16" value={regX}
                            onChange={(e) => setRegX(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--color-brand-secondary)]"
                        />
                        <p className="text-[10px] text-zinc-500 italic">Determines how many loops the processor runs.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-[10px] text-zinc-400 leading-relaxed">
                        <span className="text-zinc-600">// Mini Assembly</span><br />
                        <span className="text-orange-400">LDA</span> #{regA}<br />
                        <span className="text-cyan-400">LDX</span> #{regX}<br />
                        <span className="text-zinc-200">LOOP:</span><br />
                        &nbsp;&nbsp;<span className="text-green-400">STA</span> $0200, Y<br />
                        &nbsp;&nbsp;<span className="text-white">DEX</span><br />
                        &nbsp;&nbsp;<span className="text-white">BNE</span> LOOP
                    </div>
                </div>

                {/* Memory Map (Grid) */}
                <div className="p-8 flex flex-col items-center justify-center bg-black/40">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6 block">Memory Mapped Video RAM ($0200)</span>

                    <div className="grid grid-cols-4 gap-2">
                        {memory.map((val, i) => (
                            <motion.div
                                key={i}
                                className={`w-12 h-12 rounded-lg border border-white/5 shadow-inner transition-all flex items-center justify-center ${colors[val]}`}
                                animate={{
                                    scale: currentIdx === i ? 1.2 : 1,
                                    borderColor: currentIdx === i ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.05)',
                                    boxShadow: currentIdx === i ? '0 0 15px rgba(255,255,255,0.2)' : 'none'
                                }}
                            >
                                {currentIdx === i && (
                                    < Zap size={16} className="text-white animate-pulse" />
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 flex gap-4 text-[9px] uppercase font-bold tracking-widest text-zinc-600">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500 opacity-50"></div> CPU Cache</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-cyan-500 opacity-50"></div> Bus State</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
