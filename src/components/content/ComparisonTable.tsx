import { motion } from 'framer-motion';

interface ComparisonTableProps {
    headers: string[];
    rows: string[][];
    title?: string;
}

export default function ComparisonTable({ headers, rows, title }: ComparisonTableProps) {
    return (
        <div className="my-8 overflow-hidden rounded-2xl border border-white/10 glass-panel shadow-2xl">
            {title && (
                <div className="bg-white/5 px-6 py-3 border-b border-white/10">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-[#10b981]">{title}</h4>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                            {headers.map((header, i) => (
                                <th key={i} className="px-6 py-4 font-bold text-white uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {rows.map((row, i) => (
                            <motion.tr
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="hover:bg-white/[0.02] transition-colors"
                            >
                                {row.map((cell, j) => (
                                    <td key={j} className="px-6 py-4 text-zinc-400 align-top leading-relaxed">
                                        <span dangerouslySetInnerHTML={{ __html: cell }} />
                                    </td>
                                ))}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
