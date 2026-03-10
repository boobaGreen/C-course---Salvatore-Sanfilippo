import { useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, ZoomIn, Layers } from 'lucide-react';

export default function DitheringSimulator() {
  const [crtGlow, setCrtGlow] = useState(false);
  const [zoom, setZoom] = useState(false);

  // 4x4 mock dither pattern (checkboard)
  const pattern = [
    1, 0, 1, 0,
    0, 1, 0, 1,
    1, 0, 1, 0,
    0, 1, 0, 1
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border-white/10 my-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Monitor size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold dark:text-white">Dithering & CRT Glow</h3>
            <p className="text-sm text-zinc-500">Optical blending simulation</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setCrtGlow(!crtGlow)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${crtGlow ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white/5 text-zinc-400 hover:bg-white/10'}`}
          >
            <Layers size={14} />
            CRT Bloom
          </button>
          <button 
            onClick={() => setZoom(!zoom)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${zoom ? 'bg-amber-500 text-white shadow-lg' : 'bg-white/5 text-zinc-400 hover:bg-white/10'}`}
          >
            <ZoomIn size={14} />
            Zoom
          </button>
        </div>
      </div>

      <div className="relative p-8 bg-zinc-950 rounded-xl border border-white/5 flex items-center justify-center overflow-hidden min-h-[220px]">
        <motion.div 
          animate={{ 
            scale: zoom ? 4 : 1,
            filter: crtGlow ? 'blur(1.5px) contrast(1.2) brightness(1.2)' : 'none'
          }}
          className="grid grid-cols-4 gap-0.5"
        >
          {pattern.map((p, i) => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-sm ${p ? 'bg-white shadow-[0_0_2px_rgba(255,255,255,0.5)]' : 'bg-zinc-900'}`}
              style={{
                boxShadow: crtGlow && p ? '0 0 4px rgba(255,255,255,0.8)' : 'none'
              }}
            />
          ))}
        </motion.div>

        {crtGlow && (
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        )}
        
        {crtGlow && (
            <div className="absolute inset-0 pointer-events-none opacity-10" 
                 style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }} />
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
           <div className="text-[10px] font-bold text-zinc-500 uppercase mb-2 tracking-tighter">Optical Illusion</div>
           <p className="text-xs text-zinc-400 leading-snug">
              Il dithering sfrutta la bassa risoluzione dei vecchi monitor CRT per "mescolare" i pixel bianchi e neri, creando l'illusione di una sfumatura di grigio che l'hardware dello Spectrum non poteva riprodurre nativamente.
           </p>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
           <div className="text-[10px] font-bold text-zinc-500 uppercase mb-2 tracking-tighter">CRT Bloom</div>
           <p className="text-xs text-zinc-400 leading-snug">
              L'effetto "bloom" (bagliore) del fosforo espande leggermente i pixel luminosi. Attiva il **CRT Bloom** per vedere come i punti isolati si fondono in una superficie continua.
           </p>
        </div>
      </div>
    </div>
  );
}
