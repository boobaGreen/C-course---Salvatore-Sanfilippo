import { motion } from 'framer-motion';
import { FileCode2, Send, CheckCircle2, RotateCw } from 'lucide-react';

export default function WorkflowDiagram() {
    const steps = [
        { icon: <FileCode2 />, label: 'Spec', desc: 'Define behavior' },
        { icon: <Send />, label: 'AI Prompt', desc: 'Code generation' },
        { icon: <RotateCw />, label: 'Iterate', desc: 'Refine results' },
        { icon: <CheckCircle2 />, label: 'Audit', desc: 'Human verification' },
    ];

    return (
        <div className="glass-panel p-6 rounded-2xl border-white/10 my-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <FileCode2 size={22} />
                </div>
                <div>
                    <h3 className="text-xl font-bold dark:text-white">The AI-Assisted Workflow</h3>
                    <p className="text-sm text-zinc-500">From implementer to architect</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 hidden md:block -translate-y-1/2" />
                
                {steps.map((step, i) => (
                    <motion.div
                        key={step.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.15 }}
                        className="relative z-10 flex flex-col items-center text-center group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:border-indigo-500/50 transition-colors shadow-xl mb-3">
                            {step.icon}
                        </div>
                        <span className="text-xs font-bold text-white mb-1 uppercase tracking-widest">{step.label}</span>
                        <span className="text-[10px] text-zinc-500 leading-tight w-24">{step.desc}</span>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                <p className="text-xs text-zinc-400 leading-relaxed italic text-center">
                    "We no longer just write code; we design the intent and audit the output." — Salvatore
                </p>
            </div>
        </div>
    );
}
