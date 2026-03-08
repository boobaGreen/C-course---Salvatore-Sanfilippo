import { motion } from 'framer-motion';
import { Zap, Timer, BarChart3 } from 'lucide-react';

export default function PerformanceChart() {
    const data = [
        { label: 'Global Diff', value: 100, color: 'bg-zinc-700', time: '416ms' },
        { label: 'Local Block Diff', value: 2, color: 'bg-emerald-500', time: '8ms' },
    ];

    return (
        <div className="glass-panel p-6 rounded-2xl border-white/10 my-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Zap size={22} />
                </div>
                <div>
                    <h3 className="text-xl font-bold dark:text-white">Optimization Impact</h3>
                    <p className="text-sm text-zinc-500">From O(N) to O(1) local updates</p>
                </div>
            </div>

            <div className="space-y-6">
                {data.map((item, i) => (
                    <div key={item.label} className="space-y-2">
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">{item.label}</span>
                            <span className={`text-sm font-bold ${i === 1 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                                {item.time}
                            </span>
                        </div>
                        <div className="h-4 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.value}%` }}
                                transition={{ duration: 1, delay: i * 0.5 }}
                                className={`h-full ${item.color} shadow-[0_0_15px_rgba(16,185,129,0.2)]`}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-zinc-950/50 border border-white/5 flex items-center gap-3">
                    <Timer size={14} className="text-zinc-500" />
                    <div className="text-[10px] text-zinc-500 leading-tight uppercase font-bold tracking-tighter">
                        50x Speedup
                    </div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950/50 border border-white/5 flex items-center gap-3">
                    <BarChart3 size={14} className="text-zinc-500" />
                    <div className="text-[10px] text-zinc-500 leading-tight uppercase font-bold tracking-tighter">
                        CPU Efficiency ++
                    </div>
                </div>
            </div>
            
            <p className="mt-4 text-[10px] text-zinc-600 italic text-center">
                By updating only the modified 8x8 block, we avoid redundant calculations across 49,152 pixels.
            </p>
        </div>
    );
}
