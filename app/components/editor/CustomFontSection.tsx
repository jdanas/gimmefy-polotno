// components/editor/CustomFontSection.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { SectionTab } from 'polotno/side-panel';
import { observer } from 'mobx-react-lite';
import { Icon, Button } from '@blueprintjs/core';
import FontAPI from '../../services/fontApi';
import { registerFont } from 'polotno/utils/font';

interface Font {
  uid: string;
  display_name: string;
  font_url: string;
  category: string;
}

// Add font loading with store management
const loadFont = async (store, font) => {
  try {
    const { display_name, font_url } = font;
    
    // Add font to store
    store.addFont({
      fontFamily: display_name,
      url: font_url,
    });

    // Prepare font for use
    await store.loadFont(display_name);
    
    console.log(`Font loaded in store: ${display_name}`);
    return true;
  } catch (error) {
    console.error(`Error loading font ${font.display_name}:`, error);
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
      const fetchAndLoadFonts = async () => {
        setLoading(true);
        try {
          const api = new FontAPI();
          const response = await api.getAllFonts();
          setFonts(response);
          
          // Load all fonts into store
          await Promise.all(
            response.map(font => loadFont(store, font))
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
        fontFamily: font.display_name,
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