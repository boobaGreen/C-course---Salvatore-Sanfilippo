import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface KeyConceptsProps {
    title?: string;
    children: React.ReactNode;
}

export default function KeyConcepts({ title = "Concetti Chiave", children }: KeyConceptsProps) {
    return (
        <div className="my-8 bg-[var(--color-brand-secondary)]/10 border-l-4 border-[var(--color-brand-secondary)] p-6 rounded-r-lg">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-[var(--color-brand-secondary)]">
                <CheckCircle2 size={24} />
                {title}
            </h3>
            <div className="space-y-2">
                {children}
            </div>
        </div>
    );
}
