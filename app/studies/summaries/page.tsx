import { DatabaseAdapter } from '@/app/api/databaseAdapter';
import { SupabaseAdapter } from '@/app/api/supabaseAdapter';
import SummaryListItem from '@/components/modules/SummaryListItem/SummaryListItem';
import matter from 'gray-matter';
import React from 'react';
import styles from './styles.module.css';

export default async function Summaries() {
  const db: DatabaseAdapter = new SupabaseAdapter();
  const names = await db.getSummaryNames();

  return (
    <div className={styles.summaryList}>
      <h1>Summaries</h1>
      {names.map(async (name) => {
        const file = await db.getSummary(name);
        const text = await file?.text();
        const content = matter(text || '');
        return (
          <div key={name}>
            {name.split('.')[1] === 'mdx' ? (
              <SummaryListItem
                title={content.data.title}
                professor={content.data.professor}
                degree={content.data.degree}
                language={content.data.language}
                universityName={content.data.universityName}
                href={
                  '/studies/summaries/' +
                  name.split('.')[0] +
                  '?type=' +
                  name.split('.')[1]
                }
              />
            ) : (
              <></>
            )}
          </div>
        );
      })}
    </div>
  );
}
