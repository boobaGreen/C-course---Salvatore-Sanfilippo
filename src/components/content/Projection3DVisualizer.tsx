import { useEffect, useRef, useState } from 'react';
import { Box, Waves, Play, Pause, RotateCcw } from 'lucide-react';

/**
 * Interactive companion for lesson 32: a point cloud rotated around the Y axis
 * and projected with the "divide by (1 + z / K)" perspective trick, drawn on a
 * canvas frame buffer with an optional persistence-of-vision fade.
 */
type Model = 'cube' | 'wave';

const NUM_POINTS = 1000;
const W = 640;
const H = 360;

function buildModel(kind: Model): Float32Array {
    const pts = new Float32Array(NUM_POINTS * 3);
    if (kind === 'cube') {
        // Random points in a cube from -100 to 100 (deterministic seed for stable demo)
        let seed = 42;
        const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
        for (let j = 0; j < NUM_POINTS; j++) {
            pts[j * 3] = -100 + rnd() * 200;
            pts[j * 3 + 1] = -100 + rnd() * 200;
            pts[j * 3 + 2] = -100 + rnd() * 200;
        }
    } else {
        // 32 x 31 grid plane: y = 10 * sin(x) * cos(z)
        let j = 0;
        for (let x = -100; x <= 100 && j < NUM_POINTS; x += 6.5) {
            for (let z = -100; z <= 100 && j < NUM_POINTS; z += 6.5) {
                const fx = (x / 100) * Math.PI * 2;
                const fz = (z / 100) * Math.PI * 2;
                pts[j * 3] = x;
                pts[j * 3 + 1] = 10 + 10 * Math.sin(fx) * Math.cos(fz);
                pts[j * 3 + 2] = z;
                j++;
            }
        }
    }
    return pts;
}

export default function Projection3DVisualizer() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [model, setModel] = useState<Model>('wave');
    const [perspective, setPerspective] = useState(400); // the "400" divisor from the lesson
    const [speed, setSpeed] = useState(15); // percent of a full turn per second
    const [fade, setFade] = useState(true);
    const [running, setRunning] = useState(true);
    const timeRef = useRef(0);
    const pointsRef = useRef<Float32Array>(buildModel('wave'));

    useEffect(() => { pointsRef.current = buildModel(model); }, [model]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        let raf = 0;
        let last = performance.now();

        const frame = (now: number) => {
            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;
            if (running && !reduced) timeRef.current += dt;

            // clear() vs fade(): the lesson's "persistence of vision" effect
            if (fade) {
                ctx.fillStyle = 'rgba(12, 12, 14, 0.18)';
                ctx.fillRect(0, 0, W, H);
            } else {
                ctx.fillStyle = '#0c0c0e';
                ctx.fillRect(0, 0, W, H);
            }

            const alpha = timeRef.current * Math.PI * 2 * (speed / 100);
            const cosA = Math.cos(alpha);
            const sinA = Math.sin(alpha);
            const cx = W / 2;
            const cy = H / 2;
            const pts = pointsRef.current;

            for (let j = 0; j < NUM_POINTS; j++) {
                const x = pts[j * 3];
                const y = pts[j * 3 + 1];
                const z = pts[j * 3 + 2];
                // rotation around the Y axis (x' = x cos a + z sin a ; z' = -x sin a + z cos a)
                const rx = x * cosA + z * sinA;
                const rz = -x * sinA + z * cosA;
                // perspective: divide by (1 + z / K)
                const zf = 1 + rz / perspective;
                if (zf <= 0.05) continue;
                const sx = cx + (rx * 2) / zf;
                const sy = cy + (y * 2) / zf;
                if (sx < 0 || sx >= W || sy < 0 || sy >= H) continue;
                const depth = Math.max(0, Math.min(1, (rz + 100) / 200));
                ctx.fillStyle = `rgba(${Math.round(16 + 200 * (1 - depth))}, ${Math.round(185 - 60 * depth)}, ${Math.round(129 + 100 * depth)}, ${1 - depth * 0.6})`;
                ctx.fillRect(sx, sy, 2, 2);
            }
            raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(raf);
    }, [perspective, speed, fade, running]);

    const btn = (active: boolean) =>
        `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${active
            ? 'bg-[var(--color-brand-primary)]/15 border-[var(--color-brand-primary)]/50 text-[var(--color-brand-primary)]'
            : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'}`;

    return (
        <div className="my-8 glass-panel rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-black/5 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--color-brand-primary)]">Frame buffer 3D</h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-500">1000 punti · rotazione Y · prospettiva 1 + z/K</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setModel('cube')} className={btn(model === 'cube')}><Box size={14} aria-hidden /> Cubo casuale</button>
                    <button type="button" onClick={() => setModel('wave')} className={btn(model === 'wave')}><Waves size={14} aria-hidden /> Piano ondulato</button>
                    <button type="button" onClick={() => setFade((f) => !f)} className={btn(fade)}>fade()</button>
                    <button type="button" onClick={() => setRunning((r) => !r)} className={btn(false)} aria-label={running ? 'Pause' : 'Play'}>{running ? <Pause size={14} /> : <Play size={14} />}</button>
                    <button type="button" onClick={() => { timeRef.current = 0; }} className={btn(false)} aria-label="Reset"><RotateCcw size={14} /></button>
                </div>
            </div>

            <canvas ref={canvasRef} width={W} height={H} className="w-full block bg-[#0c0c0e]" aria-label="Point cloud rotating in perspective" />

            <div className="px-5 py-4 grid sm:grid-cols-2 gap-4 text-xs">
                <label className="flex flex-col gap-1.5">
                    <span className="flex justify-between text-slate-600 dark:text-zinc-400 font-semibold">
                        <span>Fattore prospettiva K</span>
                        <code className="font-mono text-[var(--color-brand-secondary)]">zf = 1 + z / {perspective}</code>
                    </span>
                    <input type="range" min={100} max={1200} step={10} value={perspective} onChange={(e) => setPerspective(Number(e.target.value))} className="accent-[var(--color-brand-primary)]" />
                    <span className="text-slate-500 dark:text-zinc-500">K piccolo = prospettiva esagerata · K grande = quasi ortogonale</span>
                </label>
                <label className="flex flex-col gap-1.5">
                    <span className="flex justify-between text-slate-600 dark:text-zinc-400 font-semibold">
                        <span>Velocità di rotazione</span>
                        <code className="font-mono text-[var(--color-brand-secondary)]">{speed}% di 2π/s</code>
                    </span>
                    <input type="range" min={0} max={100} step={5} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="accent-[var(--color-brand-primary)]" />
                    <span className="text-slate-500 dark:text-zinc-500">alpha = time · 2π · velocità</span>
                </label>
            </div>
        </div>
    );
}
