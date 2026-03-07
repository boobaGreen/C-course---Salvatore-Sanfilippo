import { motion } from 'framer-motion';
import { Zap, Trophy, ShieldCheck } from 'lucide-react';
import { useProgression } from '../../hooks/useProgression';

export default function ProgressionSidebar() {
    const { xp, level, progressToNextLevel, xpToNextLevel } = useProgression();

    const getRank = (lvl: number) => {
        if (lvl < 5) return "Novizio C";
        if (lvl < 10) return "Compilatore Errante";
        if (lvl < 20) return "Maestro dei Puntatori";
        return "Cyber-C Overlord";
    };

    return (
        <div className="mt-8 pt-8 border-t border-black/10 dark:border-white/10 px-2">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]">
                        <Zap size={14} fill="currentColor" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Progresso</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">{xp} XP</span>
            </div>

            {/* Level Card */}
            <div className="glass-panel p-4 rounded-xl border-white/5 bg-white/5 relative overflow-hidden group">
                <div className="flex items-end justify-between mb-2">
                    <div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-tighter">Livello</div>
                        <div className="text-2xl font-black text-white leading-none">{level}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[9px] text-[var(--color-brand-secondary)] uppercase font-bold tracking-tight">Grado</div>
                        <div className="text-xs font-bold text-zinc-300">{getRank(level)}</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressToNextLevel}%` }}
                        className="h-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)]"
                    />
                </div>
                <div className="mt-2 text-[9px] text-zinc-500 font-mono text-center">
                    {xpToNextLevel} XP al prossimo livello
                </div>

                {/* Decorative background icon */}
                <Trophy size={48} className="absolute -bottom-2 -right-2 text-white/5 -rotate-12 group-hover:scale-110 transition-transform" />
            </div>

            {/* Accomplishments mini-stats */}
            <div className="mt-4 grid grid-cols-1 gap-2">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-black/10 dark:bg-white/5 border border-white/5">
                    <ShieldCheck size={14} className="text-[var(--color-brand-primary)]" />
                    <span className="text-[10px] text-zinc-400 font-medium">Sfide completate</span>
                </div>
            </div>
        </div>
    );
}
