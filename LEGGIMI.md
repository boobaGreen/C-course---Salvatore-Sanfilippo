# Learn C con antirez (Salvatore Sanfilippo)

**Una piattaforma didattica interattiva e professionale (IT/EN) per padroneggiare il linguaggio C, ispirata alle leggendarie lezioni di Salvatore Sanfilippo.**

[![Project Version](https://img.shields.io/badge/versione-1.0.0-blue.svg)](file:///c:/Users/ClaudioDall'Ara/Desktop/c/temp_c_course/package.json)
[![License: GPL](https://img.shields.io/badge/Licenza-GPL-yellow.svg)](https://opensource.org/licenses/GPL-3.0)

---

##  La Visione: Dalla Video-Lezione all'Interazione

Questo progetto è un tributo tecnico all'eredità educativa di **Salvatore Sanfilippo** (@antirez), creatore di Redis. Il corso di C di Salvatore su YouTube è un capolavoro di comunicazione tecnica, focalizzato non solo sulla sintassi, ma sull'"anima low-level" dell'informatica: layout della memoria, registri CPU e l'arte dello sviluppo professionale in C.

**Learn C** trasforma queste lezioni passive in un'esperienza immersiva dove il codice non viene solo guardato, ma analizzato, eseguito e compreso profondamente.

---

##  Funzionalità Chiave

###  Giochi Didattici e Visualizzatori

Abbiamo integrato una suite di strumenti React personalizzati per demistificare i concetti più ostici del C:

- **[PointerMaze](file:///c:/Users/ClaudioDall'Ara/Desktop/c/temp_c_course/src/components/games/PointerMaze.tsx)**: Un puzzle game dove la sopravvivenza dipende dalla comprensione della dereferenziazione dei puntatori.
- **[LinkedListSurgeon](file:///c:/Users/ClaudioDall'Ara/Desktop/c/temp_c_course/src/components/games/LinkedListSurgeon.tsx)**: Un laboratorio interattivo per manipolare nodi e puntatori `next` tramite drag-and-drop.
- **[FormatStringExploit](file:///c:/Users/ClaudioDall'Ara/Desktop/c/temp_c_course/src/components/games/FormatStringExploit.tsx)**: Un ambiente sicuro per imparare le vulnerabilità di `printf`.
- **[EvoSimulator](file:///c:/Users/ClaudioDall'Ara/Desktop/c/temp_c_course/src/components/content/EvoSimulator.tsx)**: Un visualizzatore per gli algoritmi evolutivi e la grafica dello ZX Spectrum.
- **Visualizzatori Stack & Heap**: Rappresentazione in tempo reale dell'allocazione di memoria e della crescita dello stack.

###  La Master Formula (5 + 3 + 3)

Ogni lezione è strutturata sistematicamente per garantire il massimo apprendimento:

1. **5 Quiz Standard**: Coprono il contenuto del video e la sintassi base.
2. **3 Quiz Pro**: Approfondimenti su casi limite e teoria avanzata.
3. **3 Sfide Pro nel Terminale**: Task pratici nel terminale che richiedono ricerca attiva e padronanza della shell.

###  Eccellenza Tecnica

- **Compilatore WASM**: Compila ed esegui codice C direttamente nel browser grazie a WebAssembly.
- **Nucleo Bilingue**: Integrazione fluida tra contenuti originali in Italiano e traduzioni in Inglese.
- **Stack Tecnologico Moderno**: Vite, React 19, TailwindCSS v4 e MDX per un'esperienza fluida e veloce.

---

## ️ Struttura del Progetto

```text
src/
├── components/
│   ├── content/    # Visualizzatori, Infografiche, Diagrammi
│   ├── exercises/  # Componenti Quiz e CodeEditor
│   ├── games/      # Giochi interattivi avanzati
│   └── layout/     # UI Shell (Header, Navigazione)
├── content/
│   ├── it/         # File MDX delle lezioni (Italiano)
│   └── en/         # File MDX delle lezioni (Inglese)
├── data/           # Mapping del corso e metadati lezioni
└── hooks/          # Gamification (XP, Progressi) e Navigazione
```

---

## ‍ Autori e Community

- **Contenuti Originali e Insegnamento**: Salvatore Sanfilippo ([antirez](http://invece.org/))
- **Architettura e Sviluppo Piattaforma**: [Claudio Dall'Ara](https://claudiodallara.it) ([@boobaGreen](https://github.com/boobaGreen))

_Questo progetto è costruito da esperti, per gli esperti._

##  Licenza

Questo progetto è rilasciato sotto licenza **GNU General Public License (GPL)**. La conoscenza deve rimanere aperta, libera e accessibile a tutti per lo studio e la distribuzione.
