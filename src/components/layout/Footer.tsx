import { useTranslation } from 'react-i18next';
import { Github, Linkedin, Globe } from 'lucide-react';

export default function Footer() {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full pt-8 pb-6 border-t border-black/10 dark:border-white/5 mt-auto">
            <div className="max-w-5xl mx-auto flex flex-col items-center justify-center gap-2 text-xs text-slate-500 dark:text-zinc-500 px-8">
                <span className="flex items-center gap-3 justify-center flex-wrap">
                    <span>
                        &copy; {currentYear} {t('footer.developed_by')}{' '}
                        <a href="https://claudiodallara.it" target="_blank" rel="noreferrer" className="text-[var(--color-brand-secondary)] hover:underline font-semibold">
                            {t('footer.dev_name')}
                        </a>
                    </span>
                    <span className="opacity-40 hidden sm:inline" aria-hidden>|</span>
                    <a href="https://github.com/boobaGreen/C-course---Salvatore-Sanfilippo" target="_blank" rel="noreferrer" className="hover:text-[var(--color-brand-secondary)] transition-colors inline-flex items-center gap-1" aria-label="GitHub">
                        <Github size={14} aria-hidden /> GitHub
                    </a>
                    <a href="https://www.linkedin.com/in/claudio-dall-ara-730aa0302/" target="_blank" rel="noreferrer" className="hover:text-[var(--color-brand-secondary)] transition-colors inline-flex items-center gap-1" aria-label="LinkedIn">
                        <Linkedin size={14} aria-hidden /> LinkedIn
                    </a>
                    <a href="https://www.claudiodallara.it/" target="_blank" rel="noreferrer" className="hover:text-[var(--color-brand-secondary)] transition-colors inline-flex items-center gap-1">
                        <Globe size={14} aria-hidden /> Portfolio
                    </a>
                </span>
                <span className="opacity-75">{t('footer.license')} · v{__APP_VERSION__}</span>
            </div>
        </footer>
    );
}
