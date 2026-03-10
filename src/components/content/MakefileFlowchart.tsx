import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode, Terminal, ArrowRight, Settings, CheckCircle } from 'lucide-react';

const MakefileFlowchart = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      id: 0,
      title: "Dependency Check",
      desc: "Makefile controlla se main.c o utils.c sono più recenti dell'eseguibile.",
      icon: <FileCode className="text-blue-400" />
    },
    {
      id: 1,
      title: "Compilation",
      desc: "Se i sorgenti sono cambiati, GCC trasforma il C in file oggetto (.o).",
      icon: <Terminal className="text-purple-400" />
    },
    {
      id: 2,
      title: "Linking",
      desc: "Il linker unisce i file .o e le librerie in un unico binario.",
      icon: <Settings className="text-amber-400" />
    },
    {
      id: 3,
      title: "Result",
      desc: "L'eseguibile finale è pronto per correre!",
      icon: <CheckCircle className="text-emerald-400" />
    }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 my-8 font-sans overflow-hidden bg-gradient-to-br from-slate-900 to-indigo-950/20 shadow-2xl">
      <div className="mb-8">
        <h3 className="text-2xl font-black text-white flex items-center gap-2 m-0 uppercase tracking-tighter">
          <Settings className="text-amber-500 animate-spin-slow" />
          Makefile Build Flow
        </h3>
        <p className="text-slate-500 text-sm font-medium">Visualizzazione della Catena di Montaggio</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 hidden md:block -translate-y-1/2 z-0" />

        {steps.map((step, i) => (
          <div key={step.id} className="relative z-10 w-full md:w-1/4">
            <motion.div
              onHoverStart={() => setActiveStep(i)}
              onHoverEnd={() => setActiveStep(null)}
              className={`p-4 rounded-xl border-2 transition-all cursor-help ${activeStep === i ? 'bg-white/10 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)] scale-105' : 'bg-slate-900 border-white/5 opacity-60'}`}
            >
              <div className="mb-3">{step.icon}</div>
              <h4 className={`text-xs font-black uppercase tracking-widest mb-1 ${activeStep === i ? 'text-white' : 'text-slate-500'}`}>{step.title}</h4>
            </motion.div>
            
            {i < steps.length - 1 && (
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden md:block text-white/10">
                <ArrowRight size={16} />
              </div>
            )}

            <AnimatePresence>
              {activeStep === i && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[200px] bg-black/90 p-4 rounded-xl border border-white/10 shadow-2xl z-20 pointer-events-none text-center"
                >
                  <p className="text-[10px] text-slate-300 leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="mt-28 bg-white/5 border border-white/10 rounded-xl p-4 text-[10px] text-slate-400 font-mono italic">
        <span className="text-amber-400 font-bold">PRO TIP:</span> Un Makefile evita di ricompilare tutto ogni volta. Se cambi solo un file su 100, Makefile ricompila solo quello. Risparmio di tempo garantito!
      </div>
    </div>
  );
};

export default MakefileFlowchart;
