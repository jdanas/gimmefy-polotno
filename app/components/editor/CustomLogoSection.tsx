"use client";

import React, { useEffect, useState, useContext } from 'react';
import { SectionTab } from 'polotno/side-panel';
import { observer } from 'mobx-react-lite';
import { Icon, Button, FileInput } from '@blueprintjs/core';
import { LogoAPI } from '../../services/logoApi';
import { BrandKitContext } from '../../context/BrandKitContext';

const LogoPanel = observer(({ store }) => {
  const [logos, setLogos] = useState<Array<{ display_name: string; logo_url: string }>>([]);
  const [loading, setLoading] = useState(false);
  const logoApi = new LogoAPI();
  const { brand_kit_uid } = useContext(BrandKitContext);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        await logoApi.login('shalu.wasu@teemuno.com', 'P12345678'); // Replace with actual credentials
        const response = await logoApi.getAllLogos({
          brand_kit_uid,
        });
        setLogos(response.payload);
      } catch (error) {
        console.error('Failed to fetch logos:', error);
      }
    };

    if (brand_kit_uid) {
      fetchLogos();
    }
  }, [brand_kit_uid]);

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
    <div style={{ padding: '20px' }}>
      <FileInput
        text="Choose logo file..."
        onInputChange={handleFileUpload}
        disabled={loading}
      />
      <div style={{ marginTop: '20px' }}>
        {logos.map((logo) => (
          <div
            key={logo.logo_url}
            onClick={async () => {
              const element = await store.activePage?.addElement({
                type: 'image',
                src: logo.logo_url,
              });
            }}
            style={{ cursor: 'pointer', marginBottom: '10px' }}
          >
            <img
              src={logo.logo_url}
              alt={logo.display_name}
              style={{ maxWidth: '100px', height: 'auto' }}
            />
            <p>{logo.display_name}</p>
          </div>
        ))}
      </div>
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