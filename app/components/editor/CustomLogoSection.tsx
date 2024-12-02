// components/editor/CustomLogoSection.tsx
"use client";

import React, { useState } from 'react';
import { SectionTab, SectionContent } from 'polotno/side-panel';
import type { StoreType } from 'polotno/model/store';
import { observer } from 'mobx-react-lite';
import { Icon } from '@blueprintjs/core';

interface CustomLogoSectionProps {
  store: StoreType;
}

interface Logo {
  id: string;
  name: string;
  url: string;
}

export const CustomLogoSection = {
  name: 'custom-logo',
  Tab: observer(({ store }) => (
    <SectionTab name="custom-logo" title="Logo Library">
      <Icon icon="media" />
    </SectionTab>
  )),
  Panel: observer(({ store }: CustomLogoSectionProps) => {
    const [logos, setLogos] = useState<Logo[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);
      try {
        // Create URL for preview
        const url = URL.createObjectURL(file);
        
        // Add to logos array
        const newLogo: Logo = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          url: url
        };
        
        setLogos(prev => [...prev, newLogo]);
      } catch (error) {
        console.error('Error uploading logo:', error);
      } finally {
        setUploading(false);
      }
    };

    const addLogoToTemplate = async (logo: Logo) => {
        const page = store.activePage;
        if (!page) return;
      
        try {
          // Create an Image object to get dimensions
          const img = new Image();
          img.src = logo.url;
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
      
          // Calculate dimensions while maintaining aspect ratio
          let width = 200;
          let height = (img.height / img.width) * width;
      
          // Center the logo on the page
          const pageWidth = page.width;
          const pageHeight = page.height;
          const x = (pageWidth - width) / 2;
          const y = (pageHeight - height) / 2;
      
          // Add the image element with proper positioning
          const element = await page.addElement('image', {
            x,
            y,
            width,
            height,
            src: logo.url,
            name: logo.name,
          });
      
          // Select the newly added element
          page.selectElements([element]);
      
          // Ensure the element is visible
          store.setZoom('fit');
        } catch (error) {
          console.error('Error adding logo to template:', error);
        }
      };

    return (
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '10px' }}>Upload Logo</h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            disabled={uploading}
            style={{
              marginBottom: '10px',
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          {uploading && <p>Uploading...</p>}
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          maxHeight: '500px',
          overflowY: 'auto',
          paddingRight: '10px'
        }}>
          {logos.map((logo) => (
            <div
              key={logo.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '12px',
                cursor: 'pointer',
                backgroundColor: '#f5f5f5'
              }}
              onClick={() => addLogoToTemplate(logo)}
            >
              <img
                src={logo.url}
                alt={logo.name}
                style={{
                  width: '100%',
                  height: '120px',
                  objectFit: 'contain',
                  marginBottom: '8px'
                }}
              />
              <p style={{ 
                fontSize: '14px',
                textAlign: 'center',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {logo.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  })
};