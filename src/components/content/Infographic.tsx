import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ZoomIn, Sparkles } from 'lucide-react';

interface InfographicItem {
    label: string;
    value: string;
    color?: 'emerald' | 'blue' | 'purple' | 'amber' | 'red' | 'zinc';
}

interface InfographicProps {
    /** Image mode */
    src?: string;
    alt?: string;
    caption?: string;
    /** Card mode (used by most lessons) */
    title?: string;
    description?: string;
    items?: InfographicItem[];
}

const COLORS: Record<NonNullable<InfographicItem['color']>, { ring: string; chip: string; dot: string }> = {
    emerald: { ring: 'hover:border-emerald-500/40', chip: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
    blue: { ring: 'hover:border-sky-500/40', chip: 'bg-sky-500/10 text-sky-600 dark:text-sky-400', dot: 'bg-sky-500' },
    purple: { ring: 'hover:border-violet-500/40', chip: 'bg-violet-500/10 text-violet-600 dark:text-violet-400', dot: 'bg-violet-500' },
    amber: { ring: 'hover:border-amber-500/40', chip: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
    red: { ring: 'hover:border-red-500/40', chip: 'bg-red-500/10 text-red-600 dark:text-red-400', dot: 'bg-red-500' },
    zinc: { ring: 'hover:border-zinc-500/40', chip: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-300', dot: 'bg-zinc-500' },
};

/** Renders inline `code` spans inside item text. */
function Inline({ text }: { text: string }) {
    return (
        <>
            {text.split(/(`[^`]+`)/g).map((part, i) =>
                part.startsWith('`') && part.endsWith('`')
                    ? <code key={i} className="font-mono text-[0.9em] px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[var(--color-brand-secondary)]">{part.slice(1, -1)}</code>
                    : <span key={i}>{part}</span>,
            )}
        </>
    );
}

export default function Infographic({ src, alt, caption, title, description, items }: InfographicProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // ---------- Card mode
    if (items && items.length > 0) {
        return (
            <figure className="my-8 rounded-2xl border border-black/10 dark:border-white/10 glass-panel overflow-hidden">
                {(title || description) && (
                    <figcaption className="px-5 sm:px-6 py-4 border-b border-black/5 dark:border-white/5 bg-black/[0.03] dark:bg-white/[0.03]">
                        {title && (
                            <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--color-brand-primary)] flex items-center gap-2">
                                <Sparkles size={14} aria-hidden /> {title}
                            </h4>
                        )}
                        {description && <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1">{description}</p>}
                    </figcaption>
                )}
                <ol className={`grid gap-3 p-4 sm:p-5 ${items.length >= 3 ? 'md:grid-cols-3' : items.length === 2 ? 'md:grid-cols-2' : ''}`}>
                    {items.map((item, i) => {
                        const c = COLORS[item.color ?? 'emerald'] ?? COLORS.emerald;
                        return (
                            <li key={i} className={`relative rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/20 p-4 transition-colors ${c.ring}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-mono font-bold ${c.chip}`} aria-hidden>{i + 1}</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-zinc-100"><Inline text={item.label} /></span>
                                </div>
                                <p className="text-[13px] leading-relaxed text-slate-600 dark:text-zinc-400"><Inline text={item.value} /></p>
                                <span className={`absolute left-0 top-4 bottom-4 w-0.5 rounded-full ${c.dot}`} aria-hidden />
                            </li>
                        );
                    })}
                </ol>
            </figure>
        );
    }

    // ---------- Image mode
    if (!src) return null;

    return (
        <div className="my-10 group">
            <div className="relative rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-black/20 shadow-2xl transition-all hover:border-[var(--color-brand-primary)]/30">
                <img
                    src={src}
                    alt={alt ?? ''}
                    loading="lazy"
                    className="w-full h-auto object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-[1.02]"
                    onClick={() => setIsExpanded(true)}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 text-white">
                        <Maximize2 size={24} />
                    </div>
                </div>
                <div className="md:hidden absolute bottom-4 right-4 bg-black/60 backdrop-blur-md rounded-lg px-2 py-1 border border-white/10 flex items-center gap-1.5 pointer-events-none">
                    <ZoomIn size={12} className="text-white" />
                    <span className="text-[10px] text-white">Zoom</span>
                </div>
            </div>
            {caption && <p className="mt-3 text-center text-sm text-slate-500 dark:text-zinc-500 italic">{caption}</p>}

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col"
                        onClick={() => setIsExpanded(false)}
                        role="dialog"
                        aria-label={alt}
                    >
                        <div className="flex justify-end p-4">
                            <button type="button" onClick={() => setIsExpanded(false)} className="p-2 text-white/70 hover:text-white rounded-full bg-white/10" aria-label="Close">
                                <X size={22} />
                            </button>
                        </div>
                        <div className="flex-1 flex items-center justify-center overflow-auto p-4 md:p-12">
                            <img src={src} alt={alt ?? ''} className="max-w-full max-h-full object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
