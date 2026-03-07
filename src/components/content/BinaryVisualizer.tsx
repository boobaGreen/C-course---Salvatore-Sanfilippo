import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Binary } from 'lucide-react';

export default function BinaryVisualizer() {
  const [value, setValue] = useState(42);
  
  const binary = value.toString(2).padStart(8, '0');
  
  return (
    <div className="glass-panel p-6 rounded-2xl border-white/10 my-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Binary size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold dark:text-white">Binary Visualizer</h3>
            <p className="text-sm text-zinc-500">See how numbers are stored as bits</p>
          </div>
        </div>
        <div className="text-center">
            <input 
              type="range" 
              min="0" 
              max="255" 
              value={value} 
              onChange={(e) => setValue(parseInt(e.target.value))}
              className="w-32 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="text-xs font-mono mt-1 text-zinc-500">Decimal: {value}</div>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-2 mb-6">
        {binary.split('').map((bit, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="text-[10px] font-mono text-zinc-600">2^{7-i}</div>
            <motion.div
              animate={{ 
                backgroundColor: bit === '1' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(24, 24, 27, 0.5)',
                borderColor: bit === '1' ? 'rgba(168, 85, 247, 0.6)' : 'rgba(39, 39, 42, 1)',
                boxShadow: bit === '1' ? '0 0 15px rgba(168, 85, 247, 0.3)' : 'none'
              }}
              className="w-full aspect-square rounded-xl border flex items-center justify-center text-xl font-black transition-colors"
            >
              <motion.span
                key={bit}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={bit === '1' ? 'text-purple-400' : 'text-zinc-700'}
              >
                {bit}
              </motion.span>
            </motion.div>
            <div className="text-[10px] font-mono text-zinc-600">{Math.pow(2, 7-i)}</div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-zinc-950/50 border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cpu size={16} className="text-zinc-500" />
          <span className="text-sm text-zinc-400 font-mono">1 Byte Representation</span>
        </div>
        <div className="text-lg font-mono font-bold text-purple-400">
           {binary.slice(0, 4)} {binary.slice(4)}
        </div>
      </div>
    </div>
  );
}
