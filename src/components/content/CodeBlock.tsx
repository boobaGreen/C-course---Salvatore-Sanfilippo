import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';

interface CodeBlockProps {
    code: string;
    language?: string;
    noLineNumbers?: boolean;
}

export default function CodeBlock({ code, language = 'c' }: CodeBlockProps) {
    const [html, setHtml] = useState<string>('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        async function highlight() {
            try {
                const isDark = document.documentElement.classList.contains('dark');
                const theme = isDark ? 'github-dark' : 'github-light';

                const out = await codeToHtml(code, {
                    lang: language,
                    theme: theme,
                });
                setHtml(out);
            } catch (err) {
                console.error('Highlighting error:', err);
                // Fallback to plain text if highlighting fails
                setHtml(`<pre>${code}</pre>`);
            }
        }
        if (code) {
            highlight();
        } else {
            setHtml('');
        }
    }, [code, language]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-4 rounded-lg overflow-hidden border border-border-color bg-[var(--surface-color)]">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleCopy}
                    className="bg-black/50 hover:bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur"
                >
                    {copied ? 'Copiato!' : 'Copia'}
                </button>
            </div>
            <div
                className="p-4 overflow-x-auto text-sm font-mono"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </div>
    );
}
