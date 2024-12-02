// components/editor/CustomFontSection.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { SectionTab } from 'polotno/side-panel';
import { observer } from 'mobx-react-lite';
import { Icon, Button } from '@blueprintjs/core';
import { DEFAULT_SECTIONS } from 'polotno/side-panel';
import type { StoreType } from 'polotno/model/store';

// Find the default text section that includes font handling
const TextSection = DEFAULT_SECTIONS.find(
  (section) => section.name === 'text'
);

export const CustomFontSection = {
  name: 'fonts',
  Tab: observer(({ store }) => (
    <SectionTab name="fonts" title="Fonts">
      <Icon icon="font" />
    </SectionTab>
  )),
  Panel: observer(({ store }) => {
    const [fonts, setFonts] = useState([]);

    useEffect(() => {
      const fetchFonts = async () => {
        try {
          const response = await fetch('/api/fonts');
          const data = await response.json();
          setFonts(data.fonts);
        } catch (error) {
          console.error('Error fetching fonts:', error);
        }
      };

      fetchFonts();
    }, []);

    return (
      <div style={{ padding: '10px' }}>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {fonts.map((font) => (
            <li key={font.id} style={{ marginBottom: '10px' }}>
              <Button
                onClick={() => {
                  store.activePage.addElement({
                    type: 'text',
                    text: 'Sample Text',
                    fontFamily: font.family,
                  });
                }}
                style={{ width: '100%', textAlign: 'left' }}
              >
                <div style={{ fontFamily: font.family }}>
                  {font.name}
                </div>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    );
  }),
};

export default CustomFontSection;