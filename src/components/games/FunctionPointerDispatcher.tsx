import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Code, Cpu, Layers, Zap } from 'lucide-react';

interface FunctionBlock {
  id: string;
  name: string;
  address: string;
  color: string;
}

const FunctionPointerDispatcher = () => {
  const [selectedInx, setSelectedInx] = useState<number | null>(null);
  const [isJumping, setIsJumping] = useState(false);
  const [ripPos, setRipPos] = useState<'base' | 'table' | 'function'>('base');
  const [output, setOutput] = useState<string[]>([]);

  const functions: FunctionBlock[] = [
    { id: 'add', name: 'add()', address: '0x1140', color: 'emerald' },
    { id: 'del', name: 'del()', address: '0x1160', color: 'amber' },
    { id: 'save', name: 'save()', address: '0x1180', color: 'purple' },
    { id: 'reset', name: 'reset()', address: '0x11A0', color: 'rose' },
  ];

  const handleDispatch = (index: number) => {
    if (isJumping) return;
    
    setSelectedInx(index);
    setIsJumping(true);
    setRipPos('table');
    setOutput(prev => [`> dispatch_table[${index}]() ...`, ...prev.slice(0, 4)]);

    setTimeout(() => {
        setRipPos('function');
        setTimeout(() => {
            const func = functions[index];
            setOutput(prev => [`[CPU] Esecuzione in ${func.address}: ${func.name} completata.`, ...prev.slice(0, 5)]);
            setIsJumping(false);
            setRipPos('base');
        }, 800);
    }, 800);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 my-8 font-sans overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-900/20 shadow-2xl">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-2xl font-black text-white flex items-center gap-2 m-0 tracking-tight">
            <Zap className="text-emerald-400 animate-pulse" />
            Jump Table Visualizer
          </h3>
          <p className="text-slate-400 text-sm font-medium">Dispacciamento O(1) con Puntatori a Funzione</p>
        </div>
        <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
           <Cpu className="text-blue-400 w-5 h-5" />
           <span className="text-blue-300 font-mono text-xs font-bold uppercase tracking-widest">CPU Pipeline</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* dispatch Source */}
        <div className="space-y-4">
           <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
             <Code size={12} /> Sorgente C
           </div>
           <div className="bg-black/50 rounded-xl p-4 border border-white/5 font-mono text-xs h-full">
              <div className="text-emerald-400/60 mb-2">// Array di puntatori</div>
              <div className="text-zinc-300">void (*comandi[])() = {'{'}</div>
              {functions.map((f, i) => (
                <button 
                  key={f.id}
                  onClick={() => handleDispatch(i)}
                  disabled={isJumping}
                  className={`block w-full text-left pl-4 py-1 rounded transition-colors ${selectedInx === i ? 'bg-emerald-500/20 text-emerald-300 border-l-2 border-emerald-500' : 'hover:bg-white/5 text-zinc-500'}`}
                >
                  {f.id}, // index {i}
                </button>
              ))}
              <div className="text-zinc-300">{'}'};</div>
              <div className="mt-4 text-emerald-400">comandi[<span className="text-white font-bold">{selectedInx !== null ? selectedInx : '?'}</span>]();</div>
           </div>
        </div>

        {/* Central: Memory/Table Visualizer */}
        <div className="lg:col-span-2 space-y-8 relative">
           
           {/* Displacement Table */}
           <div>
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Layers size={12} /> Sezione .data (Jump Table)
              </div>
              <div className="grid grid-cols-4 gap-2">
                {functions.map((f, i) => (
                  <div key={`tab-${f.id}`} className={`relative p-3 rounded-lg border flex flex-col items-center justify-center transition-all ${selectedInx === i && ripPos === 'table' ? 'bg-emerald-500/20 border-emerald-500 shadow-lg scale-110 z-10' : 'bg-slate-900 border-white/5 opacity-40'}`}>
                    <div className="text-[10px] text-zinc-500 font-mono">[{i}]</div>
                    <div className="text-xs font-black text-white py-1">{f.address}</div>
                    {selectedInx === i && ripPos === 'table' && (
                        <motion.div layoutId="rip" className="absolute -top-6 text-emerald-400">
                          <ArrowRight className="rotate-90" size={16} />
                        </motion.div>
                    )}
                  </div>
                ))}
              </div>
           </div>

           {/* Code Segment (.text) */}
           <div className="pt-8">
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Layers size={12} /> Sezione .text (Codice Eseguibile)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {functions.map((f, i) => (
                  <div key={`text-${f.id}`} className={`relative p-4 rounded-xl border transition-all ${selectedInx === i && ripPos === 'function' ? `bg-${f.color}-500/20 border-${f.color}-500 shadow-xl scale-105` : 'bg-slate-900 border-white/5 grayscale opacity-30'}`}>
                    <div className="text-[10px] font-mono text-zinc-400 mb-1">{f.address}</div>
                    <div className={`text-sm font-black text-${f.color}-400`}>{f.name}</div>
                    <div className="mt-2 h-1 w-full bg-white/5 overflow-hidden rounded-full">
                       {selectedInx === i && ripPos === 'function' && <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 0.8 }} className={`h-full w-full bg-${f.color}-400`} />}
                    </div>
                  </div>
                ))}
              </div>
           </div>

           {/* The Console / Log */}
           <div className="bg-black/80 rounded-xl p-4 border border-emerald-500/10 font-mono text-[10px] text-emerald-500/80 mt-10 min-h-[100px] shadow-inner">
             <div className="mb-2 font-bold opacity-30">// Kernel Console Output</div>
             <AnimatePresence>
                {output.map((line, i) => (
                  <motion.div 
                    key={`${i}-${line}`}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={i === 0 ? 'text-emerald-400 font-bold' : ''}
                  >
                    {line}
                  </motion.div>
                ))}
             </AnimatePresence>
           </div>
        </div>
      </div>
      
      <div className="mt-8 bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 text-xs text-slate-400">
         <strong className="text-emerald-400">Insight:</strong> Nota come la CPU non esegua "ricerche". L'indice viene moltiplicato per la dimensione del puntatore per ottenere l'indirizzo esatto in memoria. Questo è il segreto delle performance di Redis e del Kernel Linux.
      </div>
    </div>
  );
};

export default FunctionPointerDispatcher;
