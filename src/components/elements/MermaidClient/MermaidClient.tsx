'use client';
import mermaid from 'mermaid';
import { useEffect } from 'react';

mermaid.initialize({
  startOnLoad: false,
});

type MermaidProps = {
  readonly chart: string;
};

const MermaidClient = ({ chart }: MermaidProps): JSX.Element => {
  useEffect(() => {
    mermaid.run();
    mermaid.contentLoaded();
  }, []);

  return <pre className="mermaid">{chart}</pre>;
};
export default MermaidClient;
