import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

const TYPES = ['int', 'char', 'float', 'double', 'char*', 'void'];
const VALUES = [
    { val: '42', type: 'int' },
    { val: "'A'", type: 'char' },
    { val: '3.14f', type: 'float' },
    { val: '2.7182818', type: 'double' },
    { val: '"Hello"', type: 'char*' },
];

export default function TypeMatcher() {
    const [matches, setMatches] = useState<Record<string, string>>({});
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        if (Object.keys(matches).length === VALUES.length) {
            setIsCompleted(true);
        }
    }, [matches]);

    const handleTypeClick = (type: string) => {
        setSelectedType(type === selectedType ? null : type);
    };

    const handleValueClick = (valItem: typeof VALUES[0]) => {
        if (!selectedType) return;

        // Verifica se il match è corretto
        if (valItem.type === selectedType) {
            setMatches((prev) => ({ ...prev, [valItem.val]: selectedType }));
            setSelectedType(null);
        } else {
            // Feedback errore visivo: scuotimento del container
            const el = document.getElementById(`val-${valItem.val}`);
            el?.classList.add('animate-shake', 'bg-red-500/20', 'border-red-500');
            setTimeout(() => {
                el?.classList.remove('animate-shake', 'bg-red-500/20', 'border-red-500');
            }, 500);
        }
    };

    return (
        <div className="my-8 rounded-xl border border-border-color bg-[var(--surface-color)] p-6 shadow-sm">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        🎮 Type Matcher
                    </h3>
                    <p className="text-sm opacity-70 mt-1">
                        Seleziona un tipo in alto e poi clicca sul valore corrispondente in basso.
                    </p>
                </div>
                {isCompleted && (
                    <div className="flex items-center gap-2 text-[var(--color-brand-primary)] font-bold bg-[var(--color-brand-primary)]/10 px-3 py-1 rounded-full">
                        <CheckCircle2 size={18} /> Livello Superato!
                    </div>
                )}
            </div>

            <div className="space-y-8">
                {/* Tipi */}
                <div className="flex flex-wrap gap-3 mt-4">
                    {TYPES.map(type => (
                        <button
                            key={type}
                            onClick={() => handleTypeClick(type)}
                            className={`px-4 py-2 font-mono rounded-md border-2 transition-all ${selectedType === type
                                ? 'border-[var(--color-brand-secondary)] bg-[var(--color-brand-secondary)]/20 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                                : 'border-border-color hover:border-white/50 bg-black/5 dark:bg-white/5'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Valori */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {VALUES.map(v => {
                        const isMatched = matches[v.val] !== undefined;
                        return (
                            <button
                                key={v.val}
                                id={`val-${v.val}`}
                                onClick={() => !isMatched && handleValueClick(v)}
                                disabled={isMatched}
                                className={`flex flex-col items-center justify-center p-6 border-2 font-mono rounded-xl transition-all duration-300 ${isMatched
                                    ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]'
                                    : 'border-border-color border-dashed hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer'
                                    }`}
                            >
                                <div className="text-xl font-bold">{v.val}</div>
                                {isMatched && <div className="text-xs mt-2 uppercase tracking-widest">{matches[v.val]}</div>}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
