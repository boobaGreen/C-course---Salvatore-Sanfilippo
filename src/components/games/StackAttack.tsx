import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Layers, Play, RefreshCw, Send, Zap, ShieldAlert, CheckCircle } from 'lucide-react';

const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

interface StackFrame {
  id: number;
  n: number;
  isActive: boolean;
  returnValue?: number;
}

const StackAttack = () => {
  const [frames, setFrames] = useState<StackFrame[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'calling' | 'waitingInput' | 'returning' | 'won' | 'lost'>('idle');
  const [userInput, setUserInput] = useState('');
  const [targetN, setTargetN] = useState(0);
  const [expectedValue, setExpectedValue] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const startLevel = useCallback(() => {
    const n = Math.floor(Math.random() * 3) + 3; // 3 to 5
    setTargetN(n);
    setExpectedValue(factorial(n));
    setFrames([{ id: 0, n, isActive: true }]);
    setGameState('calling');
    setFeedback(null);
    setUserInput('');
  }, []);

  useEffect(() => {
    if (gameState === 'calling') {
      const lastFrame = frames[frames.length - 1];
      if (lastFrame.n > 1) {
        const timer = setTimeout(() => {
          setFrames(prev => [
            ...prev.map(f => ({ ...f, isActive: false })),
            { id: prev.length, n: lastFrame.n - 1, isActive: true }
          ]);
        }, 800);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setGameState('waitingInput');
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [gameState, frames]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(userInput);
    if (val === expectedValue) {
      setGameState('returning');
      setScore(prev => prev + 100);
      setFeedback('Corretto! Inizio risalita dello stack...');
    } else {
      setGameState('lost');
      setFeedback(`Errato! Il valore corretto era ${expectedValue}. Stack Overflow!`);
    }
  };

  useEffect(() => {
    if (gameState === 'returning') {
      if (frames.length > 0) {
        const timer = setTimeout(() => {
          setFrames(prev => {
            const next = [...prev];
            const returning = next.pop();
            if (next.length > 0) {
              next[next.length - 1].isActive = true;
              next[next.length - 1].returnValue = returning?.returnValue || 1; 
            }
            return next;
          });
        }, 600);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setGameState('won');
          setFeedback('Livello completato! Stack pulito.');
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [gameState, frames]);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 my-8 font-sans overflow-hidden bg-gradient-to-br from-slate-900 to-indigo-900/30">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-black text-white flex items-center gap-2 m-0">
            <Layers className="text-indigo-400" />
            StackAttack
          </h3>
          <p className="text-slate-400 text-sm">Recursion Defense Game</p>
        </div>
        <div className="bg-black/40 px-4 py-2 rounded-xl border border-white/5 flex items-center gap-2 font-mono font-bold text-indigo-300">
          SCORE: {score.toString().padStart(5, '0')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[400px]">
        {/* Left: Code Box */}
        <div className="bg-black/50 rounded-xl p-6 border border-white/5 flex flex-col justify-between">
          <div className="font-mono text-sm">
            <div className="text-emerald-400 mb-2">// Recursive Factorial</div>
            <div className="text-purple-400">int <span className="text-white">factorial</span>(int <span className="text-amber-400">n</span>) {'{'}</div>
            <div className="pl-4 text-zinc-400">
              <span className="text-purple-400">if</span> (n &lt;= 1) <span className="text-purple-400">return</span> 1;
            </div>
            <div className="pl-4 text-purple-400">
              return <span className="text-white">n * </span>factorial(n - 1);
            </div>
            <div className="text-purple-400">{'}'}</div>
          </div>

          <div className="mt-8">
            {gameState === 'idle' || gameState === 'won' || gameState === 'lost' ? (
              <button 
                onClick={startLevel}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
              >
                {gameState === 'idle' ? 'Inizia Missione' : 'Nuovo Livello'} <Play size={20} fill="currentColor" />
              </button>
            ) : gameState === 'waitingInput' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Zap size={14} fill="currentColor" /> Qual è il valore finale di factorial({targetN})?
                </div>
                <div className="flex gap-2">
                  <input 
                    autoFocus
                    type="number"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="flex-1 bg-white/5 border border-indigo-500/30 rounded-lg px-4 py-3 text-white font-mono text-xl focus:outline-none focus:border-indigo-500 shadow-inner"
                    placeholder="Calcola..."
                  />
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 bg-white/5 rounded-lg border border-white/10 animate-pulse text-indigo-300 font-bold">
                {gameState === 'calling' ? 'Chiamate in corso...' : 'Valore calcolato! Risalita...'}
              </div>
            )}
          </div>
        </div>

        {/* Right: Stack Visualizer */}
        <div className="bg-black/30 rounded-xl p-4 border border-white/5 flex flex-col items-center justify-end relative overflow-hidden">
             
             <div className="absolute top-4 left-4 text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">Memory Stack Area</div>
             <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500/30" />

             <div className="w-full space-y-2 flex flex-col-reverse max-h-[350px] overflow-visible pb-4">
                <AnimatePresence mode="popLayout">
                    {frames.map((frame, idx) => (
                        <motion.div
                            key={frame.id}
                            initial={{ opacity: 0, y: 50, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className={`w-full p-4 rounded-xl border-2 flex justify-between items-center ${frame.isActive ? 'bg-indigo-500/20 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'bg-slate-800/40 border-white/10 text-slate-500'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Box className={frame.isActive ? 'text-indigo-400' : 'text-slate-700'} size={20} />
                                <div className="font-mono font-bold">factorial({frame.n})</div>
                            </div>
                            {idx === 0 && <div className="text-[10px] font-bold uppercase text-zinc-600">Base Frame</div>}
                        </motion.div>
                    ))}
                </AnimatePresence>
             </div>

             {gameState === 'lost' && (
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 z-20 bg-red-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
                >
                    <ShieldAlert size={64} className="text-red-400 mb-4 animate-bounce" />
                    <h4 className="text-2xl font-black text-white mb-2 uppercase">Stack Overflow!</h4>
                    <p className="text-red-200 text-sm mb-6">{feedback}</p>
                    <button onClick={startLevel} className="px-6 py-2 bg-white text-red-900 font-bold rounded-lg hover:bg-zinc-100 transition-all flex items-center gap-2">
                        <RefreshCw size={18} /> Riavvia
                    </button>
                </motion.div>
             )}

             {gameState === 'won' && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-20 bg-emerald-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
                >
                    <CheckCircle size={64} className="text-emerald-400 mb-4 animate-pulse" />
                    <h4 className="text-2xl font-black text-white mb-2 uppercase">Clean Exit!</h4>
                    <p className="text-emerald-200 text-sm mb-6">{feedback}</p>
                    <button onClick={startLevel} className="px-6 py-2 bg-white text-emerald-900 font-bold rounded-lg hover:bg-zinc-100 transition-all flex items-center gap-2">
                        <Play size={18} fill="currentColor" /> Prossimo
                    </button>
                </motion.div>
             )}
        </div>
      </div>

      <div className="mt-8 bg-black/40 border border-white/5 rounded-xl p-4 text-xs text-slate-400 flex items-start gap-3">
        <Zap className="text-amber-400 shrink-0 mt-0.5" size={16} fill="currentColor" />
        <div>
            <strong className="text-zinc-300">Missione Didattica:</strong> Osserva come ogni chiamata crea un nuovo elemento sulla destra. In C, se non inserisci il risultato corretto per permettere la risalita (return), lo stack continuerà a crescere all'infinito portando al crash del programma.
        </div>
      </div>
    </div>
  );
};

export default StackAttack;
