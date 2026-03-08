import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Activity } from 'lucide-react';

export default function EvoSimulator() {
    const [gen, setGen] = useState(0);
    const [running, setRunning] = useState(false);
    const [noiseLevel, setNoiseLevel] = useState(1);

    useEffect(() => {
        let timer: any;
        if (running && gen < 100) {
            timer = setInterval(() => {
                setGen(prev => prev + 1);
                setNoiseLevel(Math.max(0, 1 - (gen / 80)));
            }, 50);
        } else if (gen >= 100) {
            setRunning(false);
        }
        return () => clearInterval(timer);
    }, [running, gen]);

    const reset = () => {
        setGen(0);
        setNoiseLevel(1);
        setRunning(false);
    };

    return (
        <div className="glass-panel p-6 rounded-2xl border-white/10 my-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                        <Activity size={22} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold dark:text-white">Evolutionary Optimizer</h3>
                        <p className="text-sm text-zinc-500">Progressive convergence demo</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setRunning(!running)}
                        className={`p-2 rounded-lg transition-colors ${running ? 'bg-orange-500 text-white' : 'bg-white/5 text-zinc-400 hover:bg-white/10'}`}
                    >
                        <Play size={18} fill={running ? "white" : "none"} />
                    </button>
                    <button 
                        onClick={reset}
                        className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:bg-white/10 transition-colors"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>
            </div>

            <div className="relative aspect-video bg-zinc-950 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={gen > 80 ? 'done' : 'noise'}
                    className="w-full h-full flex flex-col items-center justify-center"
                  >
                    {/* Simulated Noise/Image */}
                    <div 
                      className="w-32 h-32 rounded-full border-4 border-orange-500/30 relative"
                      style={{ 
                        filter: `blur(${noiseLevel * 10}px)`,
                        opacity: 0.3 + (1 - noiseLevel) * 0.7,
                        transform: `scale(${0.8 + (1 - noiseLevel) * 0.2})`
                      }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-600 rounded-full blur-xl opacity-20" />
                        <div className="absolute inset-4 rounded-full border border-orange-500/20" />
                        <div className="absolute inset-0 flex items-center justify-center text-orange-500">
                             <Palmtree size={48} className={gen < 20 ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'} />
                        </div>
                    </div>
                    
                    {/* Data Overlay */}
                    <div className="absolute bottom-4 left-4 font-mono text-[10px] text-zinc-500 space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="w-16">GEN:</span>
                            <span className="text-orange-400">{gen.toString().padStart(4, '0')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-16">LOSS:</span>
                            <span className="text-emerald-400">{(noiseLevel * 45 + 5).toFixed(2)}%</span>
                        </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
            </div>

            <div className="mt-6 flex flex-col gap-2">
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-orange-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${gen}%` }}
                    />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-600 uppercase font-bold tracking-tighter">
                   <span>Initial Noise</span>
                   <span>Hardware Limit Reached</span>
                </div>
            </div>
        </div>
    );
}

function Palmtree({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4l1-1 1 1h1Z"/>
      <path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3l-1-1-1 1h-.19"/>
      <path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43L11 12l-5.11-2.29Z"/>
      <path d="M11 12 5.54 19.03c1.96 1.96 5.28 1.81 7.43-.35l-2.29-5.11-1.68-1.57Z"/>
      <path d="M11 12l5.11 2.29c2.15-2.15 2.3-5.47.35-7.43L11 12Z"/>
      <path d="M11 12l1.57 1.68 5.11 2.29c-2.15-2.15-2.3-5.47-.35-7.43l-6.33 3.46Z"/>
      <path d="M11 12l1.68 1.57 5.11 2.29c2.15-2.15 2.3-5.47.35-7.43L11 12Z"/>
      <path d="M21 21v-3.25c0-.97-.39-1.89-1.08-2.57C18.91 14.17 17.5 13 15 13"/>
      <path d="M3 21v-3.25c0-.97.39-1.89 1.08-2.57C5.09 14.17 6.5 13 9 13"/>
    </svg>
  );
}
