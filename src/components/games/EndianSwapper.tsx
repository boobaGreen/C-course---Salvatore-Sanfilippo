import { useState, useEffect, useCallback } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { Shuffle, CheckCircle, XCircle, Timer, Award, RefreshCw } from 'lucide-react';

interface Byte {
  id: string;
  value: string;
}

const EndianSwapper = () => {
  const [level, setLevel] = useState(1);
  const [targetValue, setTargetValue] = useState('0x11223344');
  const [targetEndianness, setTargetEndianness] = useState<'Little' | 'Big'>('Little');
  const [bytes, setBytes] = useState<Byte[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    // We only want to auto-start if we were in 'idle' and it's the first mount
    // but better yet, we just provide the 'Start' button as is.
    // The lint error comes from Math.random in the component body or closures.
  }, []);

  const checkWinState = useCallback((currentBytes: Byte[], targetHex: string, mode: 'Little' | 'Big') => {
    const targetArr = targetHex.replace('0x', '').match(/.{1,2}/g) || [];
    const currentArr = currentBytes.map(b => b.value);
    
    if (mode === 'Big') {
      return JSON.stringify(currentArr) === JSON.stringify(targetArr);
    } else {
      return JSON.stringify(currentArr) === JSON.stringify([...targetArr].reverse());
    }
  }, []);

  const generateLevel = useCallback((lvl: number) => {
    // Generate a random 4-byte hex value
    const vals = Array.from({ length: 4 }, () => 
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
    );
    const hexFull = `0x${vals.join('')}`;
    setTargetValue(hexFull);
    
    // Choose a random target endianness
    const targetEnd = Math.random() > 0.5 ? 'Little' : 'Big';
    setTargetEndianness(targetEnd);
    
    // Start with a shuffled order that is definitely NOT the correct one
    const initialBytes = vals.map((v, i) => ({ id: `byte-${i}-${Date.now()}`, value: v }));
    
    // Check if it matches by chance and reshuffle
    let shuffled = [...initialBytes].sort(() => Math.random() - 0.5);
    while (checkWinState(shuffled, hexFull, targetEnd)) {
        shuffled = [...initialBytes].sort(() => Math.random() - 0.5);
    }

    setBytes(shuffled);
    setTimeLeft(Math.max(10, 35 - lvl * 2));
    setGameState('playing');
    setFeedback(null);
  }, [checkWinState]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('lost');
            setFeedback('Tempo scaduto! La memoria è corrotta.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft]);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    generateLevel(1);
  };

  const nextLevel = () => {
    setLevel(prev => prev + 1);
    generateLevel(level + 1);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 my-8 font-sans overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/20 shadow-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-black text-white flex items-center gap-2 m-0 tracking-tight">
            <Shuffle className="text-blue-400 animate-pulse" />
            EndianSwapper
          </h3>
          <p className="text-slate-400 text-sm font-medium">Sfida di ordinamento di memoria</p>
        </div>
        
        <div className="flex items-center gap-4 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
          <div className="flex items-center gap-2">
            <Award className="text-amber-400 w-4 h-4" />
            <span className="text-white font-mono font-bold text-lg">{score.toString().padStart(5, '0')}</span>
          </div>
          <div className={`flex items-center gap-2 border-l border-white/10 pl-4 ${timeLeft < 5 ? 'text-red-400 animate-bounce' : 'text-blue-300'}`}>
            <Timer className="w-4 h-4" />
            <span className="font-mono font-bold text-lg">{timeLeft}s</span>
          </div>
        </div>
      </div>

      <div className="bg-black/30 rounded-2xl p-8 border border-white/5 relative">
        {gameState === 'idle' ? (
          <div className="text-center py-12">
            <h4 className="text-xl font-bold text-white mb-4">Sei un maestro della memoria?</h4>
            <p className="text-slate-400 max-w-md mx-auto mb-8">
              Trascina i byte nella giusta sequenza per rappresentare il valore richiesto nell'architettura specificata.
            </p>
            <button 
              onClick={startGame}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              Inizia la Sfida
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-10">
              <div className="text-xs uppercase font-bold tracking-[0.3em] text-blue-400 mb-2">Valore Logico</div>
              <div className="text-4xl sm:text-5xl font-mono font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500 tracking-tighter">
                {targetValue}
              </div>
              <div className="mt-4 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 flex items-center gap-2">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Target Architecture:</span>
                <span className={`text-sm font-black uppercase ${targetEndianness === 'Little' ? 'text-emerald-400' : 'text-purple-400'}`}>
                  {targetEndianness} Endian
                </span>
              </div>
            </div>

            <div className="flex justify-center mb-8 h-32">
              <Reorder.Group 
                axis="x" 
                values={bytes} 
                onReorder={(newBytes) => {
                  setBytes(newBytes);
                  if (checkWinState(newBytes, targetValue, targetEndianness)) {
                    const timeBonus = timeLeft * 10;
                    setScore(prev => prev + 100 + timeBonus);
                    setGameState('won');
                    setFeedback(`Corretto! Byte disposti in ${targetEndianness} Endian.`);
                  }
                }}
                className="flex gap-4 w-full justify-center max-w-lg"
              >
                {bytes.map((byte) => (
                  <Reorder.Item 
                    key={byte.id} 
                    value={byte}
                    className="flex-1 max-w-[100px]"
                  >
                    <motion.div 
                      className={`h-24 rounded-2xl border-2 bg-slate-800/80 backdrop-blur-md flex items-center justify-center font-mono text-3xl font-black shadow-xl cursor-grab active:cursor-grabbing hover:border-blue-500/50 transition-colors ${gameState === 'playing' ? 'border-white/10 text-white' : gameState === 'won' ? 'border-emerald-500/50 text-emerald-400' : 'border-red-500/50 text-red-400'}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {byte.value}
                    </motion.div>
                    <div className="text-center mt-2 text-[10px] text-slate-600 font-mono">
                      byte_{bytes.indexOf(byte)}
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>

            <AnimatePresence>
              {feedback && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`text-center py-4 rounded-xl font-bold flex items-center justify-center gap-3 ${gameState === 'won' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
                >
                  {gameState === 'won' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                  {feedback}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-center mt-8 gap-4">
              {gameState === 'won' && (
                <button 
                  onClick={nextLevel}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
                >
                  Prossimo Livello <Award size={18} />
                </button>
              )}
              {(gameState === 'lost' || gameState === 'won') && (
                <button 
                  onClick={startGame}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold flex items-center gap-2 transition-all border border-white/10"
                >
                  Riprova <RefreshCw size={18} />
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
          <h5 className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-1">Little Endian Tip</h5>
          <p className="text-xs text-slate-400 leading-relaxed">I byte vanno invertiti rispetto all'ordine di lettura (LSB all'indirizzo più basso).</p>
        </div>
        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
          <h5 className="text-[10px] font-black uppercase text-purple-400 tracking-widest mb-1">Big Endian Tip</h5>
          <p className="text-xs text-slate-400 leading-relaxed">L'ordine in memoria rispecchia l'ordine di lettura (MSB all'indirizzo più basso).</p>
        </div>
      </div>
    </div>
  );
};

export default EndianSwapper;
