// components/editor/CustomFontSection.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { SectionTab, SectionContent } from 'polotno/side-panel';
import { observer } from 'mobx-react-lite';
import { Icon } from '@blueprintjs/core';
import type { StoreType } from 'polotno/model/store';

interface GoogleFont {
  id: string;
  name: string;
  family: string;
  category: string;
  url: string;
}

const FontPanel = observer(({ store }: { store: StoreType }) => {
  const [fonts, setFonts] = useState<GoogleFont[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/fonts')
      .then(res => res.json())
      .then(data => {
        setFonts(data.fonts);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading fonts:', error);
        setLoading(false);
      });
  }, []);

  return (
    <SectionContent name="fonts">
      <div style={{ padding: '20px' }}>
        {loading ? (
          <div>Loading fonts...</div>
        ) : (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '10px',
            maxHeight: '500px',
            overflowY: 'auto'
          }}>
            {fonts.map((font) => (
              <div
                key={font.id}
                style={{
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: 'white'
                }}
                onClick={() => {
                  if (store.selectedElements[0]) {
                    store.selectedElements[0].set({ fontFamily: font.family });
                  }
                }}
              >
                <div style={{ fontSize: '16px', marginBottom: '5px' }}>
                  {font.name}
                </div>
                <div style={{ 
                  fontFamily: font.family,
                  fontSize: '14px'
                }}>
                  The quick brown fox jumps over the lazy dog
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionContent>
  );
});

export const CustomFontSection = {
  name: 'fonts',
  Tab: observer(({ store }) => (
    <SectionTab name="fonts" title="Fonts">
      <Icon icon="font" />
    </SectionTab>
  )),
  Panel: FontPanel
};

export default CustomFontSection;