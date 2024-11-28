// page.tsx
'use client';  // Add this line

import dynamic from 'next/dynamic';
import { useState } from 'react';

const PolotnoEditor = dynamic(() => import('./components/editor/PolotnoEditor'), {
  ssr: false,
  loading: () => <div>Loading editor...</div>
});

export default function Home() {
  return (
    <main className="min-h-screen">
      <PolotnoEditor />
    </main>
  );
}