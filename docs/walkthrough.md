# Walkthrough — Piattaforma Didattica C

## Fase 1: Planning Completato ✅

### 1.1 Estrazione Catalogo Corso

Estratti programmaticamente **35 video** dalla [playlist YouTube](https://www.youtube.com/playlist?list=PLrEMgOSrS_3cFJpM2gdw8EGFyRBZOyAKY) di Salvatore Sanfilippo (antirez) tramite browser automation:
- **31 lezioni** principali (da L1: Introduzione al C a L31: ZX Spectrum parte 2)
- **4 extra**: 1 appendice (vita variabili locali) + 3 episodi speciali
- **~17 ore 30 minuti** di contenuto totale
- **Dark Mode 2024**: Zinc-950 background, neon emerald/sky accents, glassmorphism panels.
- **Serverless Progression**: React Context + `localStorage`.
- **Mermaid.js Integrations**: Reactive diagrams with dynamic resizing.
- **SPA Routing Fix**: Added `vercel.json` to handle 404s on browser refresh for clean URLs.
- **Micro-interactions**: Framer Motion for smooth state transitions.
- **Terminal Simulations**: Interactive terminal blocks with mock compilation and real assembly outputs.
- **Author Bio Modal**: Animated modal with Salvatore Sanfilippo's history and Redis connection.
- **Custom Favicon**: SVG 'C_' logo matching the brand identity.
- **Bilingual Support**: Fully localized in IT/EN via `react-i18next`.

## Visual Progress

````carousel
![TypeMatcher Randomization](file:///home/clod/.gemini/antigravity/brain/4832e64b-d22d-4ffe-9f82-3cc235ac6c3b/verify_typematcher_randomization_1772919097550.webp)
<!-- slide -->
![Progression System](file:///home/clod/.gemini/antigravity/brain/4832e64b-d22d-4ffe-9f82-3cc235ac6c3b/lesson_01_top_1772918861965.png)
<!-- slide -->
![TypeMatcher XP](file:///home/clod/.gemini/antigravity/brain/4832e64b-d22d-4ffe-9f82-3cc235ac6c3b/lesson_01_middle_1_1772918442985.png)
<!-- slide -->
![Localization Fix](file:///home/clod/.gemini/antigravity/brain/4832e64b-d22d-4ffe-9f82-3cc235ac6c3b/lesson_01_top_1772918435623.png)
````

## Technical Implementation

### Terminal Simulations
The `TerminalSimulation` component was refactored to handle multiline assembly outputs using React children and a `Shiki` highlighter fallback.

### Git Infrastructure
The project is now a Git repository pushed to [boobaGreen/C-course---Salvatore-Sanfilippo](https://github.com/boobaGreen/C-course---Salvatore-Sanfilippo).

![Estrazione playlist YouTube](/home/clod/Desktop/c/docs/playlist_extraction.webp)

### 1.2 Decisioni Tecniche Finalizzate

Dopo analisi delle opzioni e discussione con l'utente:

| Decisione | Scelta | Alternativa scartata | Perché |
|-----------|--------|---------------------|--------|
| **Framework** | Vite + React | Next.js | L'utente lo conosce già; più semplice e veloce |
| **Esecuzione C** | Emscripten (C→WASM) nel browser | Wandbox/Judge0 API | Funziona offline; API esterne possono chiudere |
| **Eccezioni WASM** | Output pre-calcolato | — | Per system calls (L19, L20, L26) non emulabili |
| **Trascrizione** | Whisper `small` su GPU | `medium`/`large` (troppo VRAM) | 2 GB VRAM, compatibile con GTX 1650 (4 GB) |
| **Approccio** | MVP con Lezione 1 | Tutto insieme | Iterare sulla L1 finché soddisfatti, poi scalare |

### 1.3 Sistema Hardware Verificato

| Componente | Spec | Impatto |
|-----------|------|---------|
| **GPU** | NVIDIA GTX 1650, 4 GB VRAM, CUDA 13.0 | Whisper `small` (~2 GB) ✅ — `medium` (~5 GB) ❌ |
| **CPU** | Intel i7-3770, 4c/8t @ 3.40GHz | Fallback per Whisper `medium` su CPU |
| **RAM** | 32 GB | Ampia per qualsiasi operazione |
| **Disco** | 794 GB liberi | Spazio abbondante per audio + trascrizioni |

### 1.4 Revisione Documentazione

Dopo la prima stesura, eseguita revisione completa della documentazione. Trovati e corretti **8 problemi**:

1. ✅ Numerazione playlist vs lezioni non allineata → aggiunta colonna "Pos. Playlist"
2. ✅ Mancavano link YouTube cliccabili per ogni video → aggiunti tutti i 35 link
3. ✅ Nessuna scelta specifica compilatore WASM → ricercato e scelto **Emscripten** (standard industriale)
4. ✅ Pipeline adattamento troppo generica → aggiunti comandi `yt-dlp` e script Whisper dettagliati
5. ✅ Mancava la specifica dell'LLM per adattamento → indicato Claude/GPT con prompt specializzati
6. ✅ Immagine walkthrough puntava a path brain → copiata nella dir progetto
7. ✅ Mancava mappa progressione concetti → aggiunto diagramma Mermaid con tutte le dipendenze
8. ✅ Mancavano durate per sezione → aggiunte subtotali lezioni principali e contenuti extra

### 1.5 Documentazione Prodotta

Tutti i documenti nella cartella del progetto `/home/clod/Desktop/c/docs/`:

| File | Contenuto | Dimensione |
|------|-----------|-----------|
| [implementation_plan.md](file:///home/clod/Desktop/c/docs/implementation_plan.md) | Piano completo con 12 sezioni: catalogo, decisioni, architettura, pipeline, multimedia, esercizi/giochi, difficoltà, UX, roadmap, futuri, fonti, verifiche | ~600 righe |
| [task.md](file:///home/clod/Desktop/c/docs/task.md) | Checklist del progetto con 5 fasi + miglioramenti futuri | ~50 righe |
| [walkthrough.md](file:///home/clod/Desktop/c/docs/walkthrough.md) | Questo documento | ~70 righe |
| [playlist_extraction.webp](file:///home/clod/Desktop/c/docs/playlist_extraction.webp) | Registrazione video dell'estrazione playlist | — |

---

## Prossimi Passi

**Fase 2: MVP Lezione 1** — Setup progetto Vite + React, trascrizione Lezione 1 con Whisper, creazione contenuti e componenti interattivi. L'obiettivo è avere una lezione completa funzionante (testo IT/EN, video embed, diagrammi, esercizi, gioco TypeMatcher, editor C con WASM) come proof-of-concept.
