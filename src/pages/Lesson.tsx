import { useEffect, useState } from 'react';
import type { FunctionComponent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CodeBlock from '../components/content/CodeBlock';
import VideoEmbed from '../components/content/VideoEmbed';
import KeyConcepts from '../components/content/KeyConcepts';
import CodeEditor from '../components/exercises/CodeEditor';
import TypeMatcher from '../components/games/TypeMatcher';
import TerminalSimulation from '../components/content/TerminalSimulation';
import Quiz from '../components/exercises/Quiz';
import Diagram from '../components/content/Diagram';
import ComparisonTable from '../components/content/ComparisonTable';
import Callout from '../components/content/Callout';
import AssemblyExplorer from '../components/content/AssemblyExplorer';
import Infographic from '../components/content/Infographic';
import StackVisualizer from '../components/content/StackVisualizer';
import MicroRegisters from '../components/content/MicroRegisters';

// Mappa componenti MDX
const mdxComponents = {
    h1: (props: any) => <h1 className="text-3xl font-bold mt-8 mb-4 text-[var(--color-brand-primary)]" {...props} />,
    h2: (props: any) => <h2 className="text-2xl font-bold mt-8 mb-4 border-b border-black/10 dark:border-white/10 pb-2" {...props} />,
    h3: (props: any) => <h3 className="text-xl font-bold mt-6 mb-3" {...props} />,
    p: (props: any) => <p className="mb-4 leading-relaxed" {...props} />,
    ul: (props: any) => <ul className="list-disc list-inside mb-4 space-y-1" {...props} />,
    ol: (props: any) => <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />,
    li: (props: any) => <li className="text-opacity-90" {...props} />,
    a: (props: any) => <a className="text-[var(--color-brand-secondary)] hover:underline" {...props} />,
    blockquote: (props: any) => <blockquote className="border-l-4 border-[var(--color-brand-accent)] pl-4 italic opacity-80 my-4 bg-black/5 dark:bg-white/5 py-2 pr-2" {...props} />,
    code: (props: any) => {
        // Gestione differenziata tra inline code e code blocks
        const isInline = !props.className?.includes('language-');
        if (isInline) {
            return <code className="bg-black/10 dark:bg-white/10 rounded px-1.5 py-0.5 font-mono text-sm text-[var(--color-brand-primary)]" {...props} />;
        }
        const match = /language-(\w+)/.exec(props.className || '');
        const lang = match ? match[1] : 'c';
        return <CodeBlock code={String(props.children).replace(/\n$/, '')} language={lang} />;
    },
    pre: (props: any) => <>{props.children}</>, // Il pre è gestito dal nostro CodeBlock

    // Custom Components disponibili nel MDX
    VideoEmbed,
    KeyConcepts,
    CodeEditor,
    TypeMatcher,
    TerminalSimulation,
    Quiz,
    Diagram,
    ComparisonTable,
    Callout,
    AssemblyExplorer,
    Infographic,
    StackVisualizer,
    MicroRegisters,
};

export default function Lesson() {
    const { slug } = useParams<{ slug: string }>();
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const [LessonContent, setLessonContent] = useState<FunctionComponent<any> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!slug) return;

        setLoading(true);
        setError(false);

        // Lazy load the MDX content based on language and slug
        const loadContent = async () => {
            const mainElement = document.querySelector('main');
            const currentScroll = mainElement?.scrollTop || 0;
            try {
                // Usa import dinamico: Vite supporta variabili nei paths parzialmente
                // Dobbiamo dirgli dove cercare esplicitamente
                const module = await import(`../content/${i18n.language}/${slug}.mdx`);
                setLessonContent(() => module.default);
                if (mainElement) {
                    setTimeout(() => {
                        mainElement.scrollTop = currentScroll;
                    }, 0);
                }
            } catch (err) {
                console.error("Error loading lesson:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, [slug, i18n.language]);

    if (loading) {
        return <div className="p-8 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-[var(--color-brand-primary)] border-t-transparent rounded-full"></div></div>;
    }

    if (error || !LessonContent) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4 text-red-500">Lezione non trovata / Lesson not found</h2>
                <button onClick={() => navigate('/')} className="text-[var(--color-brand-secondary)] hover:underline">
                    Torna alla Home / Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto pb-24">
            <div className="prose prose-invert max-w-none">
                <LessonContent components={mdxComponents} />
            </div>
        </div>
    );
}
