# Progetto: Piattaforma Didattica C — Corso di Salvatore Sanfilippo

## Fase 1: Planning e Documentazione ✅
- [x] Estrazione playlist YouTube (35 video, ~17.5h)
- [x] Analisi struttura del corso (31 lezioni + 1 appendice + 3 speciali)
- [x] Piano di implementazione dettagliato (12 sezioni, ~600 righe)
- [x] Decisioni tecniche finalizzate e confermate:
  - [x] **Vite + React** (NO Next.js — l'utente lo usa già)
  - [x] **Emscripten (C→WASM)** per esecuzione C nel browser (NO fallback API)
  - [x] **Output pre-calcolato** per system calls (L19, L20, L26)
  - [x] **Whisper `small` su GPU** (GTX 1650, 4 GB VRAM, CUDA 13.0)
  - [x] **Approccio MVP:** Lezione 1 prima, poi le altre dopo approvazione
- [x] Walkthrough fase planning
- [x] Revisione e correzione documentazione (8 problemi trovati e corretti)
- [x] Revisione utente ✅ (07/03/2026)

## Fase 2: MVP — Lezione 1 🎯
- [x] Setup progetto (Vite + React + TypeScript)
- [x] Installazione dipendenze (React Router, i18next, Shiki, Framer Motion, MDX, Mermaid, Lucide)
- [x] Design system CSS (tokens, tipografia, dark/light mode)
- [x] Restyling UX/UI avanzato (glassmorphism, neon accents, dark mode 2024 trends)
- [x] Custom favicon SVG
- [x] Layout (Header, Sidebar, Footer, LessonNav)
- [x] Modal popup info sull'Autore (Salvatore Sanfilippo / antirez)
- [x] i18n setup (react-i18next, it.json, en.json)
- [x] Trascrizione Lezione 1 (Whisper small su GPU) - *In Progress*
- [x] Adattamento testo IT + traduzione EN
- [x] Componenti contenuto (CodeBlock, Diagram, KeyConcepts, VideoEmbed)
- [x] Pagina Lezione 1 completa (MDX IT + EN)
- [x] Esercizi Lezione 1 (quiz, completa codice, predici output)
- [x] Simulazioni Terminale interattive (x86 Assembly, bash, output dinamico)
- [x] Compilatore C WASM integrato (CodeEditor con pre-emulazione visuale)
- [x] Quiz e Giochi Lezione 1 (TypeMatcher, Quiz personalizzato)
- [x] Infografiche e diagrammi per Lezione 1
- [x] Polish, animazioni, responsive testing

## Fase 3: Iterazione MVP
- [ ] Revisione qualità con utente
- [ ] Correzioni e miglioramenti
- [ ] Approvazione per scaling

## Fase 4: Tutte le Lezioni (dopo MVP approvato)
- [ ] Batch trascrizione tutti i video (~3-4h GPU)
- [ ] Adattamento testo per le restanti 34 lezioni
- [ ] Contenuti multimediali per ogni lezione
- [ ] Esercizi e giochi per ogni lezione (riutilizzando componenti)

## Fase 5: Deploy
- [ ] Build production (`npm run build` → /dist)
- [x] Fix 404 NOT_FOUND su refresh Vercel (vercel.json)
- [x] Supporto multilingua completo (Header, Sidebar, Contenuti)
- [x] Sistema di Progressione "Cyber-C Master" (XP, Livelli, Gradi)
- [x] Persistenza locale (localStorage) per tracking serverlesstà alta
- [ ] Dark/Light/System theme (prefers-color-scheme) — priorità alta
- [ ] Ricerca full-text (FlexSearch/Fuse.js) — priorità media
- [ ] Deploy su hosting (GitHub Pages / Netlify / Vercel)

## Miglioramenti Futuri (parcheggiati)
- [x] Più giochi didattici per argomenti avanzati — priorità media
- [x] Randomizzazione esercizi e giochi (TypeMatcher)
- [ ] Whisper upgrade (medium CPU / API cloud) se small non basta
- [ ] Fallback API (Wandbox/Judge0) se WASM non basta
- [ ] PWA offline (service worker)
- [ ] Modalità test/esame con punteggio
- [ ] Code playground avanzato (multi-file, debugger)
- [ ] Certificato completamento (jsPDF)
- [ ] Community/commenti (richiede backend)
