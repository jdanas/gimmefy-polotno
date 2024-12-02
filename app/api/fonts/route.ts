// app/api/fonts/route.ts
import { NextResponse } from 'next/server';

interface GoogleFont {
  id: string;
  name: string;
  family: string;
  category: string;
  url: string;
}

const GOOGLE_FONTS: GoogleFont[] = [
  {
    id: '1',
    name: 'Roboto',
    family: 'Roboto',
    category: 'sans-serif',
    url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap'
  },
  {
    id: '2',
    name: 'Open Sans',
    family: 'Open Sans',
    category: 'sans-serif',
    url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap'
  },
  {
    id: '3',
    name: 'Lato',
    family: 'Lato',
    category: 'sans-serif',
    url: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap'
  }
];

export async function GET() {
  try {
    return NextResponse.json({
      fonts: GOOGLE_FONTS,
      total: GOOGLE_FONTS.length
    });
  } catch (error) {
    console.error('Error fetching fonts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fonts' },
      { status: 500 }
    );
  }
}