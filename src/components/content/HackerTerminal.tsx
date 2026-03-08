import { useState } from 'react';
import { ShieldAlert, Cpu, CheckCircle2, XCircle, Send, ChevronRight, ChevronLeft, Terminal as TerminalIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgression } from '../../hooks/useProgression';
import { useTranslation } from 'react-i18next';

interface Challenge {
    id: string;
    title: string;
    description: string;
    commands: string[];
    expectedOutput: string;
    hints?: string[];
    explanation?: string;
    xpReward?: number;
}

interface HackerTerminalProps {
    challenges: Challenge[];
}

export default function HackerTerminal({ challenges }: HackerTerminalProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
    const [isCorrect, setIsCorrect] = useState<Record<string, boolean | null>>({});
    const [showHint, setShowHint] = useState<Record<string, boolean>>({});
    const { addXP } = useProgression();
    const { t } = useTranslation();

    const currentChallenge = challenges[currentStep];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (completedTasks[currentChallenge.id]) return;

        const normalizedInput = inputValue.trim();
        const normalizedExpected = currentChallenge.expectedOutput.trim();
        
        const correct = normalizedInput === normalizedExpected;
        
        setIsCorrect(prev => ({ ...prev, [currentChallenge.id]: correct }));

        if (correct) {
            setCompletedTasks(prev => ({ ...prev, [currentChallenge.id]: true }));
            addXP(currentChallenge.xpReward || 150, `hacker-terminal-${currentChallenge.id}`);
        }
    };

    const handleRetry = () => {
        setIsCorrect(prev => ({ ...prev, [currentChallenge.id]: null }));
        setInputValue('');
    };

    return (
        <div className="my-10 glass-panel rounded-2xl border-white/10 overflow-hidden shadow-2xl shadow-black/40">
            {/* Header */}
            <div className="bg-zinc-900/80 px-6 py-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3 text-red-400">
                    <ShieldAlert size={20} className="animate-pulse" />
                    <span className="font-black text-xs uppercase tracking-[0.2em]">Hacker Terminal Challenge</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 mr-2">
                        {challenges.map((_, idx) => (
                            <div 
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    idx === currentStep ? 'bg-red-500 scale-125' : 
                                    completedTasks[challenges[idx].id] ? 'bg-green-500/50' : 'bg-white/10'
                                }`}
                            />
                        ))}
                    </div>
                    <div className="flex gap-1.5 border-l border-white/10 pl-4">
                        <button 
                            disabled={currentStep === 0}
                            onClick={() => { setCurrentStep(s => s - 1); setInputValue(''); }}
                            className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button 
                            disabled={currentStep === challenges.length - 1}
                            onClick={() => { setCurrentStep(s => s + 1); setInputValue(''); }}
                            className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6 sm:p-8 bg-[#0c0c0e]">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wider border border-red-500/20">
                            Task {currentStep + 1} of {challenges.length}
                        </span>
                        {completedTasks[currentChallenge.id] && (
                            <span className="flex items-center gap-1 text-green-500 text-[10px] font-bold uppercase tracking-wider">
                                <CheckCircle2 size={12} /> Complete
                            </span>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <TerminalIcon size={20} className="text-[var(--color-brand-primary)]" />
                        {currentChallenge.title}
                    </h3>
                    <p className="text-zinc-400 text-base leading-relaxed mb-6">
                        {currentChallenge.description}
                    </p>
                    
                    <div className="space-y-3">
                        {currentChallenge.commands.map((cmd, idx) => (
                            <div key={idx} className="bg-black/40 rounded-xl p-4 border border-white/5 flex items-center justify-between group">
                                <code className="text-[var(--color-brand-primary)] font-mono text-sm">
                                    <span className="opacity-50 mr-2">$</span>
                                    {cmd}
                                </code>
                                <Cpu size={16} className="text-zinc-600 group-hover:text-[var(--color-brand-primary)] transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="relative mt-8">
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">
                        Predict System Output:
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={completedTasks[currentChallenge.id]}
                            placeholder="Type the expected output..."
                            className={`flex-1 bg-black border ${
                                isCorrect[currentChallenge.id] === true ? 'border-green-500/50' : 
                                isCorrect[currentChallenge.id] === false ? 'border-red-500/50' : 'border-white/10'
                            } rounded-xl px-4 py-3 font-mono text-sm text-zinc-200 focus:outline-none focus:border-[var(--color-brand-secondary)] transition-all placeholder:text-zinc-700`}
                        />
                        {!completedTasks[currentChallenge.id] ? (
                            <button
                                type="submit"
                                disabled={!inputValue.trim()}
                                className="px-6 bg-[var(--color-brand-primary)] text-black rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                            >
                                <Send size={18} />
                                {t('common.submit', 'Submit')}
                            </button>
                        ) : (
                            <div className="px-6 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl font-bold flex items-center gap-2">
                                <CheckCircle2 size={18} /> SUCCESS
                            </div>
                        )}
                    </div>
                </form>

                <AnimatePresence>
                    {isCorrect[currentChallenge.id] !== undefined && isCorrect[currentChallenge.id] !== null && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-8 p-6 rounded-2xl border ${isCorrect[currentChallenge.id] ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}
                        >
                            <div className="flex items-start gap-4">
                                {isCorrect[currentChallenge.id] ? (
                                    <CheckCircle2 className="text-green-500 mt-1 shrink-0" size={24} />
                                ) : (
                                    <XCircle className="text-red-500 mt-1 shrink-0" size={24} />
                                )}
                                <div className="flex-1">
                                    <h4 className={`text-lg font-bold mb-2 ${isCorrect[currentChallenge.id] ? 'text-green-400' : 'text-red-400'}`}>
                                        {isCorrect[currentChallenge.id] ? "Access Granted!" : "Access Denied"}
                                    </h4>
                                    <div className="text-zinc-400 text-sm leading-relaxed space-y-4">
                                        {isCorrect[currentChallenge.id] ? (
                                            <p>{currentChallenge.explanation}</p>
                                        ) : (
                                            <div>
                                                <p>L'output o il comando inserito non corrisponde. Controlla la sintassi e riprova.</p>
                                                <button 
                                                    onClick={handleRetry}
                                                    className="mt-4 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
                                                >
                                                    Try Again
                                                </button>
                                            </div>
                                        )}
                                        
                                        {!isCorrect[currentChallenge.id] && currentChallenge.hints && !showHint[currentChallenge.id] && (
                                            <button 
                                                onClick={() => setShowHint(prev => ({ ...prev, [currentChallenge.id]: true }))}
                                                className="text-[var(--color-brand-secondary)] text-xs font-bold uppercase tracking-wider hover:underline block"
                                            >
                                                Need a hint?
                                            </button>
                                        )}
                                        {!isCorrect[currentChallenge.id] && showHint[currentChallenge.id] && currentChallenge.hints && (
                                            <div className="space-y-2">
                                                {currentChallenge.hints.map((h, i) => (
                                                    <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/5 italic text-[var(--color-brand-secondary)]">
                                                        <span className="text-zinc-500 not-italic mr-2">Hint {i+1}:</span>
                                                        {h}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Terminal Footer Info */}
            <div className="bg-black/20 px-6 py-3 flex items-center justify-between border-t border-white/5">
                <div className="text-[10px] font-mono text-zinc-600 uppercase">
                    Kernel: 5.15.0-hacker-edition
                </div>
                <div className="text-[10px] font-mono text-zinc-600 uppercase">
                    XP Reward: {currentChallenge.xpReward || 150} pts
                </div>
            </div>
        </div>
    );
}
