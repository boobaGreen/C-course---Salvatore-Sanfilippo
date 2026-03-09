import { useState } from "react";
import {
  ShieldAlert,
  Cpu,
  CheckCircle2,
  XCircle,
  Send,
  ChevronRight,
  ChevronLeft,
  Terminal as TerminalIcon,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgression } from "../../hooks/useProgression";
import { useTranslation } from "react-i18next";

interface Challenge {
  id: string;
  title: string;
  description: string;
  commands: string[]; // Still used to show context or previous commands
  expectedOutput: string;
  expectedCommand?: string; // New: If present, user must guess the command
  simulatedSuccessOutput?: string; // Optional realistic output on success
  hints?: string[];
  explanation?: string;
  xpReward?: number;
}

interface HackerTerminalProps {
  challenges: Challenge[];
}

export default function HackerTerminal({ challenges }: HackerTerminalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(
    {},
  );
  const [isCorrect, setIsCorrect] = useState<Record<string, boolean | null>>(
    {},
  );
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { addXP, revealSolution, revealedSolutions } = useProgression();
  const { t } = useTranslation();

  const currentChallenge = challenges[currentStep];
  const isCommandMode = !!currentChallenge.expectedCommand;
  const activityId = `hacker-terminal-${currentChallenge.id}`;
  const isRevealed = revealedSolutions?.includes(activityId) || false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (completedTasks[currentChallenge.id]) return;

    const normalizedInput = inputValue.trim().replace(/\s+/g, " ");

    let correct = false;
    if (isCommandMode && currentChallenge.expectedCommand) {
      // Rimuoviamo gli apici (singoli e doppi) e normalizziamo gli spazi
      const expected = currentChallenge.expectedCommand
        .replace(/['"]/g, "")
        .trim()
        .replace(/\s+/g, " ");
      const inputCleaned = normalizedInput.replace(/['"]/g, "");
      correct =
        inputCleaned === expected ||
        inputCleaned === expected.replace(/^sudo\s+/, "");
    } else {
      const expected = currentChallenge.expectedOutput.trim();
      correct = normalizedInput === expected;
    }

    setIsCorrect((prev) => ({ ...prev, [currentChallenge.id]: correct }));

    if (correct) {
      setCompletedTasks((prev) => ({ ...prev, [currentChallenge.id]: true }));
      addXP(
        currentChallenge.xpReward || 150,
        activityId,
      );
    }
  };

  const handleRetry = () => {
    setIsCorrect((prev) => ({ ...prev, [currentChallenge.id]: null }));
    setInputValue("");
  };

  const handleReveal = () => {
    setShowConfirmModal(true);
  };

  const confirmReveal = () => {
    setShowConfirmModal(false);
    revealSolution(activityId);
    const answer = isCommandMode ? (currentChallenge.expectedCommand || "") : currentChallenge.expectedOutput;
    setInputValue(answer.replace(/^sudo\s+/, ""));
    setIsCorrect((prev) => ({ ...prev, [currentChallenge.id]: null }));
  };

  return (
    <>
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 text-red-500 mb-4">
                <ShieldAlert size={24} />
                <h4 className="font-bold text-lg">Mostra Soluzione</h4>
              </div>
              <p className="text-zinc-300 text-sm mb-6 leading-relaxed">
                Visualizzare la soluzione annullerà la ricompensa in XP per questa sfida. Vuoi procedere?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={confirmReveal}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <Eye size={16} /> Rivela (0 XP)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="my-10 glass-panel rounded-2xl border-white/10 overflow-hidden shadow-2xl shadow-black/40">
      {/* Header */}
      <div className="bg-zinc-900/80 px-3 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-2 border-b border-white/5">
        <div className="flex items-center gap-3 text-red-400">
          <ShieldAlert size={20} className="animate-pulse" />
          <span className="font-black text-xs uppercase tracking-[0.2em]">
            Hacker Terminal Challenge
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 mr-2">
            {challenges.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentStep
                    ? "bg-red-500 scale-125"
                    : completedTasks[challenges[idx].id]
                      ? "bg-green-500/50"
                      : "bg-white/10"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-1.5 border-l border-white/10 pl-4">
            <button
              disabled={currentStep === 0}
              onClick={() => {
                setCurrentStep((s) => s - 1);
                setInputValue("");
              }}
              className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              disabled={currentStep === challenges.length - 1}
              onClick={() => {
                setCurrentStep((s) => s + 1);
                setInputValue("");
              }}
              className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 bg-[#0c0c0e]">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wider border border-red-500/20 whitespace-nowrap shrink-0">
              Task {currentStep + 1} of {challenges.length}
            </span>
            {completedTasks[currentChallenge.id] && (
              <span className="flex items-center gap-1 text-green-500 text-[10px] font-bold uppercase tracking-wider">
                <CheckCircle2 size={12} /> Complete
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <TerminalIcon
              size={20}
              className="text-[var(--color-brand-primary)]"
            />
            {currentChallenge.title}
          </h3>
          <p className="text-zinc-400 text-base leading-relaxed mb-6">
            {currentChallenge.description}
          </p>

          <div className="space-y-3">
            {currentChallenge.commands?.map((cmd, idx) => (
              <div
                key={idx}
                className="bg-black/40 rounded-xl p-4 border border-white/5 flex items-center justify-between group"
              >
                <code className="text-[var(--color-brand-primary)] font-mono text-sm">
                  <span className="opacity-50 mr-2">$</span>
                  {cmd}
                </code>
                <Cpu
                  size={16}
                  className="text-zinc-600 group-hover:text-[var(--color-brand-primary)] transition-colors"
                />
              </div>
            ))}

            {isCommandMode && currentChallenge.expectedOutput && (
              <div className="bg-black/40 rounded-xl p-4 border border-white/5 flex flex-col gap-2 group">
                <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2">
                  Contesto / Indizio:
                </div>
                <code className="text-zinc-300 font-mono text-sm whitespace-pre-wrap">
                  {currentChallenge.expectedOutput}
                </code>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative mt-8">
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">
            {isCommandMode ? "Type the command:" : "Predict System Output:"}
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            {isCommandMode && (
              <div className="flex items-center justify-center px-4 bg-black border border-white/10 border-r-0 rounded-l-xl text-zinc-500 font-mono text-sm mt-[1px] mb-[1px] -mr-3 z-10">
                $
              </div>
            )}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={completedTasks[currentChallenge.id]}
              placeholder={
                isCommandMode
                  ? "eg. ls -la /var/log"
                  : "Type the expected output..."
              }
              className={`flex-1 bg-black border ${
                isCorrect[currentChallenge.id] === true
                  ? "border-green-500/50"
                  : isCorrect[currentChallenge.id] === false
                    ? "border-red-500/50"
                    : "border-white/10"
              } rounded-xl px-4 py-3 font-mono text-sm text-zinc-200 focus:outline-none focus:border-[var(--color-brand-secondary)] transition-all placeholder:text-zinc-700`}
            />
            {!completedTasks[currentChallenge.id] ? (
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="w-full sm:w-auto px-6 py-3 sm:py-0 bg-[var(--color-brand-primary)] text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
              >
                <Send size={18} />
                {t("common.submit", "Submit")}
              </button>
            ) : (
              <div className="w-full sm:w-auto px-6 py-3 sm:py-0 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl font-bold flex items-center justify-center gap-2">
                <CheckCircle2 size={18} /> SUCCESS
              </div>
            )}
          </div>
        </form>

        <AnimatePresence>
          {isCorrect[currentChallenge.id] !== undefined &&
            isCorrect[currentChallenge.id] !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-8 p-6 rounded-2xl border ${isCorrect[currentChallenge.id] ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"}`}
              >
                <div className="flex items-start gap-4">
                  {isCorrect[currentChallenge.id] ? (
                    <CheckCircle2
                      className="text-green-500 mt-1 shrink-0"
                      size={24}
                    />
                  ) : (
                    <XCircle className="text-red-500 mt-1 shrink-0" size={24} />
                  )}
                  <div className="flex-1">
                    <h4
                      className={`text-lg font-bold mb-2 ${isCorrect[currentChallenge.id] ? "text-green-400" : "text-red-400"}`}
                    >
                      {isCorrect[currentChallenge.id]
                        ? "Access Granted!"
                        : "Access Denied"}
                    </h4>
                    <div className="text-zinc-400 text-sm leading-relaxed space-y-4">
                      {isCorrect[currentChallenge.id] ? (
                        <div className="space-y-4">
                          <p>{currentChallenge.explanation}</p>

                          {/* Nuovo blocco: Mostra l'output simulato in caso di successo */}
                          {isCommandMode &&
                            (currentChallenge.simulatedSuccessOutput ||
                              currentChallenge.expectedOutput) && (
                              <div className="bg-black/60 rounded-xl p-4 border border-green-500/20 font-mono text-sm shadow-inner mt-4">
                                <div className="text-[10px] text-green-500/70 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                  <TerminalIcon size={12} />
                                  Simulated Output
                                </div>
                                <div className="text-zinc-300 whitespace-pre-wrap">
                                  {currentChallenge.simulatedSuccessOutput ||
                                    currentChallenge.expectedOutput}
                                </div>
                              </div>
                            )}
                        </div>
                      ) : (
                        <div>
                          <p>
                            L'output o il comando inserito non corrisponde.
                            Controlla la sintassi e riprova.
                          </p>
                          <div className="flex flex-wrap gap-2 mt-4">
                            <button
                              onClick={handleRetry}
                              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
                            >
                              Try Again
                            </button>

                            {!showHint[currentChallenge.id] && currentChallenge.hints && (
                              <button
                                onClick={() =>
                                  setShowHint((prev) => ({
                                    ...prev,
                                    [currentChallenge.id]: true,
                                  }))
                                }
                                className="px-4 py-2 bg-[var(--color-brand-secondary)]/10 border border-[var(--color-brand-secondary)]/20 rounded-lg text-[var(--color-brand-secondary)] text-xs font-bold uppercase tracking-wider hover:bg-[var(--color-brand-secondary)]/20 transition-all"
                              >
                                Mostra Aiuto
                              </button>
                            )}

                            {(showHint[currentChallenge.id] || !currentChallenge.hints) && !isRevealed && (
                              <button
                                onClick={handleReveal}
                                className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs font-bold uppercase tracking-wider hover:bg-red-500/20 transition-all flex items-center gap-2"
                              >
                                <Eye size={14} /> Mostra Soluzione (0 XP)
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {!isCorrect[currentChallenge.id] &&
                        showHint[currentChallenge.id] &&
                        currentChallenge.hints && (
                          <div className="space-y-2 mt-4">
                            {currentChallenge.hints.map((h, i) => (
                              <div
                                key={i}
                                className="p-3 bg-white/5 rounded-lg border border-white/5 italic text-[var(--color-brand-secondary)]"
                              >
                                <span className="text-zinc-500 not-italic mr-2">
                                  Hint {i + 1}:
                                </span>
                                {h}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Terminal Footer Info */}
      <div className="bg-black/20 px-6 py-3 flex items-center justify-between border-t border-white/5">
        <div className="text-[10px] font-mono text-zinc-600 uppercase">
          Kernel: 5.15.0-hacker-edition
        </div>
        <div className="text-[10px] font-mono text-zinc-600 uppercase">
          XP Reward: {currentChallenge.xpReward || 150} pts
        </div>
      </div>
    </div>
    </>
  );
}
