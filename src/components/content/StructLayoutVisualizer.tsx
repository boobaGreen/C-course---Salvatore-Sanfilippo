import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, LayoutGrid, Zap, ShieldCheck } from 'lucide-react';

interface Field {
  name: string;
  type: string;
  size: number;
  alignment: number;
  color: string;
}

const StructLayoutVisualizer = () => {
  const [isPacked, setIsPacked] = useState(false);
  
  const fields: Field[] = useMemo(() => [
    { name: 'char a', type: 'char', size: 1, alignment: 1, color: '#10b981' }, // emerald-500
    { name: 'int b', type: 'int', size: 4, alignment: 4, color: '#3b82f6' },  // blue-500
    { name: 'short c', type: 'short', size: 2, alignment: 2, color: '#a855f7' }, // purple-500
  ], []);

  const layout = useMemo(() => {
    const bytes: { type: 'data' | 'padding'; field?: string; color?: string; index: number }[] = [];
    let currentPos = 0;

    fields.forEach((field) => {
      if (!isPacked) {
        // Calculate padding needed for alignment
        const paddingNeeded = (field.alignment - (currentPos % field.alignment)) % field.alignment;
        for (let i = 0; i < paddingNeeded; i++) {
          bytes.push({ type: 'padding', index: currentPos++ });
        }
      }

      // Add field bytes
      for (let i = 0; i < field.size; i++) {
        bytes.push({ type: 'data', field: field.name, color: field.color, index: currentPos++ });
      }
    });

    if (!isPacked) {
        // Final structure alignment (usually aligned to the largest member's alignment)
        const maxAlign = Math.max(...fields.map(f => f.alignment));
        const finalPadding = (maxAlign - (currentPos % maxAlign)) % maxAlign;
        for (let i = 0; i < finalPadding; i++) {
          bytes.push({ type: 'padding', index: currentPos++ });
        }
    }

    return bytes;
  }, [fields, isPacked]);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 my-8 font-sans overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-black text-white flex items-center gap-2 m-0 tracking-tight">
            <LayoutGrid className="text-blue-400" />
            Struct Layout Visualizer
          </h3>
          <p className="text-slate-400 text-sm font-medium">Padding & Memory Alignment</p>
        </div>
        
        <div className="flex items-center gap-4">
            <button 
                onClick={() => setIsPacked(!isPacked)}
                className={`px-4 py-2 rounded-xl border font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${isPacked ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
            >
                {isPacked ? <Zap size={14} fill="currentColor" /> : <ShieldCheck size={14} />}
                {isPacked ? 'Packed Mode: ON' : 'Packed Mode: OFF'}
            </button>
        </div>
      </div>

      <div className="bg-black/40 rounded-2xl p-6 border border-white/5 mb-8">
        <div className="flex flex-wrap gap-4 mb-6">
           <div className="font-mono text-sm text-zinc-400 bg-black/50 p-4 rounded-lg border border-white/5 flex-1 min-w-[200px]">
              <div className="text-purple-400">struct <span className="text-white font-bold">Data</span> {'{'}</div>
              <div className="pl-4 text-emerald-400">char <span className="text-zinc-300">a;</span></div>
              <div className="pl-4 text-blue-400">int <span className="text-zinc-300">b;</span></div>
              <div className="pl-4 text-purple-400">short <span className="text-zinc-300">c;</span></div>
              <div className="text-purple-400">{'}'}{isPacked ? ' __attribute__((packed))' : ''};</div>
           </div>
           
           <div className="flex flex-col justify-center gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                 <div className="text-[10px] font-black text-zinc-500 uppercase mb-1">Total Size</div>
                 <div className="text-3xl font-black text-white font-mono">{layout.length} <span className="text-xs text-zinc-500 uppercase">bytes</span></div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                 <div className="text-[10px] font-black text-zinc-500 uppercase mb-1">Padding Junk</div>
                 <div className="text-3xl font-black text-amber-500 font-mono">
                    {layout.filter(b => b.type === 'padding').length} <span className="text-xs text-zinc-500 uppercase">bytes</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">Memory Address View (1 cell = 1 byte)</div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            <AnimatePresence mode="popLayout">
                {layout.map((byte, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`aspect-square rounded-md border flex flex-col items-center justify-center relative group ${byte.type === 'padding' ? 'bg-amber-500/5 border-amber-500/20' : 'border-white/10 shadow-lg'}`}
                        style={{ backgroundColor: byte.type === 'data' ? `${byte.color}33` : undefined, borderColor: byte.type === 'data' ? byte.color : undefined }}
                    >
                        <div className="text-[9px] font-mono text-white/40 mb-0.5 group-hover:text-white transition-colors">{i.toString().padStart(2, '0')}</div>
                        {byte.type === 'padding' && <div className="text-[8px] font-bold text-amber-500/50 uppercase">PAD</div>}
                        {byte.type === 'data' && <div className="text-[10px] font-black text-white uppercase">{byte.field?.split(' ')[1]}</div>}
                        
                        {/* Tooltip on hover */}
                        <div className="absolute -bottom-10 hidden group-hover:block bg-black p-2 rounded border border-white/10 z-30 whitespace-nowrap shadow-2xl pointer-events-none">
                           <div className="text-[10px] text-zinc-400">Byte {i} - {byte.type === 'padding' ? 'Padding (unused)' : `Data (${byte.field})`}</div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-3 items-start">
           <Info className="text-blue-400 mt-1 shrink-0" size={16} />
           <div>
              <h5 className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Alignment Rule</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                 Un <code className="text-zinc-200">int</code> (4 byte) deve iniziare ad un indirizzo divisibile per 4. Se il campo precedente finisce all'indirizzo 1, il compilatore "salta" 3 byte.
              </p>
           </div>
        </div>
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex gap-3 items-start">
           <Zap className="text-amber-400 mt-1 shrink-0" size={16} fill="currentColor" />
           <div>
              <h5 className="text-[10px] font-black uppercase text-amber-400 tracking-widest mb-1">Struct Packing</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Il <code className="text-zinc-200">__attribute__((packed))</code> elimina lo spazio vuoto, risparmiando RAM ma rendendo l'accesso più faticoso per la CPU.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StructLayoutVisualizer;
