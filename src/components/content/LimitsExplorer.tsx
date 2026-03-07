import { useState } from 'react';
import { Info, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TYPES = [
  { name: 'char', bits: 8, signed: true, min: -128, max: 127 },
  { name: 'unsigned char', bits: 8, signed: false, min: 0, max: 255 },
  { name: 'short', bits: 16, signed: true, min: -32768, max: 32767 },
  { name: 'unsigned short', bits: 16, signed: false, min: 0, max: 65535 },
  { name: 'int', bits: 32, signed: true, min: -2147483648, max: 2147483647 },
  { name: 'unsigned int', bits: 32, signed: false, min: 0, max: 4294967295 },
  { name: 'long long', bits: 64, signed: true, min: '-9,223,372,036,854,775,808', max: '9,223,372,036,854,775,807' },
  { name: 'unsigned long long', bits: 64, signed: false, min: 0, max: '18,446,744,073,709,551,615' },
];

export default function LimitsExplorer() {
  const [selectedType, setSelectedType] = useState(TYPES[4]);

  return (
    <div className="glass-panel p-6 rounded-2xl border-white/10 my-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
          <Calculator size={22} />
        </div>
        <div>
          <h3 className="text-xl font-bold dark:text-white">Limits Explorer</h3>
          <p className="text-sm text-zinc-500">Discover ranges & memory sizes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Select Type</label>
          <div className="grid grid-cols-2 gap-2">
            {TYPES.map((t) => (
              <button
                key={t.name}
                onClick={() => setSelectedType(t)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedType.name === t.name
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                    : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'
                }`}
              >
                <div className="text-sm font-bold">{t.name}</div>
                <div className="text-[10px] opacity-60">{t.bits} bits</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-zinc-950/50 rounded-2xl border border-white/5 p-6 flex flex-col justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedType.name}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6 relative z-10"
            >
              <div>
                <div className="text-[10px] uppercase font-bold tracking-tighter text-zinc-500 mb-1">Bytes in Memory</div>
                <div className="flex gap-1">
                  {Array.from({ length: selectedType.bits / 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 rounded-lg bg-blue-500/30 border border-blue-500/40 flex items-center justify-center text-[10px] font-mono text-blue-300"
                    >
                      B{i}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold tracking-tighter text-zinc-500">Minimum</div>
                  <div className="text-sm font-mono text-zinc-300 break-all">{selectedType.min}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold tracking-tighter text-zinc-500">Maximum</div>
                  <div className="text-sm font-mono text-zinc-300 break-all">{selectedType.max}</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 flex gap-3">
                <Info size={16} className="text-blue-400 shrink-0" />
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {selectedType.signed 
                    ? `Can store both positive and negative values. Uses Two's Complement.`
                    : `Zero or positive only. Optimized for absolute sizes and counters.`}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
