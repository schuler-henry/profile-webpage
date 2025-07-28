import React, { JSX, ReactElement } from 'react';
import MermaidClient from '@/src/components/elements/MermaidClient/MermaidClient';
import { Prism } from 'react-syntax-highlighter';

function MdxPreComponent({
  inline,
  children,
}: {
  inline: boolean;
  children: ReactElement<{ className?: string; children: string }>;
}) {
  const match = /language-(\w+)/.exec(children.props.className || '');

  return !inline && match ? (
    match[1] == 'mermaid' ? (
      <MermaidClient chart={children.props.children} />
    ) : (
      <Prism language={match[1]} PreTag="pre" {...children.props}>
        {String(children.props.children).replace(/\n$/, '')}
      </Prism>
    )
  ) : (
    <code className={children.props.className} {...children.props}>
      {children.props.children}
    </code>
  );
}

export default MdxPreComponent;
