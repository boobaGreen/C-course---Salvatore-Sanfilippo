# Learn C with antirez (Salvatore Sanfilippo)

**An interactive, professional bilingual (IT/EN) platform to master C programming, inspired by the legendary lessons of Salvatore Sanfilippo.**

[![Project Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](file:///c:/Users/ClaudioDall'Ara/Desktop/c/temp_c_course/package.json)
[![License: GPL](https://img.shields.io/badge/License-GPL-yellow.svg)](https://opensource.org/licenses/GPL-3.0)

---

## The Vision: Transmuting Video into Interaction

This platform is a technical tribute to the educational legacy of **Salvatore Sanfilippo** (@antirez), creator of Redis. Salvatore's C course on YouTube is a masterpiece of technical communication, focusing not just on syntax, but on the "low-level soul" of computing: memory layout, CPU registers, and the art of professional C development.

**Learn C** transforms these passive video lectures into an active, immersive experience where code isn't just watched; it's probed, executed, and understood.

---

## Key Features

### Educational Games & Visualizers

We've integrated a suite of custom-built React tools to demystify complex C concepts:

- **[PointerMaze](file:///c:/Users/ClaudioDall'Ara/Desktop/c/temp_c_course/src/components/games/PointerMaze.tsx)**: A maze-based puzzle where survival depends on understanding pointer dereferencing.
- **[LinkedListSurgeon](file:///c:/Users/ClaudioDall'Ara/Desktop/c/temp_c_course/src/components/games/LinkedListSurgeon.tsx)**: An interactive lab for drag-and-drop manipulation of nodes and `next` pointers.
- **[FormatStringExploit](file:///c:/Users/ClaudioDall'Ara/Desktop/c/temp_c_course/src/components/games/FormatStringExploit.tsx)**: A safe environment to learn about `printf` vulnerabilities.
- **[EvoSimulator](file:///c:/Users/ClaudioDall'Ara/Desktop/c/temp_c_course/src/components/content/EvoSimulator.tsx)**: A visualizer for the evolution algorithms and ZX Spectrum graphics discussed in the final lessons.
- **Stack & Heap Visualizers**: Real-time representation of memory allocation and stack frame growth.

### The Master Formula (5 + 3 + 3)

Every lesson is systematically structured for perfect retention:

1. **5 Standard Quizzes**: Covering video content and core syntax.
2. **3 Pro Quizzes**: Deep-dives into edge cases and advanced theory.
3. **3 Pro Terminal Challenges**: Practical terminal tasks requiring research and shell mastery.

### Technical Excellence

- **WASM-Powered Compiler**: Compile and run C code directly in the browser using WebAssembly.
- **Bilingual Core**: Seamless integration of Italian (Original) and English (Translated) content.
- **Modern Tech Stack**: Vite, React 19, TailwindCSS v4, and MDX for a blazingly fast development-to-learning pipeline.
- **Persistence & State**: Centralized `localStorage` management with namespacing (`c_course_`) and automated migration from legacy storage layouts.

---

## ️ Project Structure

```text
src/
├── components/
│   ├── content/    # Visualizers, Infographics, Diagrams
│   ├── exercises/  # Quiz and CodeEditor components
│   ├── games/      # Advanced interactive learning games
│   └── layout/     # UI Shell (Header, Navigation)
├── content/
│   ├── it/         # Lesson MDX files (Italian)
│   └── en/         # Lesson MDX files (English)
├── data/           # Course mapping and lesson metadata
├── hooks/          # Gamification (XP, Progress) & Navigation
└── utils/          # Storage utility, formatters, and helpers
```

---

## ‍ Authorship & Community

- **Original Content & Teaching**: Salvatore Sanfilippo ([antirez](http://invece.org/))
- **Platform Architecture & Development**: [Claudio Dall'Ara](https://claudiodallara.it) ([@boobaGreen](https://github.com/boobaGreen))

## License

This project is licensed under the **GNU General Public License (GPL)**. The knowledge remains open, free, and accessible for everyone to study and distribute.

---

## Changelog
 
### v1.0.3 (2026-03-11)
 
- **Educational Content Completion**: Fully implemented Lesson 02 and 31 Appendices.
- **Advanced Assessment**:
  - Expanded Lesson 31 questions (5+ standard) to meet the quality baseline.
  - Introduced **Pro Challenges** for Appendices 02 and 31 (deep architectural research tasks).
  - Revamped **Pro Terminal Challenges** with realistic shell commands (`tap-tool`, binary analysis).
- **Documentation & Governance**: Updated certification logs, internal task tracking, and bilinguism alignment.
 
### v1.0.2 (2026-03-10)

- **Curriculum Expansion**: Established Lesson 2 as two distinct entries: **Base (C Fundamentals)** and **Appendix (Low-Level Deep Dive)**.
- **Lesson 2 Restoration**: Restored original C programming depth in Lesson 2, including `#include`, `printf`, expressions, and function prototypes.
- **Interactive Simulator Improvements**:
  - Added a clear color legend and logic description to the **Micro-Emulator 6502**.
  - Refactored the **Stack Visualizer** to support multiple didactic scenarios (High-level C vs Low-level Assembly).
- **Educational Deep Dive**: Enriched the Appendix with comprehensive assembly concepts, memory mapping, and the EBP-based calling convention from the professor's transcript.
- **Dedicated Quizzes**: Segmented quizzes and Terminal challenges to be 100% relevant to the specific content of each lesson.

### v1.0.1 (2026-03-10)

- **Enhanced Persistence**: Added automatic saving of reading progress for lessons.
- **Smart Video Resume**: Integrated YouTube IFrame API to automatically resume videos from the last watched position.
- **Technical Polish**: Fixed TypeScript linting errors and optimized state management in the `VideoEmbed` component.

### v1.0.0 (Launch)

- Initial release with bilingual support (IT/EN).
- Integrated WASM compiler for C.
- Interactive memory visualizers and educational games.
