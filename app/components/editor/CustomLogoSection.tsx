"use client";

import React, { useEffect, useState } from 'react';
import { SectionTab } from 'polotno/side-panel';
import { observer } from 'mobx-react-lite';
import { Icon, Button, FileInput } from '@blueprintjs/core';
import { LogoAPI } from '../../services/logoApi';

const LogoPanel = observer(({ store }) => {
  const [logos, setLogos] = useState<Array<{ display_name: string; logo_url: string }>>([]);
  const [loading, setLoading] = useState(false);
  const logoApi = new LogoAPI();

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        await logoApi.login('shalu.wasu@teemuno.com', 'P12345678'); // Replace with actual credentials
        const response = await logoApi.getAllLogos({
          brand_kit_uid: '586b9ff042c8f6f5565d22ac583373b5', // Replace with actual value
          initial_size: '', // Optional
          project_uid: '' // Optional
        });
        setLogos(response.payload);
      } catch (error) {
        console.error('Failed to fetch logos:', error);
      }
    };

    fetchLogos();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const signedUrlResponse = await logoApi.getSignedUploadUrl(file.name, 'your-brand-kit-uid');
      // Handle the file upload to the signed URL
      // After successful upload, you can add the image to the store:
      const element = await store.activePage?.addElement({
        type: 'image',
        src: signedUrlResponse.payload.url,
      });
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      {loading && <p>Loading logos...</p>}
      <div className="logo-grid">
        {logos.map((logo) => (
          <div key={logo.uid || logo.display_name} className="logo-item">
            <img 
              src={logo.logo_url} 
              alt={logo.display_name}
              onClick={() => {
                store.activePage?.addElement({
                  type: 'image',
                  src: logo.logo_url,
                });
              }}
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'contain',
                cursor: 'pointer'
              }}
            />
            <p>{logo.display_name}</p>
          </div>
        ))}
      </div>
      <FileInput 
        text="Upload Logo" 
        onChange={handleFileUpload}
        disabled={loading}
      />
    </div>
  );
});

export const CustomLogoSection = {
  name: 'logos',
  Tab: observer(({ store }) => (
    <SectionTab name="logos" title="Logos">
      <Icon icon="media" />
    </SectionTab>
  )),
  Panel: LogoPanel,
};

export default CustomLogoSection;