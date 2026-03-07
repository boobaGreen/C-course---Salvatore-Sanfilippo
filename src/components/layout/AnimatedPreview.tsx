import { motion } from 'framer-motion';
import { FileCode, Cpu, Layers, Binary, Zap } from 'lucide-react';

interface AnimatedPreviewProps {
    slug: string;
}

export default function AnimatedPreview({ slug }: AnimatedPreviewProps) {
    if (slug === 'lesson-01') {
        return (
            <div className="relative w-full h-24 flex items-center justify-center gap-4 bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden border border-white/5">
                <motion.div
                    animate={{ x: [0, 20], opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-[var(--color-brand-primary)]"
                >
                    <FileCode size={24} />
                </motion.div>
                <div className="w-8 h-px bg-white/10" />
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-[var(--color-brand-secondary)]"
                >
                    <Binary size={28} />
                </motion.div>
            </div>
        );
    }

    if (slug === 'lesson-02') {
        return (
            <div className="relative w-full h-24 flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden border border-white/5 p-4">
                <div className="flex flex-col-reverse gap-1 w-12">
                    {[1, 2, 3].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: i * 0.2, duration: 0.5 }}
                            className="h-4 bg-[var(--color-brand-primary)]/30 border border-[var(--color-brand-primary)]/50 rounded-sm"
                        />
                    ))}
                    <motion.div
                        animate={{ y: [-10, 0], opacity: [0, 1] }}
                        transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                        className="h-4 bg-[var(--color-brand-secondary)] border border-[var(--color-brand-secondary)] rounded-sm shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                    />
                </div>
                <div className="ml-4 text-[var(--color-brand-primary)] opacity-40">
                    <Layers size={24} />
                </div>
            </div>
        );
    }

    if (slug === 'home-editor') {
        return (
            <div className="relative w-full h-full flex items-center justify-center bg-black/5 dark:bg-white/5 p-4">
                <div className="w-full flex flex-col gap-1.5 font-mono text-[8px] opacity-40">
                    <motion.div initial={{ width: 0 }} animate={{ width: '80%' }} transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }} className="h-1 bg-[var(--color-brand-secondary)] rounded-full" />
                    <motion.div initial={{ width: 0 }} animate={{ width: '60%' }} transition={{ duration: 1, delay: 0.2, repeat: Infinity, repeatDelay: 1 }} className="h-1 bg-[var(--color-brand-primary)] rounded-full" />
                    <motion.div initial={{ width: 0 }} animate={{ width: '40%' }} transition={{ duration: 1, delay: 0.4, repeat: Infinity, repeatDelay: 1 }} className="h-1 bg-zinc-500 rounded-full" />
                    <motion.div
                        animate={{ opacity: [0, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="w-1 h-3 bg-[var(--color-brand-primary)] mt-1 ml-1"
                    />
                </div>
            </div>
        );
    }

    if (slug === 'home-games') {
        return (
            <div className="relative w-full h-full flex items-center justify-center bg-black/5 dark:bg-white/5">
                <motion.div
                    animate={{
                        rotate: [0, 45, 0, -45, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-[var(--color-brand-primary)] opacity-40"
                >
                    <Binary size={40} />
                </motion.div>
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    className="absolute text-[var(--color-brand-secondary)]"
                >
                    <Zap size={32} fill="currentColor" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex items-center justify-center bg-black/5 dark:bg-white/5">
            <Cpu className="text-zinc-600 animate-pulse" size={32} />
        </div>
    );
}
