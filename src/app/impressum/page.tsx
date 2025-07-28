import React from 'react';
import styles from './styles.module.css';
import { Link } from '@mui/material';
import NextLink from 'next/link';

export default function Impressum() {
  return (
    <div>
      <h1>Impressum</h1>
      <p>Angaben gemäß § 5 TMG</p>
      <br />
      <p>Henry Schuler</p>
      <p>Kastellstraße 69/1</p>
      <p>88316 Isny</p>
      <br />
      <h2>Kontakt</h2>
      <p>
        Telefon:{' '}
        <Link href="tel:+491637292914" component={NextLink} color="secondary">
          +49 163 7292914
        </Link>
      </p>
      <p>
        Email:{' '}
        <Link
          href="mailto:contact@henryschuler.de"
          component={NextLink}
          color="secondary"
        >
          contact@henryschuler.de
        </Link>
      </p>
      <br />
      <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
      <p>Henry Schuler</p>
      <p>Kastellstraße 69/1</p>
      <p>88316 Isny</p>
    </div>
  );
}
