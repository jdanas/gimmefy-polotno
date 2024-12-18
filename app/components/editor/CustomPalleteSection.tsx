"use client";

import React, { useState, useEffect, useContext } from 'react';
import { SectionTab } from 'polotno/side-panel';
import { observer } from 'mobx-react-lite';
import { Icon, Spinner } from '@blueprintjs/core';
import PaletteAPI from '../../services/paletteApi';
import { BrandKitContext } from '../../context/BrandKitContext';

interface Palette {
  uid: string;
  display_name: string;
  colors: string[];
  category: string;
}

const LogoPanel = observer(({ store }) => {
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paletteApi = new PaletteAPI();

  useEffect(() => {
    const fetchPalettes = async () => {
      setLoading(true);
      try {
        const response = await paletteApi.getAllPalettes();
        console.log('Fetched palettes:', response); // Debug log
        // Ensure colors is an array
        const validatedPalettes = response.map(palette => ({
          ...palette,
          colors: Array.isArray(palette.colors) ? palette.colors : []
        }));
        setPalettes(validatedPalettes);
      } catch (error) {
        console.error('Failed to fetch palettes:', error);
        setError('Failed to load palettes');
      } finally {
        setLoading(false);
      }
    };

    fetchPalettes();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      {loading && <Spinner />}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {palettes && palettes.length > 0 ? (
        palettes.map((palette) => (
          <div key={palette.uid} style={{ marginBottom: '20px' }}>
            <h3>{palette.display_name}</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {Array.isArray(palette.colors) && palette.colors.map((color, index) => (
                <div
                  key={`${palette.uid}-${index}`}
                  style={{
                    width: '30px',
                    height: '30px',
                    backgroundColor: color,
                    cursor: 'pointer',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                  onClick={() => {
                    const element = store.selectedElements[0];
                    if (element) {
                      element.set({ fill: color });
                    }
                  }}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div>No palettes available</div>
      )}
    </div>
  );
});

export const CustomPalleteSection = {
  name: 'palettes',
  Tab: observer(({ store }) => (
    <SectionTab name="palettes" title="Color Palettes">
      <Icon icon="tint" />
    </SectionTab>
  )),
  Panel: LogoPanel,
};