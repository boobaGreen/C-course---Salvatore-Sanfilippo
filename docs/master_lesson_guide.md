#  The Master Formula: C Course Lesson Guide

This document defines the "Gold Standard" for creating new lessons for the Salvatore Sanfilippo C Course. Follow these rules strictly to ensure consistency, high engagement, and educational excellence.

---

##  Source Materials & Locations

Before starting a lesson, always reference these files:
- **Transcription**: `/home/clod/Desktop/c/transcriptions/raw/lesson-XX.txt` (The source of truth).
- **Metadata**: `/home/clod/Desktop/c/src/data/lessons.ts` (Register slug, videoId, and title).
- **I18n Content**:
  - `/home/clod/Desktop/c/src/content/it/lesson-XX.mdx`
  - `/home/clod/Desktop/c/src/content/en/lesson-XX.mdx`

---

## ️ Lesson Structure (The Scaletta)

Every lesson must follow this exact order:

1.  **Header**: `# Lezione XX: [Titolo]`
2.  **Hero Intro**: A brief, engaging hook (max 2-3 lines).
3.  **Video Embed**: `<VideoEmbed videoId="..." title="..." />`
4.  **Key Concepts (Top)**: `<KeyConcepts concepts={[...]} />` highlighting the 3 most important pillars.
5.  **Simulators & Interactivity (PRIORITY #1)**:
    - **Visual First**: Before explaining in text, show it in action.
    - **Interactive Simulators**: Create dedicated React components (e.g., `PointerBasics`) using Framer Motion.
    - **WASM Simulators**: For complex C logic (like `GameOfLife`), use WASM-based simulators to show real execution.
    - **Gamification**: If possible, transform a concept into a mini-level or a "discovery game" (e.g., "Find the memory leak").
6.  **Infographics & Diagrams**:
    - Use `<Infographic />` or `Mermaid` diagrams to represent data structures, memory layout, and flowcharts.
    - **No generic tables**: Use styled, interactive tables with hover effects.
7.  **Detailed Explanation**: Break down the transcript concepts using:
    - `### Subheaders` for clarity.
    - `**Bold**` for terminology.
    - `<Callout type="info|warning|pro">` for sidebars.
8.  **Code Editor**: `<CodeEditor initialCode="..." language="c" />` with a meaningful, runnable example from the lesson.
10. **Standard Quiz**: `<Quiz questions={[...]} />` (**exactly 5 questions**) to verify basics.
11. **Pro Challenge**: `<Quiz title="Pro Challenge" questions={[...]} />` (**exactly 3 questions**).
12. **Terminal Challenges**: `<ProTerminal />` (**exactly 3 tasks**) focused on Linux tools (`gdb`, `hexdump`, `time`, `valgrind`).

---

##  Visual Style & Aesthetics

### "WOW" Factor Rules:
- **Glassmorphism**: Use the `.glass-panel` CSS class for components.
- **Micro-animations**: Use `framer-motion` for transitions, hover states, and data changes.
- **Lucide Icons**: Use them for every header, action button, and list item.
- **Dynamic Design**: Every interactive element must react to hover/click.
- **Vibrant Palettes**:
  - **Green/Emerald**: Standards, variables, success.
  - **Blue/Sky**: Pointers, addresses, networking.
  - **Purple/Violet**: Advanced logic, casting, WASM.
  - **Amber/Red**: Warnings, memory errors, segmentation faults.

---

##  Content Philosophy

1.  **Zero Omission Policy**: Represent *every single* concepts from the transcript. If Salvatore says it, the user must read/see it.
2.  **Interactive-First**: If a concept can be a game, a simulator, or an infographic, text is the *secondary* choice.
3.  **Mentalità da Esperto**: Always explain *why* something happens in memory. Don't just say "it works this way," say "the pointer moves 4 bytes because the CPU expects an integer."
4.  **Bilingual Synchronicity**: IT and EN versions must be identical in terms of components and structure.

---

## ️ Components Cheat Sheet

| Component | Usage |
| :--- | :--- |
| `VideoEmbed` | Top of page. |
| `Callout` | Use `type="pro"` for deep technical dives. |
| `KeyConcepts` | Summary boxes for quick scanning. |
| `CodeEditor` | Interactive C snippets. |
| `Quiz` | Use for both standard and pro-level questions. |
| `ProTerminal` | Linux shell simulations with XP rewards. |
| `Custom Simulator` | React components (e.g. `PointerBasics`) - **Always the centerpiece.** |

---

##  Final Checklist before "Complete"

- [ ] Is the videoId correct in `lessons.ts`?
- [ ] Does `npm run build` pass?
- [ ] Are all transcript concepts covered?
- [ ] Does the UI "WOW" the user?
- [ ] Is there at least one complex "Advanced Terminal" challenge?
- [ ] Are the English and Italian paths correctly created?
