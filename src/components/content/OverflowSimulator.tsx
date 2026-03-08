import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Plus, Info, Binary } from 'lucide-react';

export default function OverflowSimulator() {
    const [unsignedVal, setUnsignedVal] = useState(254);
    const [signedVal, setSignedVal] = useState(126);
    const [isGlitching, setIsGlitching] = useState(false);

    const handleUnsignedInc = () => {
        setUnsignedVal(prev => (prev + 1) % 256);
    };

    const handleSignedInc = () => {
        if (signedVal === 127) {
            setIsGlitching(true);
            setSignedVal(-128); // Standard wrap for most hardware, but UB in theory
            setTimeout(() => setIsGlitching(false), 500);
        } else {
            setSignedVal(prev => prev + 1);
        }
    };

    // Helper to get bits
    const getBits = (val: number) => {
        // Handle negative numbers for bit representation
        const unsigned = val < 0 ? (val + 256) : val;
        return unsigned.toString(2).padStart(8, '0').split('');
    };

    return (
        <div className="glass-panel p-6 rounded-2xl border-white/10 my-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                    <Binary size={22} />
                </div>
                <div>
                    <h3 className="text-xl font-bold dark:text-white">Integer Overflow Simulator</h3>
                    <p className="text-sm text-zinc-500">Comparing Signed vs Unsigned (8-bit)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Unsigned Byte */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2 text-blue-400 font-bold uppercase text-[10px] tracking-widest">
                             <Shield size={12} /> unsigned char
                         </div>
                         <span className="text-[10px] text-zinc-600 font-mono">0 to 255</span>
                    </div>

                    <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col items-center gap-4 group">
                        <div className="flex gap-1">
                            {getBits(unsignedVal).map((bit, i) => (
                                <motion.div 
                                    key={`u-${i}-${bit}`}
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1, backgroundColor: bit === '1' ? 'rgba(59, 130, 246, 0.4)' : 'transparent' }}
                                    className={`w-6 h-8 border border-blue-500/20 rounded flex items-center justify-center text-[10px] font-mono ${bit === '1' ? 'text-blue-200' : 'text-zinc-600'}`}
                                >
                                    {bit}
                                </motion.div>
                            ))}
                        </div>
                        <div className="text-5xl font-black text-blue-500 tracking-tighter">
                            {unsignedVal}
                        </div>
                        <button 
                            onClick={handleUnsignedInc}
                            className="w-full py-3 rounded-xl bg-blue-500 text-white font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 active:scale-95"
                        >
                            <Plus size={18} /> Increment
                        </button>
                    </div>
                    <p className="text-xs text-zinc-500 italic">
                        Overflow is <span className="text-blue-400 font-bold">defined</span>: it will always wrap to 0.
                    </p>
                </div>

                {/* Signed Byte */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2 text-orange-400 font-bold uppercase text-[10px] tracking-widest">
                             <AlertTriangle size={12} /> signed char
                         </div>
                         <span className="text-[10px] text-zinc-600 font-mono">-128 to 127</span>
                    </div>

                    <div className={`p-6 bg-zinc-950 border ${isGlitching ? 'border-red-500 animate-pulse' : 'border-zinc-800'} rounded-xl flex flex-col items-center gap-4`}>
                        <div className="flex gap-1">
                            {getBits(signedVal).map((bit, i) => (
                                <motion.div 
                                    key={`s-${i}-${bit}`}
                                    animate={{ 
                                        scale: isGlitching ? [1, 1.2, 1] : 1,
                                        backgroundColor: bit === '1' ? 'rgba(251, 146, 60, 0.4)' : 'transparent',
                                        x: isGlitching ? [0, 2, -2, 0] : 0
                                    }}
                                    className={`w-6 h-8 border border-orange-500/20 rounded flex items-center justify-center text-[10px] font-mono ${bit === '1' ? 'text-orange-200' : 'text-zinc-600'}`}
                                >
                                    {bit}
                                </motion.div>
                            ))}
                        </div>
                        <div className={`text-5xl font-black ${isGlitching ? 'text-red-500 skew-x-12' : 'text-orange-500'} tracking-tighter transition-all`}>
                            {signedVal}
                        </div>
                        <button 
                            onClick={handleSignedInc}
                            className={`w-full py-3 rounded-xl ${isGlitching ? 'bg-red-500' : 'bg-orange-500'} text-white font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-orange-500/20 active:scale-95`}
                        >
                            <Plus size={18} /> Increment
                        </button>
                    </div>
                    <p className="text-xs text-zinc-500 italic">
                        Overflow is <span className="text-red-400 font-bold uppercase">Undefined Behavior</span>: any result is possible theoretically.
                    </p>
                </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 flex gap-3">
                <Info className="text-orange-500 shrink-0" size={20} />
                <p className="text-sm text-zinc-500 leading-relaxed">
                    <strong>Didactic Gold:</strong> In C, <code>signed</code> overflow is technically not defined by the standard. While most hardware just wraps around, compilers are allowed to optimize based on the assumption that overflow <span className="italic">never</span> happens, which can lead to logic-defying bugs.
                </p>
            </div>
        </div>
    );
}
