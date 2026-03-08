import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';

interface BSTNode {
    value: number;
    left?: BSTNode;
    right?: BSTNode;
}

interface BSTVisualizerProps {
    title?: string;
    data: BSTNode;
}

const TreeNode = ({ node, x, y, level }: { node: BSTNode; x: number; y: number; level: number }) => {
    const offset = 100 / Math.pow(2, level);
    
    return (
        <g>
            {node.left && (
                <motion.line
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    x1={x} y1={y} x2={x - offset} y2={y + 60}
                    stroke="currentColor" strokeWidth="2" className="text-indigo-500/30"
                />
            )}
            {node.right && (
                <motion.line
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    x1={x} y1={y} x2={x + offset} y2={y + 60}
                    stroke="currentColor" strokeWidth="2" className="text-indigo-500/30"
                />
            )}
            
            <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: level * 0.1 }}
            >
                <circle cx={x} cy={y} r="18" className="fill-zinc-900 stroke-indigo-500" strokeWidth="2" />
                <text x={x} y={y} textAnchor="middle" dy=".3em" className="fill-white text-[10px] font-mono font-bold">
                    {node.value}
                </text>
            </motion.g>

            {node.left && <TreeNode node={node.left} x={x - offset} y={y + 60} level={level + 1} />}
            {node.right && <TreeNode node={node.right} x={x + offset} y={y + 60} level={level + 1} />}
        </g>
    );
};

export default function BSTVisualizer({ title, data }: BSTVisualizerProps) {
    return (
        <div className="glass-panel p-6 rounded-2xl border-white/10 my-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <Share2 size={22} />
                </div>
                <div>
                    <h3 className="text-xl font-bold dark:text-white">{title || "BST Visualizer"}</h3>
                    <p className="text-sm text-zinc-500">Recursive structure visualization</p>
                </div>
            </div>

            <div className="bg-zinc-950/50 rounded-xl border border-white/5 overflow-hidden flex justify-center p-4">
                <svg viewBox="0 0 400 240" className="w-full max-w-md h-auto">
                    <TreeNode node={data} x={200} y={30} level={1} />
                </svg>
            </div>
        </div>
    );
}
