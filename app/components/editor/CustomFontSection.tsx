// components/editor/CustomFontSection.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { SectionTab } from 'polotno/side-panel';
import { observer } from 'mobx-react-lite';
import { Icon, Button } from '@blueprintjs/core';
import FontAPI from '../../services/fontApi';

interface Font {
  uid: string;
  file_name: string;
  display_name: string;
  organisation_id: number;
  category: string;
  file_url: string;  // This is what we need for font loading
}

// Add font loading with store management
const loadFont = async (store, font, setLoadedFonts) => {
  try {
    if (!font || !font.display_name || !font.file_url) {
      throw new Error('Invalid font data');
    }

    const { display_name, file_url } = font;
    
    // Clean font family name
    const cleanFontFamily = display_name
      .replace(/\.ttf$|\.otf$/i, "") // Remove font extensions
      .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove special characters
      .trim();
    
    console.log(`Loading font: ${cleanFontFamily} from ${file_url}`);

    // Validate font URL with proper null check
    if (typeof file_url !== 'string' || !file_url.match(/^https?:\/\//)) {
      throw new Error(`Invalid font URL: ${file_url}`);
    }

    // Register font with store using file_url instead of font_url
    store.addFont({
      fontFamily: cleanFontFamily,
      url: file_url,
    });

    // Load font with timeout
    const fontLoadPromise = store.loadFont(cleanFontFamily);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error(`Font load timeout: ${cleanFontFamily}`)), 10000)
    );

    await Promise.race([fontLoadPromise, timeoutPromise]);
    
    // Add to loaded fonts set
    setLoadedFonts(prev => new Set([...prev, cleanFontFamily]));
    return cleanFontFamily;
  } catch (error) {
    console.error(`Font loading error for ${font?.display_name}:`, error);
    return null;
  }
};

export const CustomFontSection = {
  name: 'fonts',
  Tab: observer(({}) => (
    <SectionTab name="fonts" title="Custom Fonts">
      <Icon icon="font" />
    </SectionTab>
  )),
  Panel: observer(({ store }) => {
    const [fonts, setFonts] = useState<Font[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());

    useEffect(() => {
      const fetchAndLoadFonts = async () => {
        setLoading(true);
        try {
          const api = new FontAPI();
          const response = await api.getAllFonts();
          setFonts(response);
          
          // Load all fonts into store
          await Promise.all(
            response.map(font => loadFont(store, font, setLoadedFonts))
          );
        } catch (error) {
          console.error('Error fetching fonts:', error);
          setError('Failed to load fonts');
        }
        setLoading(false);
      };

      fetchAndLoadFonts();
    }, [store]);

    const handleAddText = (font: Font) => {
      const element = {
        type: 'text',
        text: 'Sample Text',
        fontFamily: font.display_name.replace(/\.ttf$|\.otf$/i, "").trim(),
        fontSize: 40,
        width: 300,
        x: store.width / 2,
        y: store.height / 2,
        align: 'center',
      };

      store.activePage?.addElement(element);
    };

    return (
      <div style={{ padding: '10px' }}>
        {loading && <p>Loading fonts...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {fonts && fonts.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {fonts.map((font) => (
              <li key={font.uid} style={{ marginBottom: '10px' }}>
                <Button
                  disabled={!loadedFonts.has(font.display_name.replace(/\.ttf$|\.otf$/i, "").trim())}
                  onClick={() => handleAddText(font)}
                >
                  <span style={{ 
                    fontFamily: loadedFonts.has(font.display_name.replace(/\.ttf$|\.otf$/i, "").trim()) 
                      ? font.display_name.replace(/\.ttf$|\.otf$/i, "").trim() 
                      : 'inherit'
                  }}>
                    {font.display_name}
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>No fonts available</p>
        )}
      </div>
    );
  }),
};

export default CustomFontSection;