import { DatabaseAdapter } from '@/app/api/databaseAdapter';
import { SupabaseAdapter } from '@/app/api/supabaseAdapter';
import SummaryListItem from '@/components/modules/SummaryListItem/SummaryListItem';
import matter from 'gray-matter';
import React from 'react';
import styles from './styles.module.css';

export const revalidate = 1800;

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
                description={content.data.description}
                professor={content.data.professor}
                degree={content.data.degree}
                degreeName={content.data.degreeName}
                language={content.data.language}
                universityName={content.data.universityName}
                semester={content.data.semester}
                semesterPeriod={content.data.semesterPeriod}
                date={content.data.date}
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
