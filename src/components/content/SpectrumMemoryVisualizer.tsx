import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Layout } from 'lucide-react';

export default function SpectrumMemoryVisualizer() {
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

    const regions = [
        { id: 'bitmap', label: 'Bitmap (0-6143)', color: 'bg-indigo-500', size: 'h-32', description: 'Pixel data: 1 bit per pixel. 256x192 resolution.' },
        { id: 'attr', label: 'Attributes (6144-6911)', color: 'bg-emerald-500', size: 'h-8', description: 'Color data: 1 byte per 8x8 block (INK, PAPER, BRIGHT, FLASH).' },
        { id: 'sys', label: 'System Vars', color: 'bg-zinc-700', size: 'h-4', description: 'Keyboard state, cursor position, etc.' }
    ];

    return (
        <div className="glass-panel p-6 rounded-2xl border-white/10 my-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <Cpu size={22} />
                </div>
                <div>
                    <h3 className="text-xl font-bold dark:text-white text-emerald-400">ZX Spectrum Memory Map</h3>
                    <p className="text-sm text-zinc-500">How 6.75KB defines an entire world</p>
                </div>
            </div>

            <div className="flex flex-col gap-1 mb-8">
                {regions.map((region) => (
                    <motion.div
                        key={region.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedRegion(region.id)}
                        className={`${region.color} ${region.size} rounded-lg cursor-pointer flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-widest border border-white/10 shadow-lg relative group`}
                    >
                        {region.label}
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors rounded-lg" />
                    </motion.div>
                ))}
            </div>

            <div className="min-h-[80px] p-4 rounded-xl bg-zinc-950/50 border border-white/5">
                {selectedRegion ? (
                    <div className="flex items-start gap-3 animate-in fade-in slide-in-from-left-2">
                        <Layout className="text-indigo-400 mt-1" size={16} />
                        <div>
                            <h4 className="text-xs font-bold text-white mb-1">
                                {regions.find(r => r.id === selectedRegion)?.label}
                            </h4>
                            <p className="text-xs text-zinc-400 leading-relaxed italic">
                                {regions.find(r => r.id === selectedRegion)?.description}
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="text-xs text-zinc-500 italic text-center py-4">
                        Click a memory region to inspect its function
                    </p>
                )}
            </div>
            
            <div className="mt-6 flex justify-center gap-4">
               <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                   <div className="w-2 h-2 rounded-full bg-indigo-500" /> Bitmap (Pixels)
               </div>
               <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                   <div className="w-2 h-2 rounded-full bg-emerald-500" /> Attributes (Colors)
               </div>
            </div>
        </div>
    );
}
