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

    useEffect(() => {
      const fontApi = new FontAPI();
      
      const fetchFonts = async () => {
        try {
          setLoading(true);
          setError(null);
          const fonts = await fontApi.getAllFonts();
          setFonts(fonts);
        } catch (error) {
          console.error('Error fetching fonts:', error);
          setError('Failed to load fonts');
        } finally {
          setLoading(false);
        }
      };

      fetchFonts();
    }, []);

    return (
      <div style={{ padding: '10px' }}>
        {loading && <p>Loading fonts...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {fonts && fonts.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {fonts.map((font) => (
              <li key={font.uid} style={{ marginBottom: '10px' }}>
                <Button
                  onClick={() => {
                    store.activePage.addElement({
                      type: 'text',
                      text: 'Sample Text',
                      fontFamily: font.display_name,
                      fontURL: font.font_url,
                    });
                  }}
                >
                  {font.display_name}
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