import { DatabaseAdapter } from '@/app/api/databaseAdapter';
import { SupabaseAdapter } from '@/app/api/supabaseAdapter';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import React from 'react';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import styles from './styles.module.css';
import EmbeddedPDF from '@/components/modules/EmbeddedPDF/EmbeddedPDF';
import EmbeddedImage from '@/components/modules/EmbeddedImage/EmbeddedImage';

import 'katex/dist/katex.min.css'; // `rehype-katex` does not import the CSS for you
import mdxMermaid from 'mdx-mermaid';
import MermaidClient from '@/components/elements/MermaidClient/MermaidClient';

export const revalidate = 60;

export interface SummaryProps {
  params: { summaryName: string };
  searchParams: { type?: string };
}

export interface SummaryMatter {
  id?: number;
  title?: string;
  description?: string;
  professors?: Professor[];
  degree?: string;
  degreeSubject?: string;
  language?: string;
  university?: string;
  semester?: number;
  semesterPeriod?: string;
  lastModified?: Date;
  fileName?: string;
}

export interface Professor {
  id?: number;
  firstName?: string;
  lastName?: string;
}

export default async function Summary({ params, searchParams }: SummaryProps) {
  const db: DatabaseAdapter = new SupabaseAdapter();
  const file = await db.getSummary(
    params.summaryName + '.' + (searchParams.type || 'mdx'),
  );
  const text = await file?.text();
  const content = matter(text || '');

  return (
    <div className={styles.markdown}>
      {/* @ts-ignore */}
      <MDXRemote
        source={content.content}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkMath, [mdxMermaid]],
            rehypePlugins: [rehypeKatex, rehypeSlug],
          },
        }}
        components={{
          table: (props) => (
            <div className={styles.scrollableTable}>
              <table>{props.children}</table>
            </div>
          ),
          // @ts-ignore
          EmbeddedPDF,
          // @ts-ignore
          EmbeddedImage,
          mermaid: MermaidClient,
          MermaidClient,
        }}
      />
    </div>
  );
}
