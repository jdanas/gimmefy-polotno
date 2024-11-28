// components/editor/CustomPalleteSection.tsx
"use client";

import React, { useState } from 'react';
import { SectionTab, SectionContent } from 'polotno/side-panel';
import type { StoreType } from 'polotno/model/store';
import { observer } from 'mobx-react-lite';
import { Icon } from '@blueprintjs/core';

interface CustomPalleteSectionProps {
  store: StoreType;
}

interface Palette {
  name: string;
  colors: string[];
}

// Default palette for initial state
const defaultPalette: Palette = {
  name: "Default Colors",
  colors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"]
};

export const CustomPalleteSection = {
  name: 'custom-palette',
  Tab: observer(({ store }) => (
    <SectionTab name="custom-palette" title="Custom Palette">
      <Icon icon="tint" />
    </SectionTab>
  )),
  Panel: observer(({ store }: CustomPalleteSectionProps) => {
    const [palettes, setPalettes] = useState<Palette[]>([defaultPalette]);

    const handlePaletteUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const paletteData = JSON.parse(content) as Palette;
          setPalettes(prev => [...prev, paletteData]);
        } catch (error) {
          console.error('Error parsing palette file:', error);
        }
      };
      reader.readAsText(file);
    };

    const handleColorClick = (color: string) => {
      const selectedElements = store.selectedElements;
      if (selectedElements.length > 0) {
        selectedElements.forEach(element => {
          element.set({ fill: color });
        });
      }
    };

    return (
      <SectionContent name="custom-palette">
        <div style={{ padding: '20px' }}>
          <input
            type="file"
            accept=".json"
            onChange={handlePaletteUpload}
            style={{
              marginBottom: '20px',
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          
          {palettes.map((palette, paletteIndex) => (
            <div 
              key={paletteIndex}
              style={{ 
                marginBottom: '20px',
                background: '#f5f5f5',
                padding: '10px',
                borderRadius: '4px'
              }}
            >
              <h3 style={{ 
                marginBottom: '10px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {palette.name}
              </h3>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '8px'
              }}>
                {palette.colors.map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    onClick={() => handleColorClick(color)}
                    style={{
                      width: '30px',
                      height: '30px',
                      backgroundColor: color,
                      cursor: 'pointer',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      transition: 'transform 0.2s',
                      ':hover': {
                        transform: 'scale(1.1)'
                      }
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionContent>
    );
  })
};