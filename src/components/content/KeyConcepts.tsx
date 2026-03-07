import React from 'react';
import { CheckCircle2 } from 'lucide-react';

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
                            <div key={index} className="bg-white/5 p-3 rounded-lg border border-white/5">
                                <h4 className="font-bold text-sm text-[var(--color-brand-secondary)] mb-1">{concept.title}</h4>
                                <p className="text-xs opacity-80 leading-relaxed">{concept.description}</p>
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
