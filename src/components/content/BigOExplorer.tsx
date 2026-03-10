import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Timer } from 'lucide-react';

const GRID_N = 16; // 16x16 grid for demo

export default function BigOExplorer() {
  const [activeMode, setActiveMode] = useState<'scan' | 'local'>('scan');
  const [scanIndex, setScanIndex] = useState(-1);
  const [localBlock, setLocalBlock] = useState(false);
  const [opsCount, setOpsCount] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (activeMode === 'scan') {
      setOpsCount(0);
      setScanIndex(0);
      interval = setInterval(() => {
        setScanIndex(prev => {
          if (prev >= GRID_N * GRID_N - 1) {
            return 0;
          }
          setOpsCount(o => o + 1);
          return prev + 1;
        });
      }, 20);
    } else {
      setScanIndex(-1);
      setOpsCount(0);
      interval = setInterval(() => {
        setLocalBlock(true);
        setOpsCount(64); // Fixed 8x8 cost
        setTimeout(() => setLocalBlock(false), 200);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [activeMode]);

  return (
    <div className="glass-panel p-6 rounded-2xl border-white/10 my-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Cpu size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold dark:text-white">O(N) vs O(1)</h3>
            <p className="text-sm text-zinc-500">Buffer update complexity</p>
          </div>
        </div>
        <div className="flex bg-zinc-900 rounded-lg p-1">
          <button 
            onClick={() => setActiveMode('scan')}
            className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${activeMode === 'scan' ? 'bg-blue-500 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Global Scan
          </button>
          <button 
            onClick={() => setActiveMode('local')}
            className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${activeMode === 'local' ? 'bg-emerald-500 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Local 8x8
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-950 p-4 rounded-xl border border-white/5 relative aspect-square">
          <div className="grid grid-cols-16 gap-px h-full">
            {Array.from({ length: GRID_N * GRID_N }).map((_, i) => (
              <div 
                key={i} 
                className={`w-full aspect-square rounded-[1px] transition-colors duration-200 ${
                    activeMode === 'scan' 
                        ? (i === scanIndex ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]' : 'bg-blue-900/20')
                        : (activeMode === 'local' && i >= 50 && i < 54 || i >= 66 && i < 70 ? (localBlock ? 'bg-emerald-400' : 'bg-emerald-900/20') : 'bg-zinc-900/30')
                }`} 
              />
            ))}
          </div>
          <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[8px] font-mono text-zinc-400 uppercase">
             Virtual Screen Buffer
          </div>
        </div>

        <div className="flex flex-col justify-center gap-6">
           <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={16} className={activeMode === 'scan' ? 'text-blue-400' : 'text-emerald-400'} />
                  <span className="text-sm font-bold text-white uppercase tracking-tighter">Performance</span>
                </div>
                <div className={`text-xl font-mono font-bold ${activeMode === 'scan' ? 'text-blue-400' : 'text-emerald-400'}`}>
                  {activeMode === 'scan' ? 'O(N)' : 'O(1)'}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-500 uppercase">
                    <span>Instructions / Cycle</span>
                    <span>{opsCount} ops</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${activeMode === 'scan' ? 'bg-blue-500' : 'bg-emerald-500'}`}
                      animate={{ width: activeMode === 'scan' ? `${(opsCount / 256) * 100}%` : `${(64 / 256) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
           </div>

           <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
              <Timer size={18} className="text-zinc-500 shrink-0 mt-1" />
              <p className="text-xs text-zinc-400 leading-relaxed">
                {activeMode === 'scan' 
                  ? "La scansione globale ricalcola ogni pixel dell'immagine. Al crescere della risoluzione, il costo computazionale esplode linearmente." 
                  : "L'ottimizzazione locale tocca solo l'area interessata dalla mutazione (8x8). Il costo rimane costante indipendentemente dalla risoluzione dello schermo."}
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
