import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, AlertTriangle, ArrowRight, ArrowDown } from 'lucide-react';

const MemoryCaster = () => {
  const [endianness, setEndianness] = useState<'little' | 'big'>('little');
  const [pointerType, setPointerType] = useState<'char*' | 'short*' | 'int*'>('int*');
  
  // A 4-byte memory sequence representing 0x11223344 in Big Endian, 
  // or 0x44332211 in Little Endian if read as an int.
  // We'll define the physical memory bytes as [0x44, 0x33, 0x22, 0x11]
  const memoryBytes = [0x44, 0x33, 0x22, 0x11];
  
  const getValueByPointer = () => {
    // If we pretend the machine is big endian, the layout of the SAME logical number 0x44332211 
    // would be stored differently.
    // Let's instead keep the PHYSICAL memory constant: [0x44, 0x33, 0x22, 0x11]
    // And see how different architectures interpret it.
    
    switch (pointerType) {
      case 'char*':    
        return { 
          hex: `0x${memoryBytes[0].toString(16).padStart(2, '0')}`, 
          dec: memoryBytes[0], 
          bytesUsed: 1 
        };
      case 'short*':   
        const shortVal = endianness === 'little' 
          ? (memoryBytes[1] << 8) | memoryBytes[0]   // 0x3344
          : (memoryBytes[0] << 8) | memoryBytes[1];  // 0x4433
        return { 
          hex: `0x${shortVal.toString(16).padStart(4, '0')}`, 
          dec: shortVal, 
          bytesUsed: 2 
        };
      case 'int*':     
        const intVal = endianness === 'little'
          ? (memoryBytes[3] << 24) | (memoryBytes[2] << 16) | (memoryBytes[1] << 8) | memoryBytes[0] // 0x11223344
          : (memoryBytes[0] << 24) | (memoryBytes[1] << 16) | (memoryBytes[2] << 8) | memoryBytes[3]; // 0x44332211
        return { 
          hex: `0x${intVal.toString(16).padStart(8, '0')}`, 
          dec: intVal, 
          bytesUsed: 4 
        };
    }
  };

  const selectedData = getValueByPointer();

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 my-8">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="text-amber-400 w-6 h-6" />
        <h3 className="text-xl font-bold text-white m-0">Pointer Casting & Endianness</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Col: Controls */}
        <div className="space-y-6">
          <div className="bg-black/30 p-4 rounded-xl border border-white/5">
            <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3 font-semibold">1. Select Architecture</h4>
            <div className="flex gap-2">
              <button 
                onClick={() => setEndianness('little')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${endianness === 'little' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'}`}
              >
                Little Endian (x86)
              </button>
              <button 
                onClick={() => setEndianness('big')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${endianness === 'big' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'}`}
              >
                Big Endian (Network)
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Determines how multi-byte numbers are assembled from individual bytes.
            </p>
          </div>

          <div className="bg-black/30 p-4 rounded-xl border border-white/5">
            <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3 font-semibold">2. Cast Pointer As</h4>
            <div className="flex gap-2">
              {(['char*', 'short*', 'int*'] as const).map(type => (
                <button 
                  key={type}
                  onClick={() => setPointerType(type)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium font-mono transition-colors ${pointerType === type ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'}`}
                >
                  {type}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Tells the CPU how many bytes to read and how to format them.
            </p>
          </div>
        </div>

        {/* Right Col: Memory Visualization */}
        <div className="flex flex-col items-center justify-center bg-black/40 p-6 rounded-xl border border-white/5 relative overflow-hidden">
          <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-6 font-semibold w-full text-left">Physical Memory (RAM)</h4>
          
          <div className="flex gap-2 mb-8 relative">
            {/* Pointer Indicator */}
            <motion.div 
              className="absolute -top-8 left-0 flex flex-col items-center z-10"
              initial={false}
              animate={{ 
                x: 0, // Always starts reading at index 0 for this demo
                width: `${selectedData.bytesUsed * 100}%` 
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="bg-blue-500 text-white text-xs font-mono py-1 px-2 rounded font-bold shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                *ptr
              </div>
              <ArrowDown className="text-blue-500 w-4 h-4 mt-1" />
            </motion.div>

            {/* Memory Blocks */}
            {memoryBytes.map((byte, idx) => {
              const isActive = idx < selectedData.bytesUsed;
              
              // Formatting the byte index for display based on endianness visualization
              // If Little Endian, the lowest address (idx 0) holds the Least Significant Byte
              let byteRole = "";
              if (isActive && pointerType !== 'char*') {
                if (endianness === 'little') {
                   byteRole = idx === 0 ? "LSB" : (idx === selectedData.bytesUsed - 1 ? "MSB" : "");
                } else {
                   byteRole = idx === 0 ? "MSB" : (idx === selectedData.bytesUsed - 1 ? "LSB" : "");
                }
              }

              return (
                <div key={idx} className="flex flex-col items-center">
                  <motion.div 
                    className={`w-14 h-16 rounded-lg border-2 flex items-center justify-center font-mono text-lg font-bold transition-colors ${
                      isActive 
                        ? 'bg-blue-500/20 border-blue-400 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                        : 'bg-white/5 border-white/10 text-gray-500'
                    }`}
                    animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {byte.toString(16).padStart(2, '0').toUpperCase()}
                  </motion.div>
                  <div className="text-[10px] text-gray-500 mt-2 font-mono">0x100{idx}</div>
                  {byteRole && (
                     <div className="text-[10px] font-bold text-amber-400 mt-1">{byteRole}</div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="w-full bg-black/50 border border-white/10 rounded-lg p-4 flex items-center justify-between">
            <div className="text-sm text-gray-400">Interpreted Value:</div>
            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-emerald-400">
                {selectedData.hex.toUpperCase()}
              </div>
              <div className="text-sm font-mono text-gray-500">
                Decimal: {selectedData.dec}
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      <div className="mt-6 bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl flex gap-3 text-sm text-blue-200">
        <Info className="w-5 h-5 shrink-0 text-blue-400" />
        <p>
          The physical memory contains <code>44 33 22 11</code>. Notice how casting the pointer to <code>short*</code> or <code>int*</code> changes how many bytes are read, AND how the <strong>Endianness</strong> architecture dictates the final assembled number (LSB first vs MSB first).
        </p>
      </div>
    </div>
  );
};

export default MemoryCaster;
