import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Code2, Info, BookOpen, Zap, ChevronDown, Youtube, ArrowRight, Github, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { lessons } from '../data/lessons';
import { useProgression } from '../hooks/useProgression';
import storage, { STORAGE_KEYS } from '../utils/storage';
import AboutAuthorModal from '../components/content/AboutAuthorModal';
import LessonGrid from '../components/layout/LessonGrid';

const APP_VERSION = __APP_VERSION__;

/** Sum of lesson durations ("mm:ss" or "h:mm:ss") in hours, rounded. */
const totalHours = Math.round(
    lessons.reduce((acc, l) => {
        const parts = l.duration.replace(/[^\d:]/g, '').split(':').map(Number);
        const secs = parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts.length === 2 ? parts[0] * 60 + parts[1] : 0;
        return acc + secs;
    }, 0) / 3600,
);

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const { t, i18n } = useTranslation();
    const { completedLessons } = useProgression();
    const lang = (i18n.language === 'en' ? 'en' : 'it') as 'it' | 'en';

    const lastSlug = storage.get<string>(STORAGE_KEYS.LAST_LESSON);
    const lastLesson = lessons.find((l) => l.slug === lastSlug) ?? null;
    const doneCount = completedLessons.filter((s) => lessons.some((l) => l.slug === s)).length;
    const startTarget = lastLesson ?? lessons[0];

    const changelogVersions = ['v120', 'v110', 'v103', 'v102', 'v101'];
    const latest = t(`home.changelog.${changelogVersions[0]}`, { returnObjects: true }) as Record<string, string>;

    const features = [
        { icon: Terminal, color: 'secondary', title: t('home.features.editor_title'), desc: t('home.features.editor_desc') },
        { icon: Code2, color: 'primary', title: t('home.features.games_title'), desc: t('home.features.games_desc') },
        { icon: BookOpen, color: 'accent', title: t('home.features.simulations_title'), desc: t('home.features.simulations_desc') },
    ] as const;

    return (
        <div className="w-full relative">
            {/* Decorative background */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-brand-primary)]/10 rounded-full blur-[120px] pointer-events-none" aria-hidden />
            <div className="absolute top-40 right-0 w-96 h-96 bg-[var(--color-brand-secondary)]/10 rounded-full blur-[120px] pointer-events-none" aria-hidden />

            <div className="relative z-10 space-y-16 md:space-y-24 py-6 md:py-12">
                {/* Hero */}
                <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-6 max-w-3xl mx-auto"
                >
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-[var(--color-brand-primary)]/30 text-[var(--color-brand-primary)] text-sm font-medium hover:bg-[var(--color-brand-primary)]/10 transition-colors cursor-pointer"
                    >
                        <Info size={16} aria-hidden />
                        <span>{t('home.author_badge')}</span>
                    </button>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50 leading-[1.02]">
                        {t('home.hero_title').split(' ').map((word, i) => (
                            word === 'C' ? <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)]"> C </span> : word + ' '
                        ))}
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        {t('home.hero_description')}
                    </p>

                    <div className="pt-2 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
                        <Link
                            to={`/lesson/${startTarget.slug}`}
                            className="px-7 py-4 rounded-xl bg-slate-900 text-slate-50 dark:bg-zinc-100 dark:text-zinc-950 font-bold hover:bg-[var(--color-brand-primary)] dark:hover:bg-[var(--color-brand-primary)] hover:text-white transition-colors shadow-[0_10px_30px_-10px_rgba(16,185,129,0.6)] inline-flex items-center justify-center gap-2"
                        >
                            {lastLesson ? <ArrowRight size={18} aria-hidden /> : <Play size={18} className="fill-current" aria-hidden />}
                            {lastLesson ? t('home.continue', { title: lastLesson.title[lang].split(':')[0] }) : t('home.start_now')}
                        </Link>
                        <a
                            href="https://www.youtube.com/playlist?list=PLrEMgOSrS_3cFJpM2gdw8EGFyRBZOyAKY"
                            target="_blank"
                            rel="noreferrer"
                            className="px-7 py-4 rounded-xl glass-panel text-slate-900 dark:text-zinc-100 font-bold hover:border-[var(--color-brand-secondary)]/50 transition-colors inline-flex items-center justify-center gap-2"
                        >
                            <Youtube size={18} className="text-red-500" aria-hidden />
                            {t('home.watch_youtube')}
                        </a>
                    </div>

                    {doneCount > 0 && (
                        <p className="text-xs text-slate-500 dark:text-zinc-500">
                            {t('nav.lessons_done', { done: doneCount, total: lessons.length })} · {Math.round((doneCount / lessons.length) * 100)}%
                        </p>
                    )}
                </motion.section>

                {/* Stats */}
                <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
                    {[
                        [lessons.length, t('home.stats.lessons')],
                        [`${totalHours}+`, t('home.stats.hours')],
                        ['40+', t('home.stats.games')],
                        ['0 €', t('home.stats.free')],
                    ].map(([value, label]) => (
                        <div key={String(label)} className="glass-panel rounded-2xl py-4 px-3 text-center">
                            <dd className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</dd>
                            <dt className="text-[11px] uppercase tracking-[0.15em] text-slate-500 dark:text-zinc-500 font-bold mt-0.5">{label}</dt>
                        </div>
                    ))}
                </dl>

                {/* Features */}
                <section className="grid md:grid-cols-3 gap-4" aria-label="Features">
                    {features.map((f) => (
                        <div key={f.title} className="glass-panel p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300 group">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-[var(--color-brand-${f.color})]/10 text-[var(--color-brand-${f.color})]`}>
                                <f.icon size={22} aria-hidden />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 mb-1.5">{f.title}</h3>
                            <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </section>

                {/* Curriculum */}
                <section aria-labelledby="curriculum-title">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
                        <div>
                            <h2 id="curriculum-title" className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">{t('home.curriculum_title')}</h2>
                            <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1">{t('home.curriculum_desc', { count: lessons.length })}</p>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-zinc-500 inline-flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-sm bg-[var(--color-brand-primary)]/40" aria-hidden /> {t('home.lesson_done')}
                            <span className="w-2.5 h-2.5 rounded-sm bg-[var(--color-brand-accent)]/40 ml-2" aria-hidden /> Extra
                        </div>
                    </div>
                    <LessonGrid lastSlug={lastSlug} />
                </section>

                {/* Question types info */}
                <section className="glass-panel p-6 rounded-2xl border-[var(--color-brand-accent)]/20 flex flex-col sm:flex-row gap-5 items-start">
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-[var(--color-brand-accent)]/10 text-[var(--color-brand-accent)] flex items-center justify-center">
                        <Info size={22} aria-hidden />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 mb-1.5">{t('home.questions_info.title')}</h3>
                        <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed">{t('home.questions_info.description')}</p>
                    </div>
                </section>

                {/* Changelog */}
                <section className="rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden" aria-labelledby="changelog-title">
                    <div className="p-6 bg-black/5 dark:bg-white/5">
                        <h3 id="changelog-title" className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-primary)] mb-3 flex items-center gap-2">
                            <Zap size={14} aria-hidden />
                            {t('home.changelog_title')} · v{APP_VERSION}
                        </h3>
                        <ul className="space-y-2">
                            {Object.entries(latest).filter(([k]) => k !== 'title').map(([key, value]) => (
                                <li key={key} className="flex items-start gap-3 text-sm text-slate-600 dark:text-zinc-400">
                                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)] shrink-0" aria-hidden />
                                    <span>{value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowHistory((s) => !s)}
                        aria-expanded={showHistory}
                        className="w-full px-6 py-3 flex items-center justify-between bg-black/[0.03] dark:bg-white/[0.03] hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-t border-black/5 dark:border-white/5 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500"
                    >
                        {t('home.changelog.history_title')}
                        <motion.span animate={{ rotate: showHistory ? 180 : 0 }}><ChevronDown size={14} aria-hidden /></motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                        {showHistory && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                            >
                                <div className="p-6 space-y-6 border-t border-black/5 dark:border-white/5">
                                    {changelogVersions.slice(1).map((v) => {
                                        const entry = t(`home.changelog.${v}`, { returnObjects: true }) as Record<string, string>;
                                        return (
                                            <div key={v} className="space-y-2">
                                                <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300">{entry.title ?? v}</h4>
                                                <ul className="space-y-1.5 ml-1">
                                                    {Object.entries(entry).filter(([k]) => k !== 'title').map(([key, value]) => (
                                                        <li key={key} className="flex items-start gap-3 text-xs text-slate-500 dark:text-zinc-500">
                                                            <div className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 dark:bg-zinc-600 shrink-0" aria-hidden />
                                                            <span>{value}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                <p className="text-center">
                    <a href="https://github.com/boobaGreen/C-course---Salvatore-Sanfilippo" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-500 hover:text-[var(--color-brand-secondary)] transition-colors">
                        <Github size={14} aria-hidden /> {t('home.github')}
                    </a>
                </p>
            </div>

            <AboutAuthorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
