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
          <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-10 font-semibold w-full text-left">Physical Memory (RAM)</h4>
          
          <div className="flex flex-col items-center relative w-full mb-8">
            
            {/* The Pointer Label that dynamically spans the active bytes */}
            <div className="w-full flex justify-start mb-2 relative h-10">
               <motion.div 
                className="absolute flex flex-col items-center justify-center top-0"
                initial={false}
                animate={{ 
                  x: 0, 
                  width: `${(selectedData.bytesUsed / 4) * 100}%` 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="bg-blue-500/20 border border-blue-500/50 text-blue-300 text-xs font-mono py-1 px-3 rounded-full font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)] whitespace-nowrap">
                  *({pointerType}) ptr
                </div>
                <ArrowDown className="text-blue-500 w-4 h-4 mt-1" />
              </motion.div>
            </div>

            <div className="flex gap-2 w-full justify-start relative">
              {/* Memory Blocks */}
              {memoryBytes.map((byte, idx) => {
                const isActive = idx < selectedData.bytesUsed;
                
                let byteRole = "";
                // If we are reading more than 1 byte, label MSB/LSB
                if (isActive && selectedData.bytesUsed > 1) {
                  if (endianness === 'little') {
                     if (idx === 0) byteRole = "LSB (First)";
                     if (idx === selectedData.bytesUsed - 1) byteRole = "MSB (Last)";
                  } else {
                     if (idx === 0) byteRole = "MSB (First)";
                     if (idx === selectedData.bytesUsed - 1) byteRole = "LSB (Last)";
                  }
                }

                return (
                  <div key={idx} className="flex flex-col items-center flex-1">
                    <motion.div 
                      className={`w-full max-w-[80px] h-20 rounded-lg border-2 flex items-center justify-center font-mono text-xl font-bold transition-colors ${
                        isActive 
                          ? 'bg-blue-500/20 border-blue-400 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                          : 'bg-white/5 border-white/10 text-gray-500'
                      }`}
                      animate={isActive ? { scale: [1, 1.05, 1], y: [0, -2, 0] } : { scale: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {byte.toString(16).padStart(2, '0').toUpperCase()}
                    </motion.div>
                    
                    {/* Address Label */}
                    <div className="text-[11px] text-gray-500 mt-3 font-mono bg-black/50 px-2 py-0.5 rounded border border-white/5">
                      0x400{idx}
                    </div>
                    
                    {/* Role Label (MSB/LSB) */}
                    <div className="h-6 mt-1 flex items-center">
                      {byteRole && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            byteRole.includes('MSB') ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {byteRole}
                        </motion.div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full bg-black/60 border border-white/10 rounded-xl p-5 flex items-center justify-between shadow-inner">
            <div className="text-sm font-semibold text-gray-400 flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              Resulting Value:
            </div>
            <div className="text-right">
              <div className="text-3xl font-mono font-bold text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)] tracking-wider">
                {selectedData.hex.toUpperCase()}
              </div>
              <div className="text-sm font-mono text-gray-500 mt-1">
                Decimal: <span className="text-gray-300">{selectedData.dec}</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      <div className="mt-6 bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl flex gap-3 text-sm text-blue-200 leading-relaxed">
        <Info className="w-6 h-6 shrink-0 text-blue-400 mt-0.5" />
        <p>
          The physical memory contains the literal byte sequence <code>44 33 22 11</code> at addresses <code>0x4000</code> to <code>0x4003</code>.
          <br /><br />
          Notice how casting the pointer changes <strong>how many bytes are read</strong> (1 for <code>char*</code>, 2 for <code>short*</code>, 4 for <code>int*</code>), 
          and how the selected <strong>Architecture (Endianness)</strong> dictates the final assembled number. In Little Endian, the <em>Least Significant Byte (LSB)</em> is stored at the lowest address.
        </p>
      </div>
    </div>
  );
};

export default MemoryCaster;
