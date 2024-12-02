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

const defaultPalettes: Palette[] = [
  {
    name: "Default Colors",
    colors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"]
  },
  {
    name: "Pastel Colors",
    colors: ["#FFB3BA", "#BAFFC9", "#BAE1FF", "#FFFFBA", "#FFB3F7"]
  }
];

export const CustomPalleteSection = {
  name: 'custom-palette',
  Tab: observer(({ store }) => (
    <SectionTab name="custom-palette" title="Color Palette">
      <Icon icon="tint" />
    </SectionTab>
  )),
  Panel: observer(({ store }: CustomPalleteSectionProps) => {
    const [palettes, setPalettes] = useState<Palette[]>(defaultPalettes);

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
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '10px' }}>Upload New Palette</h3>
          <input
            type="file"
            accept=".json"
            onChange={handlePaletteUpload}
            style={{
              marginBottom: '10px',
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <p style={{ fontSize: '12px', color: '#666' }}>
            Upload a JSON file with format: {"{"} "name": "Palette Name", "colors": ["#hex", ...] {"}"}
          </p>
        </div>

        <div style={{ 
          maxHeight: '400px',
          overflowY: 'auto',
          paddingRight: '10px'
        }}>
          {palettes.map((palette, paletteIndex) => (
            <div 
              key={paletteIndex} 
              style={{ 
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px'
              }}
            >
              <h3 style={{ 
                marginBottom: '10px',
                fontSize: '16px',
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
                    title={color}
                    style={{
                      width: '30px',
                      height: '30px',
                      backgroundColor: color,
                      cursor: 'pointer',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      transition: 'transform 0.2s',
                      ':hover': {
                        transform: 'scale(1.1)'
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  })
};

export default CustomPalleteSection;