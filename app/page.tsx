import Image from 'next/image';
import styles from './styles.module.css';
import Button from '@mui/material/Button';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>Welcome</h1>
      <p>
        Note: Except for the <Link href={'/studies/summaries'}>summaries</Link>,
        this website is still in development .
      </p>
    </main>
  );
}
