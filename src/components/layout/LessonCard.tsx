import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, Star, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LessonCardProps {
    lesson: {
        id: number;
        slug: string;
        title: { it: string; en: string };
        duration: string;
    };
    language: string;
    isDone?: boolean;
    isLast?: boolean;
}

export default function LessonCard({ lesson, language, isDone = false, isLast = false }: LessonCardProps) {
    const { t } = useTranslation();
    const full = language === 'it' ? lesson.title.it : lesson.title.en;
    const [kicker, ...rest] = full.split(':');
    const title = rest.length ? rest.join(':').trim() : full;
    const isSpecial = lesson.slug.startsWith('special') || lesson.slug.includes('appendix');

    return (
        <Link
            to={`/lesson/${lesson.slug}`}
            className={`group glass-panel rounded-2xl p-4 flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:border-[var(--color-brand-secondary)]/50 ${isLast ? 'ring-1 ring-[var(--color-brand-secondary)]/40' : ''}`}
            aria-label={`${full}${isDone ? `, ${t('home.lesson_done')}` : ''}`}
        >
            <div className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${isDone
                ? 'bg-[var(--color-brand-primary)]/15 text-[var(--color-brand-primary)]'
                : isSpecial
                    ? 'bg-[var(--color-brand-accent)]/10 text-[var(--color-brand-accent)]'
                    : 'bg-black/5 dark:bg-white/5 text-slate-500 dark:text-zinc-400'
                }`} aria-hidden>
                {isDone ? <CheckCircle2 size={20} /> : isSpecial && !/\d/.test(kicker) ? <Star size={18} /> : (kicker.match(/\d+/)?.[0] ?? '•').padStart(2, '0')}
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-zinc-500">
                    <span className={isSpecial ? 'text-[var(--color-brand-accent)]' : ''}>{kicker}</span>
                    <span className="inline-flex items-center gap-1 font-mono normal-case tracking-normal"><Clock size={11} aria-hidden /> {lesson.duration}</span>
                    {isLast && !isDone && <span className="text-[var(--color-brand-secondary)]">· {t('home.lesson_visited')}</span>}
                </div>
                <h4 className="font-semibold text-[15px] leading-snug text-slate-900 dark:text-zinc-100 group-hover:text-[var(--color-brand-secondary)] transition-colors truncate">{title}</h4>
            </div>
            <ArrowRight size={16} className="shrink-0 text-slate-300 dark:text-zinc-600 group-hover:text-[var(--color-brand-secondary)] group-hover:translate-x-0.5 transition-all" aria-hidden />
        </Link>
    );
}
