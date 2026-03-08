# Learn C — Corso Interattivo di antirez

Una piattaforma web dedicata ad accompagnare passo passo gli studenti del corso di programmazione in C tenuto da Salvatore Sanfilippo (antirez) su YouTube.

## 🚀 Funzionalità
- **Bilingue (IT/EN)**: test di base e spiegazioni
- **Layout Interattivi**: esecutore di codice WASM simulato nel browser
- **Giochi ed Esercizi**: impara divertendoti
- **Contenuto**: Trascrizioni Whisper + revisione LLM
- **Sviluppato da**: [Claudio Dall'Ara](https://claudiodallara.it) ([@boobaGreen](https://github.com/boobaGreen))

## 🛠️ Stack Tecnologico
- **Vite + React (TS)**
- **Tailwind CSS v4**
- **MDX**
- **React Router v7**
- **i18next**
- **Shiki**
- **Framer Motion**

## 📦 Setup Sviluppo

```bash
npm install
npm run dev
```

Il progetto utilizza `yt-dlp` e `openai-whisper` tramite Python per generare le trascrizioni base. Vedi `scripts/transcribe.py`.
