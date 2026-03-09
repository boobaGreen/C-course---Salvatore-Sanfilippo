import { useState, useEffect } from 'react';
import { Check, X, HelpCircle, ChevronRight, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgression } from '../../hooks/useProgression';
import { useTranslation } from 'react-i18next';

export interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

export interface QuizProps {
    questions: Question[];
    title?: string;
    lessonSlug?: string;
}

export default function Quiz({ questions, title, lessonSlug = "unknown" }: QuizProps) {
    const storageKey = `quiz-state-${lessonSlug}-${title || 'default'}`;

    const [currentStep, setCurrentStep] = useState(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) return JSON.parse(saved).currentStep || 0;
        return 0;
    });

    const [selectedOption, setSelectedOption] = useState<number | null>(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) return JSON.parse(saved).selectedOption ?? null;
        return null;
    });

    const [isAnswered, setIsAnswered] = useState(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) return JSON.parse(saved).isAnswered || false;
        return false;
    });

    const [score, setScore] = useState(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) return JSON.parse(saved).score || 0;
        return 0;
    });

    const [showResults, setShowResults] = useState(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) return JSON.parse(saved).showResults || false;
        return false;
    });

    const { addXP } = useProgression();
    const { t } = useTranslation();

    // Persist state to localStorage
    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify({
            currentStep,
            selectedOption,
            isAnswered,
            score,
            showResults
        }));
    }, [currentStep, selectedOption, isAnswered, score, showResults, storageKey]);

    const quizTitle = title || t('lesson.exercises');

    const handleOptionSelect = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
    };

    const handleConfirm = () => {
        if (selectedOption === null) return;

        setIsAnswered(true);
        if (selectedOption === questions[currentStep].correctAnswer) {
            setScore((prev: number) => prev + 1);
            addXP(50, `activity-quiz-${lessonSlug}-${quizTitle}-q${questions[currentStep].id}`);
        }
    };

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResults(true);
            addXP(200, `activity-quiz-${lessonSlug}-${quizTitle}-final`);
        }
    };

    const handleReset = () => {
        setCurrentStep(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScore(0);
        setShowResults(false);
    };

    if (showResults) {
        return (
            <div className="my-8 glass-panel p-8 rounded-2xl border-white/10 text-center text-zinc-300">
                <div className="w-20 h-20 bg-[var(--color-brand-primary)]/20 text-[var(--color-brand-primary)] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{t('lesson.quiz.completed')}</h3>
                <p className="text-zinc-400 mb-6 font-medium">
                    {t('lesson.quiz.score_msg', { score, total: questions.length })}
                </p>
                <button
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-colors flex items-center gap-2 mx-auto"
                >
                    <RotateCcw size={18} />
                    {t('lesson.quiz.retry')}
                </button>
            </div>
        );
    }

    const currentQuestion = questions[currentStep];

    return (
        <div className="my-8 glass-panel rounded-2xl border-white/10 overflow-hidden shadow-2xl shadow-black/20 text-zinc-300">
            {/* Header */}
            <div className="bg-white/5 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 border-b border-white/5">
                <div className="flex items-center gap-2 text-[var(--color-brand-primary)] min-w-0">
                    <HelpCircle size={18} className="shrink-0" />
                    <span className="font-bold text-sm uppercase tracking-wider truncate">{quizTitle}</span>
                </div>
                <div className="text-xs font-mono text-zinc-500 shrink-0 whitespace-nowrap">
                    {currentStep + 1} / {questions.length}
                </div>
            </div>

            <div className="p-6 sm:p-8">
                <h4 className="text-xl font-bold text-white mb-6 leading-tight">
                    {currentQuestion.question}
                </h4>

                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                        let stateClass = "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10";

                        if (isAnswered) {
                            if (index === currentQuestion.correctAnswer) {
                                stateClass = "bg-green-500/20 border-green-500/50 text-green-400";
                            } else if (index === selectedOption) {
                                stateClass = "bg-red-500/20 border-red-500/50 text-red-400";
                            } else {
                                stateClass = "bg-white/5 border-white/10 text-zinc-500 opacity-50";
                            }
                        } else if (selectedOption === index) {
                            stateClass = "bg-[var(--color-brand-secondary)]/20 border-[var(--color-brand-secondary)]/50 text-[var(--color-brand-secondary)]";
                        }

                        return (
                            <button
                                key={index}
                                disabled={isAnswered}
                                onClick={() => handleOptionSelect(index)}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${stateClass}`}
                            >
                                <span>{option}</span>
                                <AnimatePresence>
                                    {isAnswered && index === currentQuestion.correctAnswer && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-500">
                                            <Check size={18} />
                                        </motion.div>
                                    )}
                                    {isAnswered && index === selectedOption && index !== currentQuestion.correctAnswer && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-red-500">
                                            <X size={18} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence>
                    {isAnswered && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="mt-6 p-4 rounded-xl bg-white/5 border border-white/5 text-sm leading-relaxed text-zinc-400"
                        >
                            <strong className="text-white block mb-1">{t('lesson.quiz.explanation')}:</strong>
                            {currentQuestion.explanation}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-8 flex justify-end">
                    {!isAnswered ? (
                        <button
                            disabled={selectedOption === null}
                            onClick={handleConfirm}
                            className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${selectedOption === null
                                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                : 'bg-[var(--color-brand-primary)] text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105'
                                }`}
                        >
                            {t('lesson.quiz.confirm')}
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/10 font-bold transition-all flex items-center gap-2"
                        >
                            {currentStep < questions.length - 1 ? t('lesson.quiz.next') : t('lesson.quiz.results')}
                            <ChevronRight size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-white/5 w-full">
                <motion.div
                    className="h-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)]"
                    initial={{ width: `${(currentStep / questions.length) * 100}%` }}
                    animate={{ width: `${((currentStep + (isAnswered ? 1 : 0)) / questions.length) * 100}%` }}
                />
            </div>
        </div>
    );
}
