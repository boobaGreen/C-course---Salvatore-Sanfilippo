import { useState } from 'react';
import { ShieldAlert, Cpu, CheckCircle2, XCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgression } from '../../hooks/useProgression';
import { useTranslation } from 'react-i18next';

interface HackerTerminalProps {
    title?: string;
    description: string;
    command: string;
    expectedOutput: string;
    hint?: string;
    explanation: string;
    xpReward?: number;
    placeholder?: string;
    inputLabel?: string;
}

export default function HackerTerminal({
    title,
    description,
    command,
    expectedOutput,
    hint,
    explanation,
    xpReward = 150,
    placeholder,
    inputLabel
}: HackerTerminalProps) {
    const [inputValue, setInputValue] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const { addXP } = useProgression();
    const { t } = useTranslation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitted) return;

        const normalizedInput = inputValue.trim();
        const normalizedExpected = expectedOutput.trim();
        
        const correct = normalizedInput === normalizedExpected;
        setIsCorrect(correct);
        setIsSubmitted(true);

        if (correct) {
            addXP(xpReward, `hacker-terminal-${command}`);
        }
    };

    const handleRetry = () => {
        setIsSubmitted(false);
        setInputValue('');
        setIsCorrect(false);
    };

    return (
        <div className="my-10 glass-panel rounded-2xl border-white/10 overflow-hidden shadow-2xl shadow-black/40">
            {/* Header */}
            <div className="bg-zinc-900/80 px-6 py-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3 text-red-400">
                    <ShieldAlert size={20} className="animate-pulse" />
                    <span className="font-black text-sm uppercase tracking-[0.2em]">{title || "Terminal Challenge"}</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                    </div>
                </div>
            </div>

            <div className="p-6 sm:p-8 bg-[#0c0c0e]">
                <div className="mb-6">
                    <p className="text-zinc-300 text-lg leading-relaxed mb-4">
                        {description}
                    </p>
                    <div className="bg-black/40 rounded-xl p-4 border border-white/5 flex items-center justify-between group">
                        <code className="text-[var(--color-brand-primary)] font-mono text-sm">
                            <span className="opacity-50 mr-2">$</span>
                            {command}
                        </code>
                        <Cpu size={16} className="text-zinc-600 group-hover:text-[var(--color-brand-primary)] transition-colors" />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="relative">
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">
                        {inputLabel || "Predict Output:"}
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={isSubmitted}
                            placeholder={placeholder || (t('lesson.terminal.placeholder') as string) || "Type the expected output..."}
                            className={`flex-1 bg-black border ${isSubmitted ? (isCorrect ? 'border-green-500/50' : 'border-red-500/50') : 'border-white/10'} rounded-xl px-4 py-3 font-mono text-sm text-zinc-200 focus:outline-none focus:border-[var(--color-brand-secondary)] transition-all placeholder:text-zinc-700`}
                        />
                        {!isSubmitted ? (
                            <button
                                type="submit"
                                disabled={!inputValue.trim()}
                                className="px-6 bg-[var(--color-brand-primary)] text-black rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                            >
                                <Send size={18} />
                                {t('common.submit', 'Submit')}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleRetry}
                                className="px-6 bg-white/5 text-white border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all"
                            >
                                {t('common.retry', 'Retry')}
                            </button>
                        )}
                    </div>
                </form>

                <AnimatePresence>
                    {isSubmitted && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-8 p-6 rounded-2xl border ${isCorrect ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}
                        >
                            <div className="flex items-start gap-4">
                                {isCorrect ? (
                                    <CheckCircle2 className="text-green-500 mt-1 shrink-0" size={24} />
                                ) : (
                                    <XCircle className="text-red-500 mt-1 shrink-0" size={24} />
                                )}
                                <div>
                                    <h4 className={`text-lg font-bold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                        {isCorrect ? "Access Granted!" : "Access Denied"}
                                    </h4>
                                    <div className="text-zinc-400 text-sm leading-relaxed space-y-4">
                                        {isCorrect ? (
                                            <p>{explanation}</p>
                                        ) : (
                                            <p>L'output o il comando inserito non corrisponde. Controlla la sintassi e riprova, oppure chiedi un indizio.</p>
                                        )}
                                        {!isCorrect && hint && !showHint && (
                                            <button 
                                                onClick={() => setShowHint(true)}
                                                className="text-[var(--color-brand-secondary)] text-xs font-bold uppercase tracking-wider hover:underline block"
                                            >
                                                Need a hint?
                                            </button>
                                        )}
                                        {!isCorrect && showHint && (
                                            <div className="p-3 bg-white/5 rounded-lg border border-white/5 italic text-[var(--color-brand-secondary)]">
                                                <span className="text-zinc-500 not-italic mr-2">Hint:</span>
                                                {hint}
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
                    Auth: Multi-Factor-Reasoning
                </div>
            </div>
        </div>
    );
}
