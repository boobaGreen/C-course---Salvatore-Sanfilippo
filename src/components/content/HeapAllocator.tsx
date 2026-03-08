import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Plus, Trash2, AlertTriangle, Bug } from 'lucide-react';

interface MemoryBlock {
  id: string;
  size: number;
  offset: number;
  status: 'allocated' | 'freed' | 'leaked';
  label: string;
}

const HeapAllocator = () => {
  const [blocks, setBlocks] = useState<MemoryBlock[]>([]);
  const [totalMemory] = useState(64); // Abstract memory units
  const [nextOffset, setNextOffset] = useState(0);

  const allocateMemory = (size: number, label: string) => {
    if (nextOffset + size > totalMemory) {
      alert("Out of Memory! The heap is full.");
      return;
    }

    const newBlock: MemoryBlock = {
      id: Math.random().toString(36).substr(2, 9),
      size,
      offset: nextOffset,
      status: 'allocated',
      label
    };

    setBlocks(prev => [...prev, newBlock]);
    setNextOffset(nextOffset + size);
  };

  const freeMemory = (id: string) => {
    setBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, status: 'freed' } : block
    ));
  };

  const simulateMemoryLeak = () => {
    // A block gets "lost" (pointer is overwritten), we mark it visually as leaked
    const activeBlocks = blocks.filter(b => b.status === 'allocated');
    if (activeBlocks.length > 0) {
      const blockToLeak = activeBlocks[0];
      setBlocks(prev => prev.map(block => 
        block.id === blockToLeak.id ? { ...block, status: 'leaked' } : block
      ));
    } else {
      alert("Allocate some memory first to leak it!");
    }
  };

  const resetHeap = () => {
    setBlocks([]);
    setNextOffset(0);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 my-8">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="text-purple-400 w-6 h-6" />
        <h3 className="text-xl font-bold text-white m-0">Heap Memory Allocator</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-black/30 p-5 rounded-xl border border-white/5 shadow-inner">
            <h4 className="text-sm tracking-wider text-gray-400 mb-4 font-bold flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              1. Allocate (malloc)
            </h4>
            
            <div className="space-y-3">
               <button 
                onClick={() => allocateMemory(4, "int")}
                className="w-full text-left px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 rounded-lg transition-colors font-mono text-sm"
              >
                malloc(sizeof(int)) <span className="float-right opacity-50">+4 bytes</span>
              </button>
              
              <button 
                onClick={() => allocateMemory(16, "char[16]")}
                className="w-full text-left px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 rounded-lg transition-colors font-mono text-sm"
              >
                malloc(16 * sizeof(char)) <span className="float-right opacity-50">+16 bytes</span>
              </button>

              <button 
                onClick={() => allocateMemory(24, "struct")}
                className="w-full text-left px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 rounded-lg transition-colors font-mono text-sm"
              >
                malloc(sizeof(User)) <span className="float-right opacity-50">+24 bytes</span>
              </button>
            </div>
          </div>

          <div className="bg-red-900/10 p-5 rounded-xl border border-red-500/10">
            <h4 className="text-sm tracking-wider text-red-300 mb-4 font-bold flex items-center gap-2">
              <Bug className="w-4 h-4" />
              2. Mess it up
            </h4>
            <button 
              onClick={simulateMemoryLeak}
              className="w-full py-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 border border-red-500/30 rounded-lg transition-colors font-bold text-sm"
            >
              Lose a Pointer (Leak Memory)
            </button>
            <p className="text-[10px] text-red-400/70 mt-2 text-center">
              Overwrites the pointer, making it impossible to pass it to <code>free()</code>.
            </p>
          </div>
          
          <button 
            onClick={resetHeap}
            className="w-full py-2 mt-4 bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10 rounded-lg transition-colors text-sm"
          >
            Reset OS Process
          </button>
        </div>

        {/* Visualization Column */}
        <div className="lg:col-span-2 bg-black/40 rounded-xl border border-white/5 p-6 relative overflow-hidden flex flex-col">
          <h4 className="text-sm tracking-wider text-gray-400 mb-4 font-bold">The Heap (64 bytes available)</h4>
          
          <div className="relative w-full flex-grow bg-black/60 rounded-xl border border-gray-800 p-2 flex flex-col gap-2 min-h-[300px]">
            {/* The continuous memory strip abstract representation */}
            <div className="absolute inset-0 opacity-10" style={{ 
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)', 
              backgroundSize: '20px 20px' 
            }} />
            
            <AnimatePresence>
              {blocks.map((block) => {
                const heightPercentage = (block.size / totalMemory) * 100;
                
                let bgClass = "bg-blue-500/20 border-blue-400/50 text-blue-200";
                if (block.status === 'freed') bgClass = "bg-green-500/10 border-green-500/20 text-green-500/40 border-dashed";
                if (block.status === 'leaked') bgClass = "bg-red-500/30 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] text-red-100";

                return (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, x: -50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`relative w-full rounded-md border-2 p-3 flex justify-between items-center transition-all ${bgClass}`}
                    style={{ minHeight: `${Math.max(40, heightPercentage * 3)}px` }}
                  >
                    <div className="flex flex-col z-10">
                      <span className="font-mono font-bold text-sm">{block.label}</span>
                      <span className="font-mono text-[10px] opacity-70">{block.size} bytes (0x{block.offset.toString(16).padStart(4, '0')})</span>
                    </div>

                    <div className="flex items-center gap-3 z-10">
                      {block.status === 'leaked' && (
                        <span className="text-xs font-bold uppercase tracking-widest text-red-300 bg-red-900/50 px-2 py-1 rounded">Mem Leak!</span>
                      )}
                      {block.status === 'freed' && (
                        <span className="text-xs font-bold uppercase tracking-widest text-green-500/50">Available</span>
                      )}
                      
                      {block.status === 'allocated' && (
                        <button 
                          onClick={() => freeMemory(block.id)}
                          className="bg-black/50 hover:bg-black/80 p-2 rounded-lg text-gray-300 hover:text-white transition-colors border border-white/10"
                          title="free()"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {blocks.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-mono text-sm">
                [ Heap is completely empty ]
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-purple-900/20 border border-purple-500/30 p-4 rounded-xl flex gap-3 text-sm text-purple-200">
        <Info className="w-5 h-5 shrink-0 text-purple-400" />
        <p>
          Unlike the <strong>Stack</strong> (which is organized automatically as functions are called), the <strong>Heap</strong> gives you total control.
          You use <code>malloc</code> to reserve chunks, and you MUST call <code>free</code> when you are done. If you lose the pointer before calling free, that memory is <strong>leaked</strong> and cannot be reclaimed until the program dies.
        </p>
      </div>
    </div>
  );
};

export default HeapAllocator;
