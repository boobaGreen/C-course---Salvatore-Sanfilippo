import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Scale } from 'lucide-react';

interface Node {
    id: number;
    val: number;
    left?: Node;
    right?: Node;
}

export default function BSTBalanceSim() {
    const [isBalanced, setIsBalanced] = useState(false);

    const unbalanced: Node = {
        id: 1, val: 10,
        right: {
            id: 2, val: 20,
            right: {
                id: 3, val: 30,
                right: {
                    id: 4, val: 40
                }
            }
        }
    };

    const balanced: Node = {
        id: 1, val: 20,
        left: { id: 2, val: 10 },
        right: {
            id: 3, val: 35,
            left: { id: 4, val: 30 },
            right: { id: 5, val: 40 }
        }
    };

    const currentTree = isBalanced ? balanced : unbalanced;

    const renderNode = (node: Node, x: number, y: number, level: number) => {
        const offset = 80 / Math.pow(1.5, level);
        return (
            <g key={node.id}>
                {node.left && (
                    <motion.line 
                        x1={x} y1={y} x2={x - offset} y2={y + 50} 
                        stroke="#4f46e5" strokeWidth="2" strokeOpacity="0.4"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    />
                )}
                {node.right && (
                    <motion.line 
                        x1={x} y1={y} x2={x + offset} y2={y + 50} 
                        stroke="#4f46e5" strokeWidth="2" strokeOpacity="0.4"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    />
                )}
                <motion.circle 
                    cx={x} cy={y} r="16" className="fill-zinc-900 stroke-indigo-500" strokeWidth="2"
                    layoutId={`node-bg-${node.id}`}
                />
                <motion.text 
                    x={x} y={y} textAnchor="middle" dy=".3em" className="fill-white text-[10px] font-mono font-bold select-none"
                    layoutId={`node-text-${node.id}`}
                >
                    {node.val}
                </motion.text>
                {node.left && renderNode(node.left, x - offset, y + 50, level + 1)}
                {node.right && renderNode(node.right, x + offset, y + 50, level + 1)}
            </g>
        );
    };

    return (
        <div className="glass-panel p-6 rounded-2xl border-white/10 my-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                        <Scale size={22} className={isBalanced ? "" : "rotate-12"} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold dark:text-white">BST Balance Engine</h3>
                        <p className="text-sm text-zinc-500">From O(N) Degeneracy to O(log N) Efficiency</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setIsBalanced(!isBalanced)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${isBalanced ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                    >
                        <Zap size={14} fill={isBalanced ? "white" : "none"} />
                        {isBalanced ? "Balanced (AVL)" : "Unbalanced"}
                    </button>
                </div>
            </div>

            <div className="relative aspect-video bg-zinc-950/50 rounded-xl border border-white/5 flex items-center justify-center py-8">
                <svg width="100%" height="100%" viewBox="0 0 400 240">
                    <AnimatePresence mode="popLayout">
                        {renderNode(currentTree, 200, 30, 1)}
                    </AnimatePresence>
                </svg>

                <div className="absolute top-4 right-4 text-right space-y-1">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">Search Performance</div>
                    <div className={`text-sm font-black font-mono transition-colors ${isBalanced ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isBalanced ? "O(log N)" : "O(N)"}
                    </div>
                </div>
            </div>

            <div className="mt-6 flex gap-4">
                <div className="flex-1 p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                    <p className="text-[11px] text-zinc-500 leading-relaxed italic">
                        {isBalanced 
                            ? "Rotations maintained a maximum height of log2(N). Search is predictable and extremely fast."
                            : "Without rebalancing, the BST 'degenerated' into a Linked List. Every search might visit every node."}
                    </p>
                </div>
            </div>
        </div>
    );
}
