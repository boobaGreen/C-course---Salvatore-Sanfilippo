import { useState } from 'react';
import { Palette, Info } from 'lucide-react';

const COLORS = [
  { name: 'Black', hex: '#000000', code: 0 },
  { name: 'Blue', hex: '#0000D7', code: 1 },
  { name: 'Red', hex: '#D70000', code: 2 },
  { name: 'Magenta', hex: '#D700D7', code: 3 },
  { name: 'Green', hex: '#00D700', code: 4 },
  { name: 'Cyan', hex: '#00D7D7', code: 5 },
  { name: 'Yellow', hex: '#D7D700', code: 6 },
  { name: 'White', hex: '#D7D7D7', code: 7 },
  { name: 'Bright Black', hex: '#000000', code: 8, bright: true },
  { name: 'Bright Blue', hex: '#0000FF', code: 9, bright: true },
  { name: 'Bright Red', hex: '#FF0000', code: 10, bright: true },
  { name: 'Bright Magenta', hex: '#FF00FF', code: 11, bright: true },
  { name: 'Bright Green', hex: '#00FF00', code: 12, bright: true },
  { name: 'Bright Cyan', hex: '#00FFFF', code: 13, bright: true },
  { name: 'Bright Yellow', hex: '#FFFF00', code: 14, bright: true },
  { name: 'Bright White', hex: '#FFFFFF', code: 15, bright: true },
];

export default function ZXPalette() {
  const [selected, setSelected] = useState(COLORS[10]);

  return (
    <div className="glass-panel p-6 rounded-2xl border-white/10 my-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
          <Palette size={22} />
        </div>
        <div>
          <h3 className="text-xl font-bold dark:text-white">ZX Color Palette</h3>
          <p className="text-sm text-zinc-500">The 15-color hardware limit of 1982</p>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mb-8">
        {COLORS.map((c) => (
          <button
            key={c.code}
            onClick={() => setSelected(c)}
            className={`aspect-square rounded-lg border-2 transition-all p-1 ${
              selected.code === c.code ? 'border-orange-500 scale-110 shadow-lg shadow-orange-500/20 z-10' : 'border-white/5 hover:border-white/20'
            }`}
          >
            <div className="w-full h-full rounded-md" style={{ backgroundColor: c.hex }} />
          </button>
        ))}
      </div>

      <div className="bg-zinc-950 p-4 rounded-xl border border-white/5 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-zinc-500 uppercase">Selected Color</span>
          <span className="text-lg font-bold text-white">{selected.name}</span>
        </div>
        <div className="flex gap-4 font-mono">
            <div className="text-center">
                <div className="text-[8px] text-zinc-500 uppercase">C-Bit</div>
                <div className="text-orange-500 font-bold">{selected.code.toString(2).padStart(4, '0')}</div>
            </div>
            <div className="text-center">
                <div className="text-[8px] text-zinc-500 uppercase">Hex</div>
                <div className="text-zinc-400 font-bold">{selected.hex}</div>
            </div>
        </div>
      </div>

      <div className="mt-8 p-4 rounded-xl bg-zinc-900 border border-white/10 flex gap-4 items-start">
        <div className="p-2 rounded-lg bg-white/5 text-zinc-400">
          <Info size={16} />
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed font-serif italic">
          "Note that although there are 16 combinations for colors, both Color 0 and Color 8 are effectively absolute black. This gives the Spectrum 15 distinct colors."
        </p>
      </div>
    </div>
  );
}
