import { DatabaseAdapter } from '@/app/api/databaseAdapter';
import { SupabaseAdapter } from '@/app/api/supabaseAdapter';
import React from 'react';
import styles from './EmbeddedImage.module.css';

export interface EmbeddedImageProps {
  imagePath: string;
  imageType?: string;
  altText: string;
}

export default async function EmbeddedImage(props: EmbeddedImageProps) {
  const db: DatabaseAdapter = new SupabaseAdapter();
  const imageURL = await db.getSummaryElementUrl(
    props.imagePath,
    props.imageType || 'png',
  );

  return <img src={imageURL} alt={props.altText} />;
}
