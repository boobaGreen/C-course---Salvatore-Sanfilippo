import { X, Github, ExternalLink, Cpu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface AboutAuthorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AboutAuthorModal({ isOpen, onClose }: AboutAuthorModalProps) {
    const { t } = useTranslation();

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'inherit';
        }
        return () => {
            document.body.style.overflow = 'inherit';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#09090b]/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#18181b] shadow-2xl shadow-black/50"
                    >
                        {/* Header / Banner */}
                        <div className="relative h-32 w-full bg-gradient-to-br from-[#10b981]/20 via-[#0ea5e9]/20 to-[#8b5cf6]/20 overflow-hidden">
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors z-10"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-6 sm:px-10 pb-10 pt-0 relative">
                            {/* Avatar placeholder - floating logic */}
                            <div className="relative -mt-16 mb-6 flex items-end justify-between">
                                <div className="h-28 w-28 rounded-2xl border-4 border-[#18181b] bg-gradient-to-br from-[#10b981] to-[#0ea5e9] flex items-center justify-center shadow-lg overflow-hidden">
                                    {/* Fallback avatar if we don't have an image. Could add an actual antirez photo here */}
                                    <Cpu size={48} className="text-[#18181b] opacity-80" />
                                </div>

                                <div className="flex gap-3 pb-2">
                                    <a href="https://github.com/antirez" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors" title="GitHub">
                                        <Github size={20} />
                                    </a>
                                    <a href="http://invece.org/" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors" title="Website/Blog">
                                        <ExternalLink size={20} />
                                    </a>
                                </div>
                            </div>

                            <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
                                {t('author.title')}
                            </h2>

                            <div className="space-y-4 text-zinc-400 leading-relaxed mt-6">
                                <p dangerouslySetInnerHTML={{ __html: t('author.bio_1') }} />
                                <p dangerouslySetInnerHTML={{ __html: t('author.bio_2') }} />

                                <div className="my-6 p-4 rounded-xl border border-[#10b981]/20 bg-[#10b981]/5 text-sm text-zinc-300">
                                    <p dangerouslySetInnerHTML={{ __html: t('author.bio_3') }} />
                                </div>

                                <p dangerouslySetInnerHTML={{ __html: t('author.bio_4') }} />
                            </div>

                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
