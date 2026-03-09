import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type SurgeryTask = {
  id: string;
  name: string;
  description: string;
  initialNodes: { id: string; label: string; next: string | null; bg: string }[];
  targetNode?: { id: string; label: string; bg: string };
  validate: (nodes: { id: string; label: string; next: string | null; bg: string }[]) => boolean;
  successMessage: string;
};

const LinkedListSurgeon = () => {
  const [activeTask, setActiveTask] = useState<number>(0);
  
  const tasks: SurgeryTask[] = [
    {
      id: "insert-tail",
      name: "Missione: Inserimento in Coda",
      description: "Esiste una lista [A] -> [B]. Inserisci il nuovo nodo [C] in coda alla lista, facendo in modo che [B] punti a [C], e [C] punti a NULL.",
      initialNodes: [
        { id: "A", label: "Valore: 10", next: "B", bg: "bg-blue-600" },
        { id: "B", label: "Valore: 20", next: null, bg: "bg-blue-600" },
        { id: "C", label: "Valore: 30\n(Nuovo Nodo)", next: null, bg: "bg-emerald-600" }
      ],
      validate: (nodes: any[]) => {
        const a = nodes.find(n => n.id === "A");
        const b = nodes.find(n => n.id === "B");
        const c = nodes.find(n => n.id === "C");
        return a?.next === "B" && b?.next === "C" && c?.next === null;
      },
      successMessage: "Ottimo! Hai allacciato correttamente la coda."
    },
    {
      id: "insert-middle",
      name: "Missione: Inserimento in Mezzo",
      description: "Inserisci [C] (valore 15) tra [A] (valore 10) e [B] (valore 20). Ordina: A -> C -> B.",
      initialNodes: [
        { id: "A", label: "Valore: 10", next: "B", bg: "bg-blue-600" },
        { id: "B", label: "Valore: 20", next: null, bg: "bg-blue-600" },
        { id: "C", label: "Valore: 15\n(Nuovo Nodo)", next: null, bg: "bg-emerald-600" }
      ],
      validate: (nodes: any[]) => {
        const a = nodes.find(n => n.id === "A");
        const c = nodes.find(n => n.id === "C");
        return a?.next === "C" && c?.next === "B";
      },
      successMessage: "Perfetto! Hai eseguito il re-linking chirurgico senza rompere la catena."
    },
    {
      id: "delete-middle",
      name: "Missione: Eliminazione Nodo",
      description: "Rimuovi il nodo [B] dalla lista A -> B -> C bypassandolo. Fai in modo che [A] punti direttamente a [C].",
      initialNodes: [
        { id: "A", label: "Valore: 1", next: "B", bg: "bg-blue-600" },
        { id: "B", label: "Valore: 99\n(Buggy!)", next: "C", bg: "bg-red-600" },
        { id: "C", label: "Valore: 2", next: null, bg: "bg-blue-600" }
      ],
      validate: (nodes: any[]) => {
        const a = nodes.find(n => n.id === "A");
        return a?.next === "C";
      },
      successMessage: "Bypass riuscito! [B] è ora irraggiungibile (pronto per la free())."
    }
  ];

  const currentTask = tasks[activeTask];
  const [nodes, setNodes] = useState(currentTask.initialNodes);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset nodes when task changes
  // eslint-disable-next-line
  useState(() => {
    setNodes(tasks[activeTask].initialNodes);
    setIsSuccess(false);
    setSelectedNode(null);
  });

  const loadTask = (index: number) => {
    setActiveTask(index);
    setNodes(tasks[index].initialNodes);
    setIsSuccess(false);
    setSelectedNode(null);
  };

  const handleNodeClick = (id: string | null) => {
    if (isSuccess) return;

    if (selectedNode === null) {
      if (id !== null) {
        setSelectedNode(id);
      }
    } else {
      // Create a link from selectedNode to id
      // Or if id is null, set selectedNode's next to null
      setNodes(prev => {
        const newNodes = prev.map(n => 
          n.id === selectedNode ? { ...n, next: id } : n
        );
        
        // Check success right after updating state
        if (currentTask.validate(newNodes)) {
          setIsSuccess(true);
        }
        
        return newNodes;
      });
      setSelectedNode(null);
    }
  };

  const resetTask = () => {
    setNodes(currentTask.initialNodes);
    setIsSuccess(false);
    setSelectedNode(null);
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden my-8 shadow-xl">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-100 flex items-center">
          <span className="text-emerald-400 mr-2">{"->"}</span>
          Linked List Surgeon
        </h3>
        <div className="flex gap-2">
          {tasks.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => loadTask(idx)}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                activeTask === idx ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Task {idx + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Task Info */}
        <div className="mb-8">
          <h4 className="text-lg font-bold text-indigo-400 mb-2">{currentTask.name}</h4>
          <p className="text-gray-300 text-sm">{currentTask.description}</p>
        </div>

        {/* Control Desk */}
        <div className="bg-gray-800 border-2 border-dashed border-gray-600 p-6 rounded-xl relative min-h-[250px] flex flex-wrap gap-8 items-center justify-center">
          {nodes.map(node => (
            <div key={node.id} className="relative flex items-center">
              {/* Node Box */}
              <div 
                className={`w-32 rounded-lg border-2 shadow-lg transition-transform ${
                  selectedNode === node.id ? 'border-yellow-400 scale-105 z-10' : 'border-gray-500 hover:border-gray-400 cursor-pointer'
                }`}
                onClick={() => handleNodeClick(node.id)}
              >
                <div className={`${node.bg} px-3 py-1 border-b-2 border-gray-900 flex justify-between rounded-t-lg`}>
                  <span className="font-bold font-mono text-white text-sm">Node {node.id}</span>
                </div>
                <div className="bg-gray-700 p-3 h-20 flex items-center justify-center text-center">
                  <span className="text-sm font-mono text-gray-200 whitespace-pre-line">{node.label}</span>
                </div>
                <div 
                  className="bg-gray-800 p-2 rounded-b-lg border-t-2 border-gray-600 flex justify-between items-center group cursor-crosshair"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node.id);
                  }}
                >
                  <span className="text-xs text-gray-400">next:</span>
                  <span className={`text-xs font-mono font-bold px-2 py-1 rounded bg-gray-900 border ${
                    node.next ? 'text-indigo-400 border-indigo-900' : 'text-gray-500 border-gray-700'
                  }`}>
                    {node.next ? `-> [${node.next}]` : 'NULL'}
                  </span>
                </div>
              </div>

              {/* Arrow Visualizer */}
              {node.next && (
                <div className="hidden md:flex ml-4 items-center">
                   <div className="w-8 h-1 bg-indigo-500"></div>
                   <div className="w-0 h-0 border-t-4 border-t-transparent border-l-8 border-l-indigo-500 border-b-4 border-b-transparent"></div>
                </div>
              )}
            </div>
          ))}

          {/* NULL Target */}
          <div 
            className={`w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
              selectedNode ? 'border-yellow-500 bg-yellow-900/20 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'border-gray-600 bg-gray-800'
            }`}
            onClick={() => handleNodeClick(null)}
          >
            <span className={`font-mono font-bold ${selectedNode ? 'text-yellow-500' : 'text-gray-500'}`}>NULL</span>
          </div>
        </div>

        {/* Instructions / Feedback */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-900/30 border border-emerald-500 p-4 rounded-lg flex items-center"
              >
                <div className="text-emerald-400 text-2xl mr-4"></div>
                <div>
                  <h4 className="font-bold text-emerald-400">Missione Completata!</h4>
                  <p className="text-emerald-200 text-sm mt-1">{currentTask.successMessage}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="instructions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-blue-900/20 border border-blue-800 p-4 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <p className="text-blue-200 text-sm">
                    {selectedNode 
                      ? `Seleziona il nodo a cui Node [${selectedNode}] deve puntare, oppure clicca NULL.` 
                      : 'Clicca sull\'area "next" di un nodo per staccare il puntatore e collegarlo altrove.'}
                  </p>
                  <button 
                    onClick={resetTask}
                    className="px-3 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-xs text-gray-300 transition-colors"
                  >
                    Reset Nodi
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LinkedListSurgeon;

