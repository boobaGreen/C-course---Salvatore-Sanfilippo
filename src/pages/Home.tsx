import { Link } from 'react-router-dom';
import { Terminal, Code2, Info, BookOpen, Zap } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { lessons } from '../data/lessons';
import AboutAuthorModal from '../components/content/AboutAuthorModal';

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { t } = useTranslation();

    return (
        <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-8 relative overflow-hidden">

            {/* Decorative Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-brand-primary)]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-brand-secondary)]/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-5xl mx-auto w-full z-10">

                {/* Hero Section */}
                <div className="text-center mb-24 space-y-6">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-[var(--color-brand-primary)]/30 text-[var(--color-brand-primary)] text-sm font-medium mb-4 hover:bg-[var(--color-brand-primary)]/10 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
                    >
                        <Info size={16} />
                        <span>{t('home.author_badge')}</span>
                    </button>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
                        {t('home.hero_title').split(' ').map((word, i) => (
                            word === 'C' ? <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)]"> C </span> : word + ' '
                        ))}
                    </h1>

                    <p className="text-xl text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed mt-6">
                        {t('home.hero_description')}
                    </p>

                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        {lessons.length > 0 && (
                            <Link
                                to={`/lesson/${lessons[0].slug}`}
                                className="px-8 py-4 rounded-xl bg-slate-900 text-slate-50 dark:bg-zinc-100 dark:text-zinc-950 font-bold text-lg hover:bg-[var(--color-brand-primary)] dark:hover:bg-[var(--color-brand-primary)] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center gap-2"
                            >
                                {t('home.start_now')} <Terminal size={20} />
                            </Link>
                        )}
                        <a
                            href="https://www.youtube.com/playlist?list=PLrEMgOSrS_3cFJpM2gdw8EGFyRBZOyAKY"
                            target="_blank"
                            rel="noreferrer"
                            className="px-8 py-4 rounded-xl glass-panel text-slate-900 dark:text-zinc-100 font-bold text-lg hover:bg-slate-100 dark:hover:bg-zinc-800/50 hover:border-[var(--color-brand-secondary)]/50 transition-all flex items-center gap-2"
                        >
                            {t('home.watch_youtube')}
                        </a>
                    </div>
                </div>

                {/* Features Grid - Restored to 3 cards as requested */}
                <div className="grid md:grid-cols-3 gap-6 mt-20">
                    {/* Card 1: Terminal */}
                    <div className="glass-panel p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300 group">
                        <div className="w-12 h-12 rounded-lg bg-[var(--color-brand-secondary)]/10 text-[var(--color-brand-secondary)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-brand-secondary)]/20 transition-colors">
                            <Terminal size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 mb-2">{t('home.features.editor_title')}</h3>
                        <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">{t('home.features.editor_desc')}</p>
                    </div>

                    {/* Card 2: Games */}
                    <div className="glass-panel p-6 rounded-2xl border-[var(--color-brand-primary)]/20 shadow-[0_4px_24px_-12px_rgba(16,185,129,0.2)] hover:-translate-y-1 transition-transform duration-300 group">
                        <div className="w-12 h-12 rounded-lg bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-brand-primary)]/20 transition-colors">
                            <Code2 size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 mb-2">{t('home.features.games_title')}</h3>
                        <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">{t('home.features.games_desc')}</p>
                    </div>

                    {/* Card 3: Simulations (Replaces Bilingual) */}
                    <div className="glass-panel p-6 rounded-2xl border-[var(--color-brand-accent)]/10 hover:-translate-y-1 transition-transform duration-300 group">
                        <div className="w-12 h-12 rounded-lg bg-[var(--color-brand-accent)]/10 text-[var(--color-brand-accent)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-brand-accent)]/20 transition-colors">
                            <BookOpen size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 mb-2">{t('home.features.simulations_title')}</h3>
                        <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">{t('home.features.simulations_desc')}</p>
                    </div>
                </div>

                {/* Info block: Quiz vs Advanced Terminal Challenges */}
                <div className="glass-panel p-6 rounded-2xl border-[var(--color-brand-accent)]/20 mt-12 flex flex-col sm:flex-row gap-6 items-start shadow-[0_4px_24px_-12px_rgba(244,63,94,0.15)]">
                    <div className="w-12 h-12 shrink-0 rounded-lg bg-[var(--color-brand-accent)]/10 text-[var(--color-brand-accent)] flex items-center justify-center mb-0 sm:mb-4">
                        <Info size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 mb-2">{t('home.questions_info.title')}</h3>
                        <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">
                            {t('home.questions_info.description')}
                        </p>
                    </div>
                </div>

                {/* Changelog Section */}
                <div className="mt-12 p-6 rounded-2xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[var(--color-brand-primary)] mb-4 flex items-center gap-2">
                        <Zap size={16} />
                        {t('home.changelog.title')}
                    </h3>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-zinc-400">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)] shrink-0" />
                            <span>{t('home.changelog.page_persistence')}</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-zinc-400">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)] shrink-0" />
                            <span>{t('home.changelog.video_persistence')}</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-zinc-400">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)] shrink-0" />
                            <span>{t('home.changelog.lesson_02_restoration')}</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-zinc-400">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)] shrink-0" />
                            <span>{t('home.changelog.simulator_improvements')}</span>
                        </li>
                    </ul>
                </div>
            </div>

            <AboutAuthorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}

