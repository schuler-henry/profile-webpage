import { CircularProgress } from '@mui/material';
import React from 'react';

export default function Loading() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        marginTop: 'calc(50vh - 100px)',
      }}
    >
      <h1>Loading Content...</h1>
      <CircularProgress />
    </div>
  );
}
