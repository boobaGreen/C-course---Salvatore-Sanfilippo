import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Play, RotateCcw, Zap } from 'lucide-react';

const GRID_SIZE = 8;
const TARGET_COLOR = '#10b981'; // emerald-500
const START_COLOR = '#3f3f46';  // zinc-700

export default function SimulatedAnnealingVisualizer() {
  const [grid, setGrid] = useState<string[]>([]);
  const [temp, setTemp] = useState(1);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);

  const initGrid = useCallback(() => {
    const newGrid = Array(GRID_SIZE * GRID_SIZE).fill(START_COLOR);
    setGrid(newGrid);
    setScore(0);
    setGeneration(0);
    setTemp(1);
  }, []);

  useEffect(() => {
    const newGrid = Array(GRID_SIZE * GRID_SIZE).fill(START_COLOR);
    setGrid(newGrid);
    setScore(0);
    setGeneration(0);
    setTemp(1);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (running && score < 100) {
      timer = setInterval(() => {
        setGrid(prev => {
          const next = [...prev];
          const index = Math.floor(Math.random() * next.length);
          
          // Mutation logic: if temp is high, we can change to a "worse" or random state
          // As temp drops, we favor the target color
          const probability = Math.random();
          if (probability < temp || probability > 0.8) {
             next[index] = next[index] === TARGET_COLOR ? START_COLOR : TARGET_COLOR;
          }
          
          return next;
        });
        
        setGeneration(g => g + 1);
        setTemp(t => Math.max(0.01, t * 0.98));
      }, 50);
    } else if (score >= 100) {
      setRunning(false);
    }
    return () => clearInterval(timer);
  }, [running, score, temp]);

  useEffect(() => {
    const hits = grid.filter(c => c === TARGET_COLOR).length;
    setScore(Math.round((hits / (GRID_SIZE * GRID_SIZE)) * 100));
  }, [grid]);

  return (
    <div className="glass-panel p-6 rounded-2xl border-white/10 my-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
            <Thermometer size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold dark:text-white">Simulated Annealing</h3>
            <p className="text-sm text-zinc-500">Discromia reduction simulation</p>
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
            onClick={initGrid}
            className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:bg-white/10 transition-colors"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 items-center">
        <div className="grid grid-cols-8 gap-1 bg-zinc-950 p-2 rounded-xl border border-white/5 aspect-square">
          {grid.map((color, i) => (
            <motion.div
              key={i}
              animate={{ 
                backgroundColor: color,
                scale: color === TARGET_COLOR ? 1 : 0.9,
              }}
              className="w-full h-full rounded-[2px]"
            />
          ))}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              <span>Temperature</span>
              <span>{(temp * 100).toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-orange-500"
                animate={{ width: `${temp * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              <span>Discromia Score</span>
              <span className="text-emerald-400">{score}%</span>
            </div>
            <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-emerald-500"
                animate={{ width: `${score}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
             <div className="flex items-center gap-2 mb-2 text-zinc-400">
               <Zap size={14} className="text-yellow-500" />
               <span className="text-xs font-bold uppercase tracking-tighter">Optimizer Log</span>
             </div>
             <div className="font-mono text-[10px] text-zinc-500">
                <div>GEN: {generation.toString().padStart(6, '0')}</div>
                <div>STATE: {running ? 'MUTATING' : score >= 100 ? 'STABLE' : 'IDLE'}</div>
             </div>
          </div>
        </div>
      </div>
      
      <p className="mt-6 text-[11px] text-zinc-500 leading-relaxed italic border-l-2 border-orange-500/30 pl-4">
        "Proprio come nel video di Salvatore, l'algoritmo accetta inizialmente cambiamenti peggiorativi per uscire dai minimi locali, per poi stabilizzarsi quando la 'temperatura' scende."
      </p>
    </div>
  );
}
