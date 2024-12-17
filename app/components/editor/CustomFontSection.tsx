// components/editor/CustomFontSection.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { SectionTab } from 'polotno/side-panel';
import { observer } from 'mobx-react-lite';
import { Icon, Button } from '@blueprintjs/core';
import FontAPI from '../../services/fontApi';

interface Font {
  uid: string;
  display_name: string;
  font_url: string;
  category: string;
}

const loadFont = async (fontFamily: string, fontURL: string) => {
  try {
    // Check if font is already loaded
    if (document.fonts.check(`12px "${fontFamily}"`)) {
      return true;
    }

    console.log(`Loading font: ${fontFamily} from ${fontURL}`);
    const font = new FontFace(fontFamily, `url(${fontURL})`, {
      style: 'normal',
      weight: '400',
    });

    const loadedFont = await font.load();
    document.fonts.add(loadedFont);
    
    // Wait for the font to be fully loaded
    await document.fonts.ready;
    console.log(`Font loaded successfully: ${fontFamily}`);
    return true;
  } catch (error) {
    console.error(`Error loading font ${fontFamily}:`, error);
    return false;
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
      const fontApi = new FontAPI();
      
      const fetchAndLoadFonts = async () => {
        try {
          setLoading(true);
          setError(null);
          const fonts = await fontApi.getAllFonts();
          
          // Preload all fonts
          await Promise.all(
            fonts.map(async (font) => {
              const success = await loadFont(font.display_name, font.font_url);
              if (success) {
                setLoadedFonts(prev => new Set(prev).add(font.display_name));
              }
            })
          );
          
          setFonts(fonts);
        } catch (error) {
          console.error('Error fetching fonts:', error);
          setError('Failed to load fonts');
        } finally {
          setLoading(false);
        }
      };

      fetchAndLoadFonts();
    }, []);

    const handleAddText = (font: Font) => {
      if (!loadedFonts.has(font.display_name)) {
        console.warn(`Font ${font.display_name} not loaded yet`);
        return;
      }

      const element = {
        type: 'text',
        text: 'Sample Text',
        fontFamily: font.display_name,
        fontSize: 40,
        width: 300,
        x: store.width / 2,
        y: store.height / 2,
        align: 'center',
      };

      console.log('Adding text element:', element);
      store.activePage.addElement(element);
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
                  disabled={!loadedFonts.has(font.display_name)}
                  onClick={() => handleAddText(font)}
                >
                  <span style={{ 
                    fontFamily: loadedFonts.has(font.display_name) ? font.display_name : 'inherit',
                    opacity: loadedFonts.has(font.display_name) ? 1 : 0.5
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