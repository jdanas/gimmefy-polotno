// components/editor/CustomFontSection.tsx
"use client";

import React from 'react';
import { SectionTab, SectionContent } from 'polotno/side-panel';
import { observer } from 'mobx-react-lite';
import { Icon } from '@blueprintjs/core';
import type { StoreType } from 'polotno/model/store';

interface CustomFontSectionProps {
  store: StoreType;
}

const defaultFonts = [
  { name: 'Arial', family: 'Arial' },
  { name: 'Times New Roman', family: 'Times New Roman' },
  { name: 'Helvetica', family: 'Helvetica' },
  { name: 'Courier New', family: 'Courier New' },
  { name: 'Georgia', family: 'Georgia' },
  { name: 'Verdana', family: 'Verdana' },
];

export const CustomFontSection = {
  name: 'fonts',
  Tab: observer(({ store }) => (
    <SectionTab name="fonts" title="Fonts">
      <Icon icon="font" />
    </SectionTab>
  )),
  Panel: observer(({ store }: CustomFontSectionProps) => {
    const handleFontSelect = (fontFamily: string) => {
      const selectedElements = store.selectedElements;
      if (selectedElements.length > 0) {
        selectedElements.forEach(element => {
          if (element.type === 'text') {
            element.set({ fontFamily });
          }
        });
      }
    };

    return (
      <SectionContent name="fonts">
        <div style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>Available Fonts</h3>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '10px',
            maxHeight: '500px',
            overflowY: 'auto'
          }}>
            {defaultFonts.map((font) => (
              <button
                key={font.family}
                onClick={() => handleFontSelect(font.family)}
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  background: 'white',
                  cursor: 'pointer',
                  fontFamily: font.family,
                  textAlign: 'left',
                  fontSize: '16px',
                  ':hover': {
                    background: '#f5f5f5'
                  }
                }}
              >
                <span style={{ fontFamily: font.family }}>
                  {font.name}
                </span>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#666',
                  marginTop: '4px',
                  fontFamily: font.family 
                }}>
                  The quick brown fox jumps over the lazy dog
                </div>
              </button>
            ))}
          </div>
        </div>
      </SectionContent>
    );
  })
};

export default CustomFontSection;