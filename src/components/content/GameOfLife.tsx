import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, FastForward, Info, Binary, Maximize2 } from 'lucide-react';

const ROWS = 20;
const COLS = 20;

const INITIAL_PATTERNS = {
    glider: [
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 1]
    ],
    oscillator: [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
    ],
    square: [
        [1, 1],
        [1, 1]
    ]
};

export default function GameOfLife() {
    const [grid, setGrid] = useState<number[][]>(() => 
        Array(ROWS).fill(0).map(() => Array(COLS).fill(0))
    );
    const [isRunning, setIsRunning] = useState(false);
    const [generation, setGeneration] = useState(0);
    const [speed] = useState(200);
    const timerRef = useRef<any>(null);

    const getNeighbors = (grid: number[][], x: number, y: number) => {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                // Wrapping logic (Salvatore's Escamotage)
                const row = (x + i + ROWS) % ROWS;
                const col = (y + j + COLS) % COLS;
                count += grid[row][col];
            }
        }
        return count;
    };

    const step = useCallback(() => {
        setGrid(prev => {
            const next = Array(ROWS).fill(0).map(() => Array(COLS).fill(0));
            let changed = false;
            for (let i = 0; i < ROWS; i++) {
                for (let j = 0; j < COLS; j++) {
                    const neighbors = getNeighbors(prev, i, j);
                    if (prev[i][j] === 1) {
                        next[i][j] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
                    } else {
                        next[i][j] = (neighbors === 3) ? 1 : 0;
                    }
                    if (next[i][j] !== prev[i][j]) changed = true;
                }
            }
            if (changed) setGeneration(g => g + 1);
            return next;
        });
    }, []);

    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(step, speed);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning, speed, step]);

    const toggleCell = (r: number, c: number) => {
        const newGrid = [...grid.map(row => [...row])];
        newGrid[r][c] = newGrid[r][c] === 1 ? 0 : 1;
        setGrid(newGrid);
    };

    const reset = () => {
        setGrid(Array(ROWS).fill(0).map(() => Array(COLS).fill(0)));
        setGeneration(0);
        setIsRunning(false);
    };

    const loadPattern = (type: keyof typeof INITIAL_PATTERNS) => {
        reset();
        const pattern = INITIAL_PATTERNS[type];
        const newGrid = Array(ROWS).fill(0).map(() => Array(COLS).fill(0));
        const midR = Math.floor(ROWS / 2) - 1;
        const midC = Math.floor(COLS / 2) - 1;
        
        pattern.forEach((row, i) => {
            row.forEach((cell, j) => {
                newGrid[midR + i][midC + j] = cell;
            });
        });
        setGrid(newGrid);
    };

    return (
        <div className="glass-panel p-6 rounded-2xl border-white/10 my-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
                        <Binary size={22} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold dark:text-white">Game of Life Simulator</h3>
                        <p className="text-sm text-zinc-500">Lesson 8: Cellular Automata in C</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
                        GEN: {generation}
                    </div>
                    <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
                        <button 
                            onClick={() => loadPattern('glider')}
                            className="px-2 py-1 text-[10px] uppercase font-bold text-zinc-500 hover:text-white transition-colors"
                        >
                            Glider
                        </button>
                        <button 
                            onClick={() => loadPattern('oscillator')}
                            className="px-2 py-1 text-[10px] uppercase font-bold text-zinc-500 hover:text-white transition-colors border-l border-zinc-800"
                        >
                            Osc
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Grid Display */}
                <div className="lg:col-span-2 flex justify-center bg-zinc-950 p-4 rounded-xl border border-zinc-800 relative overflow-hidden group">
                    <div 
                        className="grid gap-[1px]" 
                        style={{ 
                            gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
                            width: '100%',
                            maxWidth: '400px',
                            aspectRatio: '1/1'
                        }}
                    >
                        {grid.map((row, r) => 
                            row.map((cell, c) => (
                                <motion.div 
                                    key={`${r}-${c}`}
                                    onClick={() => toggleCell(r, c)}
                                    animate={{ 
                                        backgroundColor: cell === 1 ? 'rgba(34, 197, 94, 1)' : 'rgba(24, 24, 27, 0.5)',
                                        scale: cell === 1 ? [1, 1.1, 1] : 1
                                    }}
                                    className={`aspect-square rounded-[1px] cursor-crosshair border border-white/5`}
                                />
                            ))
                        )}
                    </div>
                    <AnimatePresence>
                        {isRunning && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute top-2 right-2"
                            >
                                <div className="flex items-center gap-2 px-2 py-1 rounded bg-green-500 text-[8px] font-black text-white uppercase tracking-tighter animate-pulse">
                                    Simulating
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Controls & Rules */}
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={() => setIsRunning(!isRunning)}
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all ${
                                isRunning 
                                    ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' 
                                    : 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                            }`}
                        >
                            {isRunning ? <Pause size={18} /> : <Play size={18} />}
                            {isRunning ? 'Stop' : 'Start'}
                        </button>
                        <button 
                            onClick={step}
                            disabled={isRunning}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold disabled:opacity-50"
                        >
                            <FastForward size={18} />
                            Step
                        </button>
                        <button 
                            onClick={reset}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-zinc-500 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 col-span-2"
                        >
                            <RotateCcw size={18} />
                            Clear Grid
                        </button>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                            <Info size={14} /> The Rules (Conway)
                        </h4>
                        <ul className="text-[11px] space-y-2 text-zinc-500">
                            <li className="flex gap-2">
                                <span className="text-red-500 font-bold">â€¢</span>
                                <span><strong>Solitudine:</strong> Una cella viva muore se ha meno di 2 vicini.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-green-500 font-bold">â€¢</span>
                                <span><strong>Sopravvivenza:</strong> Una cella vive se ha 2 o 3 vicini.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-red-500 font-bold">â€¢</span>
                                <span><strong>Sovrappopolazione:</strong> Muore se ha più di 3 vicini.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-blue-500 font-bold">â€¢</span>
                                <span><strong>Riproduzione:</strong> Una cella morta diventa viva se ha esattamente 3 vicini.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <div className="flex items-start gap-3">
                    <Maximize2 className="text-blue-500 mt-1 shrink-0" size={18} />
                    <p className="text-sm text-zinc-500 leading-relaxed">
                        <strong>esperto Detail:</strong> Salvatore implementa il "Wrapping" usando l'operatore modulo <code>%</code>. Quando una cella esce dal bordo destro, riappare a sinistra. Questo simula un universo "toroidale" infinito.
                    </p>
                </div>
            </div>
        </div>
    );
}

