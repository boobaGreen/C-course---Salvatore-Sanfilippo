import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2, Database, ArrowRight, Binary, Info } from 'lucide-react';

interface MemorySlot {
    addr: string;
    name: string;
    type: string;
    value: string;
    target?: string;
}

const MEMORY_SLOTS: MemorySlot[] = [
    { addr: '0x7ffd01', name: 'x', type: 'int', value: '5' },
    { addr: '0x7ffd02', name: 'y', type: 'int', value: '10' },
    { addr: '0x7ffd03', name: 'p', type: 'int*', value: '0x7ffd01', target: 'x' },
    { addr: '0x7ffd04', name: 'pp', type: 'int**', value: '0x7ffd03', target: 'p' },
];

export default function PointerBasics() {
    const [slots, setSlots] = useState<MemorySlot[]>(MEMORY_SLOTS);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [actionLog, setActionLog] = useState<string[]>(["Scegli una cella per iniziare"]);

    const handleUpdateValue = (addr: string) => {
        const newValue = String(Math.floor(Math.random() * 99) + 1);
        setSlots(prev => prev.map(s => s.addr === addr ? { ...s, value: newValue } : s));
        const name = slots.find(s => s.addr === addr)?.name;
        setActionLog(prev => [`Aggiornato valore di ${name} a ${newValue}`, ...prev.slice(0, 4)]);
    };

    const handleDereference = (addr: string) => {
        const slot = slots.find(s => s.addr === addr);
        if (slot?.type.includes('*') && slot.target) {
            const targetName = slot.target;
            const targetValue = slots.find(s => s.name === targetName)?.value;
            setActionLog(prev => [`Deferenziato ${slot.name}: il valore all'indirizzo ${slot.value} (${targetName}) è ${targetValue}`, ...prev.slice(0, 4)]);
            setSelectedSlot(slots.find(s => s.name === targetName)?.addr || null);
        }
    };

    return (
        <div className="glass-panel p-6 rounded-2xl border-white/10 my-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <MousePointer2 size={22} />
                </div>
                <div>
                    <h3 className="text-xl font-bold dark:text-white">Memory & Pointer Visualizer</h3>
                    <p className="text-sm text-zinc-500">Lesson 9: Addresses, Values, and Indirection</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Memory Grid */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-2">
                        <span>Physical Memory (RAM)</span>
                        <span>Stack Segment</span>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                        <table className="w-full text-xs font-mono">
                            <thead>
                                <tr className="border-b border-zinc-800 bg-black/40">
                                    <th className="px-4 py-2 text-left text-zinc-500">Address</th>
                                    <th className="px-4 py-2 text-left text-zinc-500">Label</th>
                                    <th className="px-4 py-2 text-left text-zinc-500">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {slots.map((slot) => (
                                    <motion.tr 
                                        key={slot.addr}
                                        onClick={() => setSelectedSlot(slot.addr)}
                                        animate={{ 
                                            backgroundColor: selectedSlot === slot.addr ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                                        }}
                                        className={`border-b border-zinc-900 cursor-pointer group hover:bg-white/5 transition-colors`}
                                    >
                                        <td className={`px-4 py-4 ${selectedSlot === slot.addr ? 'text-blue-400 font-bold' : 'text-zinc-600'}`}>
                                            {slot.addr}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                slot.type.includes('**') ? 'bg-purple-500/20 text-purple-400' :
                                                slot.type.includes('*') ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-green-500/20 text-green-400'
                                            }`}>
                                                {slot.type} {slot.name}
                                            </span>
                                        </td>
                                        <td className={`px-4 py-4 font-bold ${selectedSlot === slot.addr ? 'text-white' : 'text-zinc-400'}`}>
                                            {slot.value}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Inspect & Action */}
                <div className="flex flex-col gap-6">
                    <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-5 space-y-4 min-h-[200px]">
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <Binary size={14} /> Inspector
                        </h4>
                        
                        {selectedSlot ? (
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <div className="text-2xl font-black text-white italic">
                                        {slots.find(s => s.addr === selectedSlot)?.name}
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                        Type: <span className="text-blue-400">{slots.find(s => s.addr === selectedSlot)?.type}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-2">
                                    <button 
                                        onClick={() => handleUpdateValue(selectedSlot)}
                                        className="btn-primary py-2 text-xs flex items-center justify-center gap-2"
                                    >
                                        <Database size={14} /> Modifica Valore
                                    </button>
                                    
                                    {slots.find(s => s.addr === selectedSlot)?.type.includes('*') && (
                                        <button 
                                            onClick={() => handleDereference(selectedSlot)}
                                            className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
                                        >
                                            <ArrowRight size={14} /> Deferenzia (*{slots.find(s => s.addr === selectedSlot)?.name})
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-zinc-600 italic text-sm">
                                Seleziona una cella di memoria
                            </div>
                        )}
                    </div>

                    <div className="flex-1 bg-black/20 border border-white/5 rounded-xl p-4 overflow-hidden">
                         <h4 className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest mb-3">Live Log</h4>
                         <div className="space-y-2">
                            <AnimatePresence mode="popLayout">
                                {actionLog.map((log, i) => (
                                    <motion.div 
                                        key={log + i}
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 - (i * 0.2) }}
                                        className="text-[11px] font-mono text-zinc-500 border-l border-zinc-800 pl-3"
                                    >
                                        {log}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                         </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-3">
                <Info className="text-blue-500 shrink-0" size={20} />
                <p className="text-sm text-zinc-500 leading-relaxed">
                    <strong>Hacker Insight:</strong> Nota come il valore di un <code>int*</code> è lo stesso dell'indirizzo di memoria della variabile a cui punta. Deferenziare un puntatore significa dire al computer: "Vai a quell'indirizzo e dimmi cosa c'è dentro".
                </p>
            </div>
        </div>
    );
}
