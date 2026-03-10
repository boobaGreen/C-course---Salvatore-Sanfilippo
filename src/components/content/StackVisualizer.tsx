import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, RefreshCw, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StackFrame {
    id: string;
    label: string;
    variables: { name: string; value: string; address: string }[];
    isReturning?: boolean;
}

interface StackStep {
    action: string;
    label: string;
    frame?: {
        id: string;
        label: string;
        variables: { name: string; value: string; address: string }[];
    };
    update?: {
        id: string;
        variables: { name: string; value: string; address: string }[];
    };
    pop?: boolean;
}

interface StackVisualizerProps {
    title?: string;
    customSteps?: StackStep[];
}

export default function StackVisualizer({ title, customSteps }: StackVisualizerProps) {
    const { t } = useTranslation();
    const [stack, setStack] = useState<StackFrame[]>([]);
    const [step, setStep] = useState(0);

    const defaultSteps: StackStep[] = [
        {
            action: 'push_main',
            label: 'Chiamo main()',
            frame: {
                id: 'main',
                label: 'main()',
                variables: [
                    { name: 'ret', value: '0', address: '0x7ffd...e0' }
                ]
            }
        },
        {
            action: 'push_sum',
            label: 'Chiamo sum(10, 20)',
            frame: {
                id: 'sum',
                label: 'sum(10, 20)',
                variables: [
                    { name: 'a', value: '10', address: '0x7ffd...c8' },
                    { name: 'b', value: '20', address: '0x7ffd...cc' },
                    { name: 'c', value: '?', address: '0x7ffd...d0' }
                ]
            }
        },
        {
            action: 'update_c',
            label: 'c = a + b',
            update: {
                id: 'sum',
                variables: [
                    { name: 'a', value: '10', address: '0x7ffd...c8' },
                    { name: 'b', value: '20', address: '0x7ffd...cc' },
                    { name: 'c', value: '30', address: '0x7ffd...d0' }
                ]
            }
        },
        {
            action: 'pop_sum',
            label: 'sum ritorna 30',
            pop: true
        }
    ];

    const steps = customSteps || defaultSteps;

    const nextStep = () => {
        if (step >= steps.length) return;

        const current = steps[step];
        if (current.frame) {
            setStack([current.frame as StackFrame, ...stack]);
        } else if (current.update) {
            setStack(stack.map(f => f.id === current.update?.id ? { ...f, variables: current.update.variables } : f));
        } else if (current.pop) {
            setStack(stack.slice(1));
        }

        setStep(step + 1);
    };

    const reset = () => {
        setStack([]);
        setStep(0);
    };

    return (
        <div className="my-10 rounded-2xl border border-white/10 glass-panel overflow-hidden shadow-2xl">
            <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Layers size={18} className="text-[var(--color-brand-primary)]" />
                    <h4 className="text-sm font-bold uppercase tracking-widest text-white">{title || t('lesson.stack.title', 'Stack Memory Visualizer')}</h4>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={reset}
                        className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 transition-colors"
                        title="Reset"
                    >
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={nextStep}
                        disabled={step >= steps.length}
                        className="px-4 py-1.5 bg-[var(--color-brand-primary)] text-black rounded-lg font-bold text-xs transition-all hover:scale-105 disabled:opacity-50 disabled:grayscale"
                    >
                        {step === 0 ? t('lesson.stack.start', 'Start Simulation') : t('lesson.stack.next', 'Next Step')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 min-h-[400px]">
                {/* Control Panel */}
                <div className="p-6 border-b md:border-b-0 md:border-r border-white/5 bg-black/20">
                    <div className="mb-6">
                        <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-500 mb-2 block">Current Action</span>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 min-h-[60px] flex items-center italic text-zinc-300 text-sm">
                            {step > 0 ? steps[step - 1].label : t('lesson.stack.ready', 'Ready to start...')}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-500 mb-2 block">Instructions</span>
                        {steps.map((s, i) => (
                            <div
                                key={i}
                                className={`text-xs p-2 rounded-lg border transition-all ${step > i ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                    step === i ? 'bg-[var(--color-brand-primary)]/10 border-[var(--color-brand-primary)]/30 text-white font-bold' :
                                        'bg-transparent border-transparent text-zinc-600'
                                    }`}
                            >
                                {i + 1}. {s.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stack View */}
                <div className="md:col-span-2 p-8 flex flex-col items-center relative overflow-hidden">
                    {/* Perspective lines */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20 -translate-x-1/2"></div>
                        <div className="absolute left-0 right-0 top-1/2 h-px bg-white/20 -translate-y-1/2"></div>
                    </div>

                    <div className="w-full max-w-sm flex flex-col items-center">
                        <div className="mb-4 text-center">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Stack Pointer (SP)</span>
                            <ArrowDown size={16} className="text-[var(--color-brand-primary)] mx-auto animate-bounce mt-1" />
                        </div>

                        <div className="w-full flex flex-col gap-3 min-h-[300px] justify-end">
                            <AnimatePresence initial={false}>
                                {stack.map((frame) => (
                                    <motion.div
                                        key={frame.id}
                                        layout
                                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8, x: 100 }}
                                        className="w-full p-4 rounded-xl glass-panel border border-white/20 shadow-xl relative overflow-hidden group"
                                    >
                                        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-brand-primary)] shadow-[0_0_10px_var(--color-brand-primary)]"></div>

                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-xs font-black uppercase tracking-widest text-white">{frame.label} Frame</span>
                                            <span className="text-[9px] font-mono text-zinc-500">BP: {frame.variables[0]?.address}</span>
                                        </div>

                                        <div className="space-y-2">
                                            {frame.variables.map((v, i) => (
                                                <div key={i} className="flex items-center gap-3 text-xs font-mono">
                                                    <span className="text-zinc-500 w-10">{v.address}</span>
                                                    <div className="flex-1 p-1.5 rounded bg-black/40 border border-white/5 flex justify-between items-center group-hover:border-[var(--color-brand-primary)]/30 transition-colors">
                                                        <span className="text-[var(--color-brand-secondary)] font-bold">{v.name}</span>
                                                        <span className="text-white">{v.value}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {stack.length === 0 && (
                                <div className="h-40 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center text-zinc-600 italic text-sm">
                                    Stack is empty
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
