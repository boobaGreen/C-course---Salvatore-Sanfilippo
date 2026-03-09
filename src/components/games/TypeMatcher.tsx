import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Zap } from 'lucide-react';
import { useProgression } from '../../hooks/useProgression';

const TYPES = ['int', 'char', 'float', 'double', 'char*', 'void'];
const VALUES_DATA = [
    { val: '42', type: 'int' },
    { val: "'A'", type: 'char' },
    { val: '3.14f', type: 'float' },
    { val: '2.7182818', type: 'double' },
    { val: '"Hello"', type: 'char*' },
];

const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

export default function TypeMatcher() {
    const [matches, setMatches] = useState<Record<string, string>>({});
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const { addXP } = useProgression();

    // Shuffle data on mount using useMemo
    const shuffledTypes = useMemo(() => shuffleArray(TYPES), []);
    const shuffledValues = useMemo(() => shuffleArray(VALUES_DATA), []);

    useEffect(() => {
        if (Object.keys(matches).length === shuffledValues.length && !isCompleted) {
            setIsCompleted(true);
            addXP(100, `type-matcher-${shuffledValues.length}`);
        }
    }, [matches, isCompleted, addXP, shuffledValues.length]);

    const handleTypeClick = (type: string) => {
        setSelectedType(type === selectedType ? null : type);
    };

    const handleValueClick = (valItem: typeof VALUES_DATA[0]) => {
        if (!selectedType) return;

        if (valItem.type === selectedType) {
            setMatches((prev) => ({ ...prev, [valItem.val]: selectedType }));
            setSelectedType(null);
        } else {
            const el = document.getElementById(`val-${valItem.val}`);
            el?.classList.add('animate-shake', 'bg-red-500/20', 'border-red-500');
            setTimeout(() => {
                el?.classList.remove('animate-shake', 'bg-red-500/20', 'border-red-500');
            }, 500);
        }
    };

    return (
        <div className="my-8 rounded-2xl border border-white/10 glass-panel p-6 shadow-2xl">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Zap size={20} className="text-[var(--color-brand-primary)]" fill="currentColor" />
                        Type Matcher
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1">
                        Seleziona un tipo in alto e poi clicca sul valore corrispondente in basso.
                    </p>
                </div>
                <AnimatePresence>
                    {isCompleted && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-2 text-[var(--color-brand-primary)] font-bold bg-[var(--color-brand-primary)]/10 px-4 py-1.5 rounded-full border border-[var(--color-brand-primary)]/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                        >
                            <CheckCircle2 size={18} /> +100 XP
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="space-y-8">
                {/* Tipi */}
                <div className="flex flex-wrap gap-2.5">
                    {shuffledTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => handleTypeClick(type)}
                            className={`px-5 py-2.5 font-mono text-sm rounded-xl border transition-all duration-200 ${selectedType === type
                                ? 'border-[var(--color-brand-secondary)] bg-[var(--color-brand-secondary)]/20 text-[var(--color-brand-secondary)] shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                                : 'border-white/10 hover:border-white/30 bg-white/5 text-zinc-300'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Valori */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {shuffledValues.map(v => {
                        const isMatched = matches[v.val] !== undefined;
                        return (
                            <button
                                key={v.val}
                                id={`val-${v.val}`}
                                onClick={() => !isMatched && handleValueClick(v)}
                                disabled={isMatched}
                                className={`flex flex-col items-center justify-center p-6 border transition-all duration-300 rounded-xl space-y-2 ${isMatched
                                    ? 'border-[var(--color-brand-primary)]/50 bg-[var(--color-brand-primary)]/5 text-[var(--color-brand-primary)] shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                    : 'border-white/5 border-dashed hover:bg-white/5 cursor-pointer text-zinc-400'
                                    }`}
                            >
                                <div className="text-lg font-bold font-mono">{v.val}</div>
                                {isMatched && (
                                    <motion.div initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-[10px] uppercase font-black tracking-widest bg-zinc-800 px-2 py-0.5 rounded">
                                        {matches[v.val]}
                                    </motion.div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
