import { useTranslation } from 'react-i18next';
import { Github, Linkedin } from 'lucide-react';

export default function Footer() {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full pt-8 pb-6 border-t border-black/10 dark:border-white/5 z-10 mt-auto bg-transparent">
            <div className="max-w-5xl mx-auto flex flex-col items-center justify-center gap-2 text-xs text-slate-400 dark:text-zinc-500 px-8">
                <span className="flex items-center gap-2 justify-center flex-wrap">
                    &copy; {currentYear} {t('footer.developed_by')}{' '}
                    <a
                        href="https://claudiodallara.it"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[var(--color-brand-secondary)] hover:underline font-semibold"
                    >
                        {t('footer.dev_name')}
                    </a>
                    <span className="opacity-50 hidden sm:inline">|</span>
                    <a href="https://github.com/boobaGreen" target="_blank" rel="noreferrer" className="hover:text-[var(--color-brand-secondary)] transition-colors">
                        <Github size={14} />
                    </a>
                    <a href="https://www.linkedin.com/in/claudio-dall-ara-730aa0302/" target="_blank" rel="noreferrer" className="hover:text-[var(--color-brand-secondary)] transition-colors">
                        <Linkedin size={14} />
                    </a>
                </span>
                <span className="opacity-75">{t('footer.license')}</span>
            </div>
        </footer>
    );
}
