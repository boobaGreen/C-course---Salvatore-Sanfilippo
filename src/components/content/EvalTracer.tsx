import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, ArrowDown, Calculator, Database } from 'lucide-react';

interface StackItem {
  id: string;
  value: number | string;
  type: 'constant' | 'variable' | 'op';
}

const EvalTracer = () => {
  const [stack, setStack] = useState<StackItem[]>([]);
  const [step, setStep] = useState(0);

  const program = [
    { type: 'push', value: 10, label: 'PUSH 10' },
    { type: 'push', value: 20, label: 'PUSH 20' },
    { type: 'op', value: '+', label: 'ADD' },
    { type: 'push', value: 2, label: 'PUSH 2' },
    { type: 'op', value: '*', label: 'MUL' },
  ];

  const handleStep = () => {
    if (step >= program.length) return;

    const op = program[step];
    if (op.type === 'push') {
      setStack(prev => [{ id: Math.random().toString(), value: op.value, type: 'constant' }, ...prev]);
    } else if (op.type === 'op') {
      setStack(prev => {
        const b = prev[0]?.value as number;
        const a = prev[1]?.value as number;
        let res = 0;
        if (op.value === '+') res = a + b;
        if (op.value === '*') res = a * b;
        return [{ id: Math.random().toString(), value: res, type: 'op' }, ...prev.slice(2)];
      });
    }
    setStep(prev => prev + 1);
  };

  const reset = () => {
    setStack([]);
    setStep(0);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 my-8 font-sans overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-950 shadow-2xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-black text-white flex items-center gap-2 m-0 uppercase tracking-tighter">
            <Calculator className="text-orange-500" />
            ToyFort Eval Tracer
          </h3>
          <p className="text-zinc-500 text-sm font-medium">Visualizzazione Stack del Linguaggio</p>
        </div>
        <div className="flex gap-2">
            <button onClick={reset} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-zinc-400 transition-colors">
               <RotateCcw size={18} />
            </button>
            <button 
                onClick={handleStep}
                disabled={step >= program.length}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-30 text-white rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-orange-900/40"
            >
               <Play size={14} fill="currentColor" /> Step
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[300px]">
        {/* Memory / Stack */}
        <div className="bg-black/50 rounded-2xl p-6 border border-white/5 relative">
           <div className="text-[10px] font-black text-zinc-600 mb-6 flex items-center gap-2 uppercase">
             <Database size={12} /> ToyFort Stack (LIFO)
           </div>
           
           <div className="flex flex-col gap-2 min-h-[200px] justify-start max-w-[200px] mx-auto">
              <AnimatePresence mode="popLayout">
                {stack.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className={`p-4 rounded-xl border-2 flex items-center justify-center font-mono text-xl font-black shadow-xl ${idx === 0 ? 'bg-orange-500/20 border-orange-500 text-white' : 'bg-zinc-800 border-white/5 text-zinc-500'}`}
                  >
                    {item.value}
                  </motion.div>
                ))}
              </AnimatePresence>
              {stack.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-zinc-700 font-mono italic text-sm">
                   Stack Vuoto
                </div>
              )}
           </div>
           
           <div className="absolute bottom-4 left-0 w-full flex justify-center opacity-20">
              <ArrowDown className="animate-bounce" />
           </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4">
           <div className="text-[10px] font-black text-zinc-600 uppercase">Bytecode Stream</div>
           <div className="space-y-2">
              {program.map((op, i) => (
                <div key={i} className={`p-3 rounded-lg border flex justify-between items-center transition-all ${step === i ? 'bg-white/10 border-orange-500 pl-6' : 'bg-black/20 border-white/5 opacity-40'}`}>
                   <span className={`font-mono text-sm font-bold ${step === i ? 'text-orange-400' : 'text-zinc-500'}`}>{op.label}</span>
                   {step === i && <motion.div layoutId="ptr" className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_orange]" />}
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="mt-8 bg-black/40 border border-white/5 rounded-xl p-4 text-xs text-zinc-400 leading-relaxed">
         <strong className="text-orange-500">How it works:</strong> ToyFort è un linguaggio basato su stack. Ogni numero viene "spinto" (PUSH) in cima. Gli operatori (come ADD) prelevano i primi due elementi, li elaborano e spingono il risultato in cima. Semplice ed efficiente.
      </div>
    </div>
  );
};

export default EvalTracer;
