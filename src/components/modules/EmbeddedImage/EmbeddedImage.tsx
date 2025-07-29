import { DatabaseAdapter } from '@/src/backend/data-access/database/databaseAdapter';
import { SupabaseAdapter } from '@/src/backend/data-access/database/supabaseAdapter';
import React from 'react';

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

  // Currently, we do not want to optimize these lazy loaded images,
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={imageURL} alt={props.altText} />;
}
