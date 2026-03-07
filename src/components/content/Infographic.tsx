import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ZoomIn } from 'lucide-react';

interface InfographicProps {
    src: string;
    alt: string;
    caption?: string;
}

export default function Infographic({ src, alt, caption }: InfographicProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="my-10 group">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/20 shadow-2xl transition-all hover:border-[var(--color-brand-primary)]/30">
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-auto object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-[1.02]"
                    onClick={() => setIsExpanded(true)}
                />

                {/* Overlay with buttons */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <div className="bg-white/10 backdrop-blur-md rounded-full p-4 border border-white/20 scale-90 group-hover:scale-100 transition-transform">
                        <Maximize2 className="text-white" size={24} />
                    </div>
                </div>

                {/* Mobile Tap Indicator */}
                <div className="md:hidden absolute bottom-4 right-4 bg-black/60 backdrop-blur-md rounded-lg px-2 py-1 border border-white/10 flex items-center gap-1.5 pointer-events-none">
                    <ZoomIn size={12} className="text-[var(--color-brand-primary)]" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-white">Tap to expand</span>
                </div>
            </div>

            {caption && (
                <p className="mt-4 text-center text-xs text-zinc-500 italic opacity-80 uppercase tracking-widest leading-relaxed px-4">
                    {caption}
                </p>
            )}

            {/* Expandable Modal */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col p-4 md:p-8"
                    >
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-white transition-all hover:rotate-90"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 flex items-center justify-center overflow-auto p-4 md:p-12">
                            <motion.img
                                layoutId="infographic-image"
                                src={src}
                                alt={alt}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                            />
                        </div>

                        {caption && (
                            <div className="mt-8 text-center max-w-2xl mx-auto">
                                <p className="text-white font-medium text-sm md:text-base border-t border-white/10 pt-4">
                                    {alt}
                                </p>
                                <p className="text-zinc-400 text-xs md:text-sm mt-2 leading-relaxed">
                                    {caption}
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
