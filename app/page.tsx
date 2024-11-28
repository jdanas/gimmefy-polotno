import dynamic from 'next/dynamic';

const PolotnoEditor = dynamic(
  () => import('./components/editor/PolotnoEditor'),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="min-h-screen">
      <PolotnoEditor />
    </main>
  );
}