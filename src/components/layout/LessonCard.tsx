import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Clock } from 'lucide-react';
import AnimatedPreview from './AnimatedPreview';

interface LessonCardProps {
    lesson: {
        id: number;
        slug: string;
        title: {
            it: string;
            en: string;
        };
        duration: string;
    };
    language: string;
}

export default function LessonCard({ lesson, language }: LessonCardProps) {
    const title = language === 'it' ? lesson.title.it : lesson.title.en;

    return (
        <Link to={`/lesson/${lesson.slug}`} className="block group">
            <motion.div
                whileHover={{ y: -5 }}
                className="glass-panel p-5 rounded-2xl border-white/10 hover:border-[var(--color-brand-primary)]/50 transition-all duration-300 shadow-lg hover:shadow-[var(--color-brand-primary)]/10"
            >
                {/* Visual Preview Area */}
                <div className="mb-4 relative rounded-xl overflow-hidden aspect-video bg-zinc-900/50 flex items-center justify-center border border-white/5">
                    <AnimatedPreview slug={lesson.slug} />

                    {/* Play Overlay on Hover */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px] transition-opacity"
                    >
                        <div className="w-12 h-12 rounded-full bg-[var(--color-brand-primary)] text-black flex items-center justify-center shadow-lg shadow-[var(--color-brand-primary)]/30">
                            <Play size={24} fill="currentColor" />
                        </div>
                    </motion.div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black tracking-widest uppercase text-zinc-500">
                            Lesson {lesson.id.toString().padStart(2, '0')}
                        </span>
                        <div className="flex items-center gap-1 text-zinc-500 text-[10px] font-mono">
                            <Clock size={12} />
                            {lesson.duration}
                        </div>
                    </div>
                    <h4 className="font-bold text-lg text-slate-900 dark:text-zinc-100 leading-tight group-hover:text-[var(--color-brand-primary)] transition-colors">
                        {title}
                    </h4>
                </div>
            </motion.div>
        </Link>
    );
}
