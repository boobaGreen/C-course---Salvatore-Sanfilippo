/**
 * Centralized utility for localStorage management.
 * Adds a prefix to avoid collisions and handles data migration.
 */

const PREFIX = 'c_course_';

export const STORAGE_KEYS = {
    LANGUAGE: 'language',
    THEME: 'theme',
    PROGRESSION: 'progression',
    LESSON_SCROLL: (slug: string) => `lesson_scroll_${slug}`,
    QUIZ_STATE: (slug: string, title: string) => `quiz_state_${slug}_${title.replace(/\s+/g, '_').toLowerCase()}`,
    PRO_TERMINAL_STATE: (slug: string) => `ht_state_${slug}`,
    VIDEO_PROGRESS: (videoId: string) => `video_progress_${videoId}`,
};

const storage = {
    /**
     * Get a value from localStorage with prefix.
     */
    get: <T>(key: string): T | null => {
        try {
            const fullKey = key.startsWith(PREFIX) ? key : `${PREFIX}${key}`;
            const item = localStorage.getItem(fullKey);
            if (!item) return null;
            
            // Try to parse as JSON, if it fails return as string
            try {
                return JSON.parse(item) as T;
            } catch {
                return item as unknown as T;
            }
        } catch (e) {
            console.error('Error reading from localStorage', e);
            return null;
        }
    },

    /**
     * Set a value in localStorage with prefix.
     */
    set: <T>(key: string, value: T): void => {
        try {
            const fullKey = key.startsWith(PREFIX) ? key : `${PREFIX}${key}`;
            const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
            localStorage.setItem(fullKey, valueToStore);
        } catch (e) {
            console.error('Error writing to localStorage', e);
        }
    },

    /**
     * Remove an item from localStorage.
     */
    remove: (key: string): void => {
        try {
            const fullKey = key.startsWith(PREFIX) ? key : `${PREFIX}${key}`;
            localStorage.removeItem(fullKey);
        } catch (e) {
            console.error('Error removing from localStorage', e);
        }
    },

    /**
     * Migrate legacy keys to the new prefixed system.
     */
    migrate: () => {
        const migrations: Record<string, string> = {
            'theme': `${PREFIX}${STORAGE_KEYS.THEME}`,
            'language': `${PREFIX}${STORAGE_KEYS.LANGUAGE}`,
            'app_language': `${PREFIX}${STORAGE_KEYS.LANGUAGE}`,
            'cyber-c-progression': `${PREFIX}${STORAGE_KEYS.PROGRESSION}`,
        };

        // Static migrations
        Object.entries(migrations).forEach(([oldKey, newKey]) => {
            const value = localStorage.getItem(oldKey);
            if (value !== null) {
                // If new key doesn't exist yet, migrate
                if (!localStorage.getItem(newKey)) {
                    localStorage.setItem(newKey, value);
                }
                localStorage.removeItem(oldKey);
                console.log(`Migrated ${oldKey} -> ${newKey}`);
            }
        });

        // Dynamic migrations (lesson-scroll, quiz-state, ht-state)
        // We iterate through all keys to find matches
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key) continue;

            let newKey: string | null = null;

            if (key.startsWith('lesson-scroll-')) {
                const slug = key.replace('lesson-scroll-', '');
                newKey = `${PREFIX}${STORAGE_KEYS.LESSON_SCROLL(slug)}`;
            } else if (key.startsWith('quiz-state-')) {
                // quiz-state-slug-title
                const parts = key.replace('quiz-state-', '').split('-');
                const slug = parts[0];
                const title = parts.slice(1).join('-');
                newKey = `${PREFIX}${STORAGE_KEYS.QUIZ_STATE(slug, title)}`;
            } else if (key.startsWith('ht-state-')) {
                const slug = key.replace('ht-state-', '');
                newKey = `${PREFIX}${STORAGE_KEYS.PRO_TERMINAL_STATE(slug)}`;
            }

            if (newKey && !localStorage.getItem(newKey)) {
                const value = localStorage.getItem(key);
                if (value !== null) {
                    localStorage.setItem(newKey, value);
                    // We can't remove while iterating if we strictly follow index, 
                    // but we can list them and remove later or just do it carefully.
                    // To be safe, we'll mark for removal.
                }
            }
        }
    }
};

export default storage;
