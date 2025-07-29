import { DatabaseAdapter } from '@/src/backend/data-access/database/databaseAdapter';
import { SupabaseAdapter } from '@/src/backend/data-access/database/supabaseAdapter';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import React, { Suspense } from 'react';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import styles from './styles.module.css';
import EmbeddedPDF from '@/src/components/modules/EmbeddedPDF/EmbeddedPDF';
import EmbeddedImage from '@/src/components/modules/EmbeddedImage/EmbeddedImage';

import 'katex/dist/katex.min.css'; // `rehype-katex` does not import the CSS for you
import MdxPreComponent from '@/src/components/modules/MdxPreComponent/MdxPreComponent';

export const revalidate = 60;

export interface SummaryProps {
  params: Promise<{ summaryName: string }>;
  searchParams: Promise<{ type?: string }>;
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

export default async function Summary(props: SummaryProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const db: DatabaseAdapter = new SupabaseAdapter();
  const file = await db.getSummary(
    params.summaryName + '.' + (searchParams.type || 'mdx'),
  );
  const text = await file?.text();
  const content = matter(text || '');

  return (
    <Suspense fallback={<div>LOADING...</div>}>
      <div className={styles.markdown}>
        {/* @ts-ignore */}
        <MDXRemote
          source={content.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm, remarkMath],
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
            pre: MdxPreComponent,
          }}
        />
      </div>
    </Suspense>
  );
}
