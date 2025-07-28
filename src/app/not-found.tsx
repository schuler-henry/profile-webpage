import { Link } from '@mui/material';
import NextLink from 'next/link';
import React from 'react';

export default function NotFound() {
  return (
    <div>
      <h2>This page was not found.</h2>
      <p>
        Go back to{' '}
        <Link href="/" component={NextLink} color="secondary">
          home
        </Link>
        .
      </p>
    </div>
  );
}
