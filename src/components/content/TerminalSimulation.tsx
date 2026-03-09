import { useState } from 'react';
import { Terminal as TerminalIcon, Play, RefreshCw, CheckCircle2 } from 'lucide-react';
import CodeBlock from './CodeBlock';
import { useProgression } from '../../hooks/useProgression';
import { useTranslation } from 'react-i18next';

export interface TerminalSimulationProps {
    command: string;
    output?: string;
    children?: React.ReactNode;
    language?: string;
    lessonSlug?: string;
}

export default function TerminalSimulation({ command, output = '', children, language = 'bash', lessonSlug = 'unknown' }: TerminalSimulationProps) {
    const [hasRun, setHasRun] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const { addXP } = useProgression();
    const { t } = useTranslation();

    // Determine final output string
    let finalOutput = output;
    if (children) {
        if (typeof children === 'string') {
            finalOutput = children;
        } else if (Array.isArray(children)) {
            finalOutput = children.map(c => typeof c === 'string' ? c : '').join('');
        } else {
            finalOutput = String(children);
        }
    }

    const handleRun = () => {
        setIsRunning(true);
        // Simulate compilation/execution delay
        setTimeout(() => {
            setIsRunning(false);
            setHasRun(true);
            addXP(20, `activity-terminal-${lessonSlug}-${command}`);
        }, 800);
    };

    const handleReset = () => {
        setHasRun(false);
        setIsRunning(false);
    };

    return (
        <div className="my-6 rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#09090b] shadow-black/50">
            {/* Terminal Header */}
            <div className="bg-[#18181b] px-4 py-3 flex items-center justify-between border-b border-white/5">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-xs font-mono text-zinc-500 flex items-center gap-2">
                    <TerminalIcon size={14} />
                    <span>{t('lesson.terminal.status_simulation')}</span>
                </div>
                <div className="w-12"></div>
            </div>

            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 font-mono text-sm">
                        <span className="text-green-500">$</span>
                        <span className="text-zinc-200">{command}</span>
                    </div>
                    {!hasRun ? (
                        <button
                            onClick={handleRun}
                            disabled={isRunning}
                            className="flex items-center gap-2 px-4 py-1.5 bg-[var(--color-brand-primary)] text-black rounded-lg font-bold text-xs transition-all hover:scale-105 disabled:opacity-50"
                        >
                            {isRunning ? (
                                <RefreshCw size={14} className="animate-spin" />
                            ) : (
                                <Play size={14} />
                            )}
                            {t('lesson.terminal.run')}
                        </button>
                    ) : (
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 px-4 py-1.5 bg-zinc-800 text-zinc-400 rounded-lg font-bold text-xs transition-all hover:bg-zinc-700"
                        >
                            <RefreshCw size={14} />
                            {t('lesson.terminal.reset')}
                        </button>
                    )}
                </div>

                {hasRun && finalOutput && (
                    <div className="mt-4 rounded-lg bg-black/50 p-4 border border-white/5 font-mono text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-2 mb-2 text-[var(--color-brand-primary)] opacity-50">
                            <CheckCircle2 size={12} />
                            <span className="text-[10px] uppercase font-bold tracking-tighter text-zinc-500">Output</span>
                        </div>
                        <CodeBlock code={finalOutput} language={language} noLineNumbers />
                    </div>
                )}

                {hasRun && (
                    <div className="mt-4 flex items-center gap-3 font-mono text-sm opacity-50 animate-in fade-in duration-300">
                        <span className="text-green-500">$</span>
                        <span className="w-2 md:w-2.5 h-4 md:h-5 bg-zinc-400 animate-pulse"></span>
                    </div>
                )}
            </div>
        </div>
    );
}
