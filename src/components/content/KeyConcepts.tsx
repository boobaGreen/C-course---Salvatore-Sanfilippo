import React from 'react';
import { CheckCircle2 } from 'lucide-react';

/** Renders `code` spans and **bold** inside concept text. */
function Inline({ text }: { text: string }) {
    return (
        <>
            {text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, i) => {
                if (part.startsWith('`') && part.endsWith('`')) {
                    return <code key={i} className="font-mono text-[0.9em] px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[var(--color-brand-secondary)]">{part.slice(1, -1)}</code>;
                }
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="text-slate-900 dark:text-zinc-100">{part.slice(2, -2)}</strong>;
                }
                return <span key={i}>{part}</span>;
            })}
        </>
    );
}

interface Concept {
    title: string;
    description: string;
}

interface KeyConceptsProps {
    title?: string;
    concepts?: Concept[];
    children?: React.ReactNode;
}

export default function KeyConcepts({ title = "Concetti Chiave", concepts, children }: KeyConceptsProps) {
    return (
        <div className="my-8 bg-[var(--color-brand-secondary)]/10 border-l-4 border-[var(--color-brand-secondary)] p-6 rounded-r-lg">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-[var(--color-brand-secondary)]">
                <CheckCircle2 size={24} />
                {title}
            </h3>
            <div className="space-y-4">
                {concepts && concepts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {concepts.map((concept, index) => (
                            <div key={index} className="bg-white/60 dark:bg-white/5 p-3 rounded-lg border border-black/5 dark:border-white/5">
                                <h4 className="font-bold text-sm text-[var(--color-brand-secondary)] mb-1">{concept.title}</h4>
                                <p className="text-xs opacity-80 leading-relaxed"><Inline text={concept.description} /></p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}
