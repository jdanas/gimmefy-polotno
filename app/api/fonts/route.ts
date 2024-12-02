// app/api/fonts/route.ts
import { NextResponse } from 'next/server';

const GOOGLE_FONTS_API_KEY = process.env.GOOGLE_FONTS_API_KEY;
const GOOGLE_FONTS_API = `https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_FONTS_API_KEY}`;

interface GoogleFont {
  id: string;
  name: string;
  family: string;
  category: string;
  url: string;
}

export async function GET() {
  try {
    // Fetch fonts from Google Fonts API
    const response = await fetch(GOOGLE_FONTS_API);
    
    if (!response.ok) {
      throw new Error('Failed to fetch fonts');
    }

    const data = await response.json();
    
    // Transform the response to match our interface
    const fonts: GoogleFont[] = data.items.map((font: any, index: number) => ({
      id: String(index + 1),
      name: font.family,
      family: font.family,
      category: font.category,
      url: `https://fonts.googleapis.com/css2?family=${font.family.replace(' ', '+')}&display=swap`
    }));

    // Return only first 20 fonts to avoid overwhelming the UI
    const limitedFonts = fonts.slice(0, 20);

    return NextResponse.json({
      fonts: limitedFonts,
      total: limitedFonts.length
    });
  } catch (error) {
    console.error('Error fetching fonts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fonts' },
      { status: 500 }
    );
  }
}