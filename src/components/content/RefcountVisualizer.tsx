import { motion } from 'framer-motion';
import { UserCheck, ArrowRight } from 'lucide-react';

interface RefcountVisualizerProps {
    title?: string;
    data: {
        object: string;
        refCount: number;
        owners: string[];
    };
}

export default function RefcountVisualizer({ title, data }: RefcountVisualizerProps) {
    return (
        <div className="glass-panel p-6 rounded-2xl border-white/10 my-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                    <UserCheck size={22} />
                </div>
                <div>
                    <h3 className="text-xl font-bold dark:text-white">{title || "Reference Counting Visualizer"}</h3>
                    <p className="text-sm text-zinc-500">Ownership and lifecycle tracing</p>
                </div>
            </div>

            <div className="relative flex flex-col md:flex-row items-center justify-around gap-12 py-8 bg-zinc-950/50 rounded-xl border border-white/5">
                {/* Owners Column */}
                <div className="flex flex-col gap-4">
                    {data.owners.map((owner, i) => (
                        <motion.div
                            key={owner}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="px-4 py-2 rounded-lg bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300 flex items-center gap-2 shadow-lg"
                        >
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            {owner}
                        </motion.div>
                    ))}
                </div>

                {/* Connection arrows (abstracted) */}
                <div className="hidden md:block">
                    <motion.div
                        animate={{ x: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <ArrowRight className="text-orange-500/50" size={32} />
                    </motion.div>
                </div>

                {/* Central Object */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative w-48 h-48 rounded-2xl bg-zinc-900 border border-orange-500/30 flex flex-col items-center justify-center gap-2 shadow-2xl p-4 text-center">
                        <span className="text-xs font-mono text-orange-400 uppercase tracking-widest border-b border-orange-500/20 pb-1 mb-2">Memory Object</span>
                        <span className="text-lg font-bold text-white mb-2">{data.object}</span>
                        <div className="flex flex-col items-center py-2 px-6 rounded-xl bg-orange-500/10 border border-orange-500/20">
                            <span className="text-[10px] text-orange-300 uppercase font-bold">Ref Count</span>
                            <span className="text-3xl font-black text-orange-500 font-mono">{data.refCount}</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                <p className="text-xs text-zinc-400 leading-relaxed italic text-center">
                    "Memory is only freed when the counter drops to **zero**. Each owner adds +1 to the lifecycle."
                </p>
            </div>
        </div>
    );
}
