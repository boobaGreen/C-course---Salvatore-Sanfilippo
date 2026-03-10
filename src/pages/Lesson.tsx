import { useEffect, useState } from 'react';
import type { FunctionComponent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import storage, { STORAGE_KEYS } from '../utils/storage';
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
import OverflowSimulator from '../components/content/OverflowSimulator';
import BranchingFlowchart from '../components/content/BranchingFlowchart';
import ScopeExplorer from '../components/content/ScopeExplorer';
import LimitsExplorer from '../components/content/LimitsExplorer';
import BinaryVisualizer from '../components/content/BinaryVisualizer';
import ASCIIConverter from '../components/content/ASCIIConverter';
import BranchingSimulator from '../components/content/BranchingSimulator';
import RecursionVisualizer from '../components/content/RecursionVisualizer';
import SwitchBoard from '../components/content/SwitchBoard';
import ProTerminal from '../components/content/ProTerminal';
import GameOfLife from '../components/content/GameOfLife';
import PointerBasics from '../components/content/PointerBasics';
import PointerArithmetic from '../components/content/PointerArithmetic';
import MemoryCaster from '../components/content/MemoryCaster';
import HeapAllocator from '../components/content/HeapAllocator';
import BSTVisualizer from '../components/content/BSTVisualizer';
import RefcountVisualizer from '../components/content/RefcountVisualizer';
import SpectrumMemoryVisualizer from '../components/content/SpectrumMemoryVisualizer';
import AttributeGrid from '../components/content/AttributeGrid';
import EvoSimulator from '../components/content/EvoSimulator';
import PerformanceChart from '../components/content/PerformanceChart';
import WorkflowDiagram from '../components/content/WorkflowDiagram';
import RefcountCycleSim from '../components/content/RefcountCycleSim';
import BSTBalanceSim from '../components/content/BSTBalanceSim';
import ZXPalette from '../components/content/ZXPalette';

// Mappa componenti MDX
// Mappa base componenti MDX (statici)
const mdxComponents = {
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h1 className="text-3xl font-bold mt-8 mb-4 text-[var(--color-brand-primary)]" {...props} />,
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className="text-2xl font-bold mt-8 mb-4 border-b border-black/10 dark:border-white/10 pb-2" {...props} />,
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className="text-xl font-bold mt-6 mb-3" {...props} />,
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p className="mb-4 leading-relaxed" {...props} />,
    ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul className="list-disc list-inside mb-4 space-y-1" {...props} />,
    ol: (props: React.HTMLAttributes<HTMLOListElement>) => <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />,
    li: (props: React.HTMLAttributes<HTMLLIElement>) => <li className="text-opacity-90" {...props} />,
    a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a className="text-[var(--color-brand-secondary)] hover:underline" {...props} />,
    blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => <blockquote className="border-l-4 border-[var(--color-brand-accent)] pl-4 italic opacity-80 my-4 bg-black/5 dark:bg-white/5 py-2 pr-2" {...props} />,
    code: (props: React.HTMLAttributes<HTMLElement>) => {
        const isInline = !props.className?.includes('language-');
        if (isInline) {
            return <code className="bg-black/10 dark:bg-white/10 rounded px-1.5 py-0.5 font-mono text-sm text-[var(--color-brand-primary)]" {...props} />;
        }
        const match = /language-(\w+)/.exec(props.className || '');
        const lang = match ? match[1] : 'c';
        return <CodeBlock code={String(props.children).replace(/\n$/, '')} language={lang} />;
    },
    pre: (props: React.HTMLAttributes<HTMLPreElement>) => <>{props.children}</>,

    // Custom Components statici
    VideoEmbed,
    KeyConcepts,
    Diagram,
    ComparisonTable,
    Callout,
    AssemblyExplorer,
    Infographic,
    StackVisualizer,
    MicroRegisters,
    OverflowSimulator,
    BranchingFlowchart,
    ScopeExplorer,
    LimitsExplorer,
    BinaryVisualizer,
    ASCIIConverter,
    BranchingSimulator,
    RecursionVisualizer,
    SwitchBoard,
    GameOfLife,
    PointerBasics,
    PointerArithmetic,
    MemoryCaster,
    HeapAllocator,
    BSTVisualizer,
    RefcountVisualizer,
    SpectrumMemoryVisualizer,
    AttributeGrid,
    EvoSimulator,
    PerformanceChart,
    WorkflowDiagram,
    RefcountCycleSim,
    BSTBalanceSim,
    ZXPalette,
};


import type { QuizProps } from '../components/exercises/Quiz';
import type { ProTerminalProps } from '../components/content/ProTerminal';
import type { TerminalSimulationProps } from '../components/content/TerminalSimulation';

export default function Lesson() {
    const { slug } = useParams<{ slug: string }>();
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const [LessonContent, setLessonContent] = useState<FunctionComponent<{ components: Record<string, React.ElementType> }> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Mappa componenti MDX con iniezione dinamica dello slug per persistenza
    const components = {
        ...mdxComponents,
        CodeEditor: (props: { initialCode: string }) => <CodeEditor {...props} lessonSlug={slug} />,
        Quiz: (props: QuizProps) => <Quiz {...props} lessonSlug={slug} />,
        ProTerminal: (props: ProTerminalProps) => <ProTerminal {...props} lessonSlug={slug} />,
        TypeMatcher: (props: { lessonSlug?: string }) => <TypeMatcher {...props} lessonSlug={slug} />,
        TerminalSimulation: (props: TerminalSimulationProps) => <TerminalSimulation {...props} lessonSlug={slug} />,
    };


    // 1. Data Loading Effect
    useEffect(() => {
        if (!slug) return;

        setLoading(true);
        setError(false);

        const loadContent = async () => {
            try {
                const module = await import(`../content/${i18n.language}/${slug}.mdx`);
                setLessonContent(() => module.default);
            } catch (err) {
                console.error("Error loading lesson:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, [slug, i18n.language]);

    // 2. Scroll Restoration Effect - Fires when loading finishes
    useEffect(() => {
        if (!loading && LessonContent && slug) {
            const mainElement = document.getElementById('main-content');
            const savedScroll = storage.get<string>(STORAGE_KEYS.LESSON_SCROLL(slug));
            
            if (mainElement && savedScroll) {
                // Wait a tiny bit for the browser to paint the MDX content
                const timer = setTimeout(() => {
                    mainElement.scrollTop = parseInt(savedScroll, 10);
                }, 100);
                return () => clearTimeout(timer);
            } else if (mainElement) {
                // Default to top if no saved scroll
                mainElement.scrollTop = 0;
            }
        }
    }, [loading, LessonContent, slug]);

    // 3. Scroll Saving Effect
    useEffect(() => {
        const mainElement = document.getElementById('main-content');
        if (!mainElement || !slug) return;

        let timeoutId: number;
        const handleScroll = () => {
            clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => {
                storage.set(STORAGE_KEYS.LESSON_SCROLL(slug), mainElement.scrollTop.toString());
            }, 500);
        };

        mainElement.addEventListener('scroll', handleScroll);
        
        return () => {
            // Save one last time on cleanup to catch navigations
            const currentScroll = mainElement.scrollTop;
            if (currentScroll > 0) {
                storage.set(STORAGE_KEYS.LESSON_SCROLL(slug), currentScroll.toString());
            }
            mainElement.removeEventListener('scroll', handleScroll);
            clearTimeout(timeoutId);
        };
    }, [slug]);

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
                <LessonContent components={components} />
            </div>
        </div>
    );
}

