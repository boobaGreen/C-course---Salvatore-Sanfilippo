import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, CheckCircle2, LayoutList } from 'lucide-react';
import { lessons } from '../../data/lessons';
import { useProgression } from '../../hooks/useProgression';

interface LessonNavProps {
    slug: string;
}

/** Previous / next lesson footer with a "mark as completed" shortcut. */
export default function LessonNav({ slug }: LessonNavProps) {
    const { t, i18n } = useTranslation();
    const { completedLessons, completeLesson } = useProgression();
    const lang = (i18n.language === 'en' ? 'en' : 'it') as 'it' | 'en';

    const index = lessons.findIndex((l) => l.slug === slug);
    if (index === -1) return null;
    const prev = lessons[index - 1];
    const next = lessons[index + 1];
    const isDone = completedLessons.includes(slug);
    const short = (title: string) => title.split(':').slice(1).join(':').trim() || title;

    return (
        <nav aria-label={t('lesson_page.index')} className="mt-14 pt-8 border-t border-black/10 dark:border-white/10 space-y-4">
            {!isDone && (
                <button
                    type="button"
                    onClick={() => completeLesson(slug)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-brand-primary)] text-black font-bold text-sm hover:brightness-110 transition-all"
                >
                    <CheckCircle2 size={18} aria-hidden /> {t('lesson_page.mark_complete')} <span className="text-xs opacity-70">{t('lesson_page.mark_complete_hint')}</span>
                </button>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {prev ? (
                    <Link to={`/lesson/${prev.slug}`} className="group glass-panel rounded-2xl p-4 flex items-center gap-3 hover:border-[var(--color-brand-secondary)]/50 transition-colors">
                        <ArrowLeft size={18} className="shrink-0 text-slate-400 dark:text-zinc-500 group-hover:text-[var(--color-brand-secondary)] group-hover:-translate-x-0.5 transition-all" aria-hidden />
                        <span className="min-w-0">
                            <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-zinc-500">{t('lesson_page.prev')}</span>
                            <span className="block text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate">{short(prev.title[lang])}</span>
                        </span>
                    </Link>
                ) : (
                    <Link to="/" className="group glass-panel rounded-2xl p-4 flex items-center gap-3 hover:border-[var(--color-brand-secondary)]/50 transition-colors">
                        <LayoutList size={18} className="shrink-0 text-slate-400 dark:text-zinc-500" aria-hidden />
                        <span className="text-sm font-semibold text-slate-900 dark:text-zinc-100">{t('lesson_page.back_home')}</span>
                    </Link>
                )}
                {next ? (
                    <Link to={`/lesson/${next.slug}`} className="group glass-panel rounded-2xl p-4 flex items-center justify-end gap-3 text-right hover:border-[var(--color-brand-secondary)]/50 transition-colors">
                        <span className="min-w-0">
                            <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-zinc-500">{t('lesson_page.next')}</span>
                            <span className="block text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate">{short(next.title[lang])}</span>
                        </span>
                        <ArrowRight size={18} className="shrink-0 text-slate-400 dark:text-zinc-500 group-hover:text-[var(--color-brand-secondary)] group-hover:translate-x-0.5 transition-all" aria-hidden />
                    </Link>
                ) : (
                    <Link to="/" className="group glass-panel rounded-2xl p-4 flex items-center justify-end gap-3 hover:border-[var(--color-brand-secondary)]/50 transition-colors">
                        <span className="text-sm font-semibold text-slate-900 dark:text-zinc-100">{t('lesson_page.back_home')}</span>
                        <LayoutList size={18} className="shrink-0 text-slate-400 dark:text-zinc-500" aria-hidden />
                    </Link>
                )}
            </div>
        </nav>
    );
}
