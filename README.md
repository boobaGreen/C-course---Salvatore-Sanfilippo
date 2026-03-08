# Learn C with antirez (Salvatore Sanfilippo)

**An interactive, bilingual (IT/EN) educational platform to master the C programming language, inspired by the YouTube lessons of Salvatore Sanfilippo.**

---

## 📖 Origin of the Project & The Idea

This project was born out of my personal initiative to pay homage to the incredibly high-quality, free educational content made available by **Salvatore Sanfilippo** (known globally in the hacker community as `antirez`, creator of Redis). 

Salvatore published a legendary C programming course on YouTube, sharing not just syntax, but the true "hacker mindset": understanding CPU architecture, memory management, compilation phases, and system-level interactions. I wanted to transform those video lessons into a fully interactive, accessible, and practical learning platform.

This platform bridges the gap between passive video watching and active coding. It provides students with a place to read comprehensive transcriptions, visualize complex memory structures, and execute C code directly in their browsers.

## 🎯 What We Built

We took the raw video lessons and created a structured, 34-lesson bilingual curriculum:
- **Transcriptions & Summaries**: We used localized, offline AI (Whisper) to accurately transcribe hours of technical video lessons, subsequently refined and formatted into markdown (`.mdx`) using LLMs.
- **Bilingual Support**: All textual content, quizzes, and explanations are available in both Italian (IT) and English (EN).
- **Interactive Quizzes & Challenges**: Every lesson features standard quizzes, "Hacker" challenges, and mock terminal challenges to solidify theoretical knowledge.
- **In-Browser C Compilation**: A WebAssembly (WASM) powered C compiler allows users to write and execute code natively without leaving the page.
- **Educational Games & Visualizers**: Custom React components that visually explain complex concepts:
   - *PointerMaze*: A visual game to master pointer dereferencing.
   - *LinkedListSurgeon*: Safe environment to practice relinking nodes in memory.
   - *FormatStringExploit*: A hacking simulator teaching vulnerabilities in `printf`.
   - *Memory/Stack Visualizers & Assembly Explorers*.

## 🛠️ Technology Stack

- **Vite + React (TS)**: Fast, reactive, and strictly-typed frontend framework.
- **TailwindCSS (v4)**: Modern styling for a sleek, dark-themed "hacker" aesthetic.
- **MDX**: For seamlessly mixing markdown text with interactive React components.
- **React Router v7**: For client-side navigation.
- **i18next**: For the IT/EN translation system.
- **Shiki**: For beautiful, accurate syntax highlighting.
- **Framer Motion**: Smooth animations.
- **Local AI & Whisper**: Used to transcribe and translate the original video material offline.

## 👨‍💻 Developer & Authorship

- **Content Inspiration & Original Teacher**: Salvatore Sanfilippo ([antirez](http://invece.org/))
- **Platform Developer & Creator**: [Claudio Dall'Ara](https://claudiodallara.it) ([@boobaGreen](https://github.com/boobaGreen))

> *This platform is entirely free and created as a tribute to the open-source community.*

## 🤝 Contributing & Extending the Course

This project is **Open Source**, and contributions are highly encouraged! Whether you want to fix a typo, add a new interactive game, or create a brand new lesson, your help is welcome.

### Adding New Lessons
Lessons are written in `.mdx` format (Markdown + React components) and localized in `src/content/it/` and `src/content/en/`.
To add a new lesson:
1. Create a new file (e.g., `lesson-32.mdx`) in both language directories.
2. Structure the content using standard Markdown syntax (`##`, `###`, etc.) and embed interactive components.
3. Update `src/data/lessons.ts` to include the new lesson in the course index.

### Adding Quizzes
We follow a "Master Formula" for every lesson: 5 Standard Quizzes, 3 Hacker Quizzes, and 3 Terminal Challenges. You can easily add more by using the `<Quiz>` component in the `.mdx` files:
```tsx
<Quiz 
  title="Quiz Standard" // or "Hacker Challenge"
  questions={[
    {
      question: "Your question here?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 1, // Index of the correct option (0-based)
      explanation: "Why this is the correct answer."
    }
  ]} 
/>
```

### Adding Terminal Challenges
Terminal challenges enforce practical skills by simulating a Linux bash environment:
```tsx
<HackerTerminal 
  challenges={[
    {
      id: "unique-challenge-id",
      title: "Challenge Title",
      description: "What the user needs to do.",
      commands: ["ls -la", "grep foo bar"], // Acceptable commands to pass
      expectedOutput: "Mock output shown to the user",
      hints: ["Try looking at the hidden files"]
    }
  ]}
/>
```

## 📄 License

This project is licensed under the **GNU General Public License (GPL)**. 

The source code, the interactive components, and the structure are provided "as-is" under GPL, ensuring that the knowledge remains free, open, and accessible for everyone to study, modify, and distribute.
