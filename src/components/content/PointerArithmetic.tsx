import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, Binary, Info, ChevronRight, ChevronLeft } from 'lucide-react';

const TYPES = [
    { name: 'char', size: 1, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    { name: 'short', size: 2, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { name: 'int', size: 4, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
];

const MEMORY_SIZE = 16;

export default function PointerArithmetic() {
    const [selectedType, setSelectedType] = useState(TYPES[0]);
    const [pointerPos, setPointerPos] = useState(0);
    const [memory] = useState(() => 
        Array.from({ length: MEMORY_SIZE }, (_, i) => String.fromCharCode(65 + i))
    );

    const handleStep = (dir: 1 | -1) => {
        const nextPos = pointerPos + (dir * selectedType.size);
        if (nextPos >= 0 && nextPos <= MEMORY_SIZE - selectedType.size) {
            setPointerPos(nextPos);
        }
    };

    return (
        <div className="glass-panel p-6 rounded-2xl border-white/10 my-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                        <ArrowLeftRight size={22} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold dark:text-white">Pointer Arithmetic Explorer</h3>
                        <p className="text-sm text-zinc-500">Lesson 10: Type-aware relative jumps</p>
                    </div>
                </div>

                <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
                    {TYPES.map(t => (
                        <button
                            key={t.name}
                            onClick={() => {
                                setSelectedType(t);
                                setPointerPos(0);
                            }}
                            className={`px-3 py-1 text-[10px] uppercase font-bold transition-all rounded ${
                                selectedType.name === t.name 
                                    ? 'bg-zinc-800 text-white shadow-xl' 
                                    : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                        >
                            {t.name} ({t.size}B)
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-8">
                {/* Memory Buffer */}
                <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 relative overflow-hidden group">
                    <div className="flex gap-1 justify-center">
                        {memory.map((val, i) => {
                            const isSelected = i >= pointerPos && i < pointerPos + selectedType.size;
                            return (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <div className="text-[8px] font-mono text-zinc-700">0x0{i.toString(16)}</div>
                                    <motion.div 
                                        animate={{ 
                                            borderColor: isSelected ? 'rgba(168, 85, 247, 0.5)' : 'rgba(255, 255, 255, 0.05)',
                                            backgroundColor: isSelected ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                                            scale: isSelected ? 1.05 : 1
                                        }}
                                        className={`w-10 h-12 border rounded-lg flex items-center justify-center font-mono text-sm transition-all ${
                                            isSelected ? 'text-purple-400 font-bold' : 'text-zinc-600'
                                        }`}
                                    >
                                        {val}
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pointer Label */}
                    <AnimatePresence>
                        <motion.div 
                            initial={false}
                            animate={{ x: pointerPos * 44 }} // 40 width + 4 gap approx
                            className="absolute bottom-2 left-[calc(50%-350px)] pointer-events-none flex flex-col items-center"
                            style={{ width: selectedType.size * 44 - 4 }}
                        >
                            <div className="w-0.5 h-4 bg-purple-500 mb-1" />
                            <div className="bg-purple-600 text-white px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap shadow-lg">
                                p (at 0x0{pointerPos.toString(16)})
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="flex gap-4">
                        <button 
                            onClick={() => handleStep(-1)}
                            disabled={pointerPos === 0}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-all disabled:opacity-20"
                        >
                            <ChevronLeft size={18} /> p--
                        </button>
                        <button 
                            onClick={() => handleStep(1)}
                            disabled={pointerPos >= MEMORY_SIZE - selectedType.size}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-all disabled:opacity-20"
                        >
                            p++ <ChevronRight size={18} />
                        </button>
                    </div>

                    <div className="space-y-2">
                        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start gap-4">
                            <Binary className="text-purple-500 mt-1 shrink-0" size={18} />
                            <div>
                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Mathematical Formula</h4>
                                <p className="text-sm font-mono text-zinc-500 mt-1">
                                    address = p + (1 * sizeof({selectedType.name}))
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-zinc-600 italic px-4">
                            Incrementando p di 1, il computer salta <span className="text-purple-400 font-bold">{selectedType.size} byte</span> basandosi sul tipo dichiarato.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-3">
                <Info className="text-blue-500 shrink-0" size={20} />
                <div className="space-y-1">
                    <p className="text-sm text-zinc-400 font-bold">Didactic Gold</p>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                        In C, <code>p++</code> non incrementa l'indirizzo di 1 unità di memoria (byte), ma di 1 unità di <strong>tipo</strong>. Se incrementi un puntatore a <code>short</code>, l'indirizzo aumenta di 2. Se a <code>int</code>, aumenta di 4.
                    </p>
                </div>
            </div>
        </div>
    );
}
