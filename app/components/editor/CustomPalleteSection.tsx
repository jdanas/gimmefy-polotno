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
    const [selectedElement, setSelectedElement] = useState<'all' | 'background' | 'text' | 'shapes'>('all');

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

    const applyColorToTemplate = (color: string) => {
      const page = store.activePage;
      if (!page) return;

      switch (selectedElement) {
        case 'all':
          // Apply to all elements
          page.children.forEach(element => {
            element.set({ fill: color });
          });
          break;
        case 'background':
          // Apply to background elements
          page.children
            .filter(element => element.type === 'background')
            .forEach(element => element.set({ fill: color }));
          break;
        case 'text':
          // Apply to text elements
          page.children
            .filter(element => element.type === 'text')
            .forEach(element => element.set({ fill: color }));
          break;
        case 'shapes':
          // Apply to shape elements
          page.children
            .filter(element => ['rect', 'circle', 'polygon'].includes(element.type))
            .forEach(element => element.set({ fill: color }));
          break;
      }
    };

    return (
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '10px' }}>Apply Colors To:</h3>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {['all', 'background', 'text', 'shapes'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedElement(type as typeof selectedElement)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: selectedElement === type ? '#007bff' : '#f0f0f0',
                  color: selectedElement === type ? 'white' : 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          
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
                    onClick={() => applyColorToTemplate(color)}
                    title={`Apply ${color} to ${selectedElement}`}
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