'use client';
import mermaid from 'mermaid';
import { useEffect, useRef, type JSX } from 'react';

type MermaidProps = {
  readonly chart: string;
};

const MermaidClient = ({ chart }: MermaidProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      mermaid.mermaidAPI.reset();
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        htmlLabels: false,
        flowchart: {
          htmlLabels: false,
          useMaxWidth: true,
        },
      });

      const id = 'mermaid-' + Math.random().toString(36).substring(2, 15);
      const el = ref.current;
      mermaid.render(id, chart).then((result) => {
        el.innerHTML = result.svg;
      });
    }
  }, [chart]);

  return <div ref={ref}>{chart}</div>;
};
export default MermaidClient;
