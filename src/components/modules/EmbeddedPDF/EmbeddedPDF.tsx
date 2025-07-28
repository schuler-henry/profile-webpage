import { DatabaseAdapter } from '@/src/app/api/databaseAdapter';
import { SupabaseAdapter } from '@/src/app/api/supabaseAdapter';
import React from 'react';
import styles from './EmbeddedPDF.module.css';

export interface EmbeddedPDFProps {
  pdfPath: string;
}

export default async function EmbeddedPDF(props: EmbeddedPDFProps) {
  const db: DatabaseAdapter = new SupabaseAdapter();
  const fileURL = await db.getSummaryPDFUrl(props.pdfPath);

  return (
    <div className={styles.embeddedPDF}>
      <iframe src={fileURL} height={'100%'} width={'100%'}></iframe>
    </div>
  );
}
