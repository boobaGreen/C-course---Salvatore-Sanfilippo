import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';
import { useProgression } from '../../hooks/useProgression';

export default function XpToast() {
    const { xpEvents, removeXpEvent } = useProgression();

    useEffect(() => {
        if (xpEvents.length > 0) {
            const latestEvent = xpEvents[xpEvents.length - 1];
            const timer = setTimeout(() => {
                removeXpEvent(latestEvent.id);
            }, 3000); // Hide after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [xpEvents, removeXpEvent]);

    return (
        <div className="fixed bottom-6 right-6 z-[9999] p-4 pointer-events-none flex flex-col gap-2">
            <AnimatePresence>
                {xpEvents.map((event) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 50, scale: 0.3 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                        className="bg-zinc-900 border border-[var(--color-brand-primary)]/50 rounded-xl p-3 shadow-2xl flex items-center gap-4 min-w-[200px]"
                        style={{
                            boxShadow: '0 0 20px rgba(0, 255, 170, 0.1), inset 0 0 20px rgba(0, 255, 170, 0.05)'
                        }}
                    >
                        <div className="bg-[var(--color-brand-primary)]/20 p-2 rounded-full">
                            <Trophy className="text-[var(--color-brand-primary)] w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-sm tracking-wide flex items-center gap-1">
                                +{event.amount} XP <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            </span>
                            <span className="text-zinc-400 text-[10px] uppercase font-bold tracking-widest">
                                Ricompensa
                            </span>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
