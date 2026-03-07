import { motion } from 'framer-motion';
import { HelpCircle, ArrowRight, ArrowDownRight } from 'lucide-react';

export default function BranchingFlowchart() {
    return (
        <div className="glass-panel p-8 rounded-3xl border-white/10 my-10 overflow-hidden relative group">
            <div className="flex flex-col items-center gap-8 relative z-10">
                {/* Condition Node */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="relative"
                >
                    <div className="bg-blue-500/20 border-2 border-blue-400/50 p-6 rounded-2xl flex flex-col items-center gap-2 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                        <HelpCircle className="text-blue-400" size={24} />
                        <span className="font-mono text-sm font-bold text-blue-100">if (x {'>'} 10)</span>
                    </div>
                </motion.div>

                <div className="flex justify-between w-full max-w-md gap-4 relative">
                    {/* Path True */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex-1 flex flex-col items-center gap-4"
                    >
                        <div className="flex flex-col items-center">
                            <ArrowDownRight className="text-green-400 rotate-45 mb-2" size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-green-400 mb-2">Vero</span>
                        </div>
                        <div className="bg-green-500/10 border border-green-400/30 p-4 rounded-xl w-full text-center group-hover:border-green-400/50 transition-colors">
                            <span className="text-xs font-mono text-green-300">printf("Maggiore!");</span>
                        </div>
                    </motion.div>

                    {/* Path False */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex-1 flex flex-col items-center gap-4"
                    >
                        <div className="flex flex-col items-center">
                            <ArrowDownRight className="text-red-400 -rotate-45 scale-x-[-1] mb-2" size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-2">Falso</span>
                        </div>
                        <div className="bg-red-500/10 border border-red-400/30 p-4 rounded-xl w-full text-center group-hover:border-red-400/50 transition-colors">
                            <span className="text-xs font-mono text-red-300">printf("Minore!");</span>
                        </div>
                    </motion.div>
                </div>

                {/* Merge Node */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col items-center gap-2"
                >
                    <ArrowRight className="text-zinc-500 rotate-90" size={24} />
                    <div className="bg-zinc-800/50 border border-zinc-700/50 p-4 rounded-xl backdrop-blur-sm">
                        <span className="text-xs font-mono text-zinc-400">return 0;</span>
                    </div>
                </motion.div>
            </div>

            {/* Background elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px]" />
        </div>
    );
}
