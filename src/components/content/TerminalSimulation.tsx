import { useState } from 'react';
import { Terminal as TerminalIcon, Play, RefreshCw, CheckCircle2 } from 'lucide-react';
import CodeBlock from './CodeBlock';
import { useProgression } from '../../hooks/useProgression';

interface TerminalSimulationProps {
    command: string;
    output?: string;
    children?: React.ReactNode;
    language?: string;
}

export default function TerminalSimulation({ command, output = '', children, language = 'bash' }: TerminalSimulationProps) {
    const [hasRun, setHasRun] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const { addXP } = useProgression();

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
            addXP(50, `terminal-${command}`);
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
                    <span>bash — simulation</span>
                </div>
                <div className="w-12"></div> {/* Spacer for symmetry */}
            </div>

            {/* Terminal Content */}
            <div className="p-4 font-mono text-sm leading-relaxed overflow-x-auto">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-[#10b981] font-bold">~/project$</span>
                    <span className="text-zinc-100">{command}</span>
                </div>

                {/* Actions */}
                {!hasRun && !isRunning && (
                    <button
                        onClick={handleRun}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#10b981]/10 hover:bg-[#10b981]/20 text-[#10b981] rounded-lg border border-[#10b981]/20 transition-colors font-sans text-sm font-medium"
                    >
                        <Play size={16} />
                        Esegui Comando
                    </button>
                )}

                {isRunning && (
                    <div className="mt-4 flex items-center gap-3 text-zinc-400">
                        <RefreshCw size={16} className="animate-spin" />
                        <span className="animate-pulse">Esecuzione in corso...</span>
                    </div>
                )}

                {hasRun && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-500">
                        {/* If the language is specific, we use CodeBlock for highlighting, otherwise plain text */}
                        {language !== 'text' && language !== 'bash' ? (
                            <div className="border border-white/5 rounded-lg overflow-hidden mt-2">
                                <CodeBlock code={finalOutput.trim()} language={language} />
                            </div>
                        ) : (
                            <pre className="text-zinc-300 mt-2 p-3 bg-white/5 rounded-lg border border-white/5 whitespace-pre-wrap">
                                {finalOutput.trim()}
                            </pre>
                        )}

                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[#0ea5e9] text-xs font-sans">
                                <CheckCircle2 size={14} />
                                Comando completato.
                            </div>
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-md transition-colors font-sans text-xs"
                            >
                                <RefreshCw size={12} />
                                Riavvia
                            </button>
                        </div>

                        <div className="flex items-center gap-3 mt-4">
                            <span className="text-[#10b981] font-bold">~/project$</span>
                            <span className="w-2 h-4 bg-zinc-400 animate-pulse"></span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
