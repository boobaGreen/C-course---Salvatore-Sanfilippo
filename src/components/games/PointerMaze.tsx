import { useState } from 'react';
import { motion } from 'framer-motion';

// Componente PointerMaze: un labirinto dove ci si muove "dereferenziando" indirizzi
const PointerMaze = () => {
  // Configurazione del labirinto
  const mazeData = [
    { type: 'start', address: '0x100', value: 'Ptr to 0x104', target: '0x104' },
    { type: 'trap', address: '0x101', value: 'NULL', target: null },
    { type: 'node', address: '0x102', value: 'Ptr to 0x100', target: '0x100' },
    { type: 'trap', address: '0x103', value: 'Segmentation Fault', target: null },
    
    { type: 'node', address: '0x104', value: 'Ptr to 0x107', target: '0x107' },
    { type: 'trap', address: '0x105', value: 'Garbage Data', target: null },
    { type: 'node', address: '0x106', value: 'Ptr to 0x10C', target: '0x10C' },
    { type: 'node', address: '0x107', value: 'Ptr to 0x10E', target: '0x10E' },
    
    { type: 'trap', address: '0x108', value: 'NULL', target: null },
    { type: 'node', address: '0x109', value: 'Ptr to 0x102', target: '0x102' },
    { type: 'trap', address: '0x10A', value: 'Garbage Data', target: null },
    { type: 'node', address: '0x10B', value: 'Ptr to 0x105', target: '0x105' },
    
    { type: 'node', address: '0x10C', value: 'Ptr to 0x10F', target: '0x10F' },
    { type: 'trap', address: '0x10D', value: 'Segmentation Fault', target: null },
    { type: 'node', address: '0x10E', value: 'Ptr to 0x10C', target: '0x10C' },
    { type: 'exit', address: '0x10F', value: '**EXIT**', target: 'win' }
  ];

  const [currentAddress, setCurrentAddress] = useState('0x100');
  const [history, setHistory] = useState(['0x100']);
  const [gameState, setGameState] = useState('playing'); // playing, won, lost
  const [message, setMessage] = useState('Inizia il percorso dereferenziando il primo puntatore.');

  const handleDereference = (target: string | null) => {
    if (gameState !== 'playing') return;

    if (!target) {
      setGameState('lost');
      setMessage('Oops! Hai dereferenziato un puntatore invalido (SegFault) o NULL.');
      return;
    }

    if (target === 'win') {
      setGameState('won');
      setMessage('Complimenti! Hai trovato l\'uscita seguendo la catena corretta di puntatori!');
      setCurrentAddress('0x10F');
      setHistory([...history, '0x10F']);
      return;
    }

    // Effettua la mossa
    setCurrentAddress(target);
    setHistory([...history, target]);
    
    // Trova nodo
    const node = mazeData.find(n => n.address === target);
    if (node && node.type === 'trap') {
        setGameState('lost');
        setMessage(`Hai dereferenziato memoria non valida all'indirizzo ${target}!`);
    } else if (node) {
        setMessage(`Dereferenziato con successo: il puntatore all'indirizzo ${target} punta a ${node.target}`);
    }
  };

  const resetGame = () => {
    setCurrentAddress('0x100');
    setHistory(['0x100']);
    setGameState('playing');
    setMessage('Inizia il percorso dereferenziando il primo puntatore.');
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden my-8 font-mono shadow-xl">
      <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-100 flex items-center">
          <span className="text-emerald-400 mr-2">{"*"}</span>
          Pointer Maze
        </h3>
        <div className="text-sm text-gray-400">
          <span className="text-gray-500 mr-2">Status:</span>
          {gameState === 'playing' ? <span className="text-blue-400">Navigating...</span> : 
           gameState === 'won' ? <span className="text-emerald-400 font-bold">SUCCESS</span> : 
           <span className="text-red-400 font-bold">SEGFAULT</span>}
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-gray-300 text-sm">{message}</p>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {mazeData.map((node) => {
            const isCurrent = currentAddress === node.address;
            const isVisited = history.includes(node.address);
            
            let bgClass = "bg-gray-800 border-gray-700";
            if (isCurrent) bgClass = "bg-blue-900/50 border-blue-500";
            else if (isVisited && node.type === 'exit') bgClass = "bg-emerald-900/50 border-emerald-500";
            else if (isVisited && node.type === 'trap') bgClass = "bg-red-900/50 border-red-500";
            else if (isVisited) bgClass = "bg-gray-800 border-emerald-500/50";
            else if (node.type === 'exit') bgClass = "bg-emerald-900/20 border-emerald-800/50";

            return (
              <motion.div
                key={node.address}
                className={`p-3 rounded-lg border flex flex-col items-center justify-center text-center relative transition-colors duration-300 ${bgClass}`}
                whileHover={gameState === 'playing' && isCurrent ? { scale: 1.05 } : {}}
              >
                {isCurrent && (
                  <motion.div 
                    layoutId="pointerHighlight"
                    className="absolute inset-0 border-2 border-blue-400 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <div className="text-xs text-gray-500 mb-1 absolute top-2 left-2">{node.address}</div>
                
                <div className="mt-4 mb-2">
                  <span className={`text-sm font-bold ${isVisited ? 'text-gray-200' : 'text-gray-600'}`}>
                    {node.value}
                  </span>
                </div>

                {isCurrent && gameState === 'playing' && (
                  <button
                    onClick={() => handleDereference(node.target)}
                    className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition-colors z-10"
                  >
                    *(deref)
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">
            <span className="text-emerald-500 mr-2">{"->"}</span>
            <strong>Path:</strong> {history.join(' -> ')}
          </div>
          
          {(gameState === 'won' || gameState === 'lost') && (
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
            >
              Reset Pointer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PointerMaze;
