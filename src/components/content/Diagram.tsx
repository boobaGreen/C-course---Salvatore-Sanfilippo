import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: true,
    theme: 'dark',
    securityLevel: 'loose',
    fontFamily: 'Inter, system-ui, sans-serif',
    themeVariables: {
        primaryColor: '#10b981',
        primaryTextColor: '#fff',
        primaryBorderColor: '#10b981',
        lineColor: '#10b981',
        secondaryColor: '#0ea5e9',
        tertiaryColor: '#18181b',
    }
});

interface DiagramProps {
    id: string;
    definition: string;
}

export default function Diagram({ id, definition }: DiagramProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function renderDiagram() {
            if (containerRef.current) {
                try {
                    containerRef.current.innerHTML = '';
                    // Using a random ID suffix to avoid potential conflicts on re-renders
                    const uniqueId = `mermaid-${id}-${Math.floor(Math.random() * 10000)}`;
                    const { svg } = await mermaid.render(uniqueId, definition);
                    containerRef.current.innerHTML = svg;

                    // Ensure SVG takes full width if needed
                    const svgElement = containerRef.current.querySelector('svg');
                    if (svgElement) {
                        svgElement.style.maxWidth = '100%';
                        svgElement.style.height = 'auto';
                    }
                } catch (err) {
                    console.error('Mermaid rendering error:', err);
                    containerRef.current.innerHTML = `<div class="text-red-400 text-xs">Error rendering diagram</div>`;
                }
            }
        }
        renderDiagram();
    }, [id, definition]);

    return (
        <div className="my-8 flex justify-center w-full">
            <div
                ref={containerRef}
                className="glass-panel p-6 rounded-2xl border-white/10 bg-black/20 w-full overflow-x-auto flex justify-center"
            />
        </div>
    );
}
