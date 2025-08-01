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
