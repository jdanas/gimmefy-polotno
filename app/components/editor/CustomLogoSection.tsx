"use client";

import React, { useEffect, useState, useContext, useCallback } from 'react';
import { SectionTab } from 'polotno/side-panel';
import { observer } from 'mobx-react-lite';
import { Icon, Button } from '@blueprintjs/core';
import { LogoAPI } from '../../services/logoApi';
import { BrandKitContext } from '../../context/BrandKitContext';

const LogoPanel = observer(({ store }) => {
  const [logos, setLogos] = useState<Array<{ display_name: string; file_url: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const logoApi = new LogoAPI();
  const { brand_kit_uid } = useContext(BrandKitContext);

  useEffect(() => {
    console.log('Current brand_kit_uid:', brand_kit_uid); // Debug log

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

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const { fileUrl } = await logoApi.uploadLogoToS3(file, brand_kit_uid);
      const element = await store.activePage?.addElement({
        type: 'image',
        src: fileUrl,
      });
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  }, [store.activePage, logoApi, brand_kit_uid]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const { fileUrl } = await logoApi.uploadLogoToS3(file, brand_kit_uid);
      const element = await store.activePage?.addElement({
        type: 'image',
        src: fileUrl,
      });
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  }, [store.activePage, logoApi, brand_kit_uid]);

  return (
    <div style={{ padding: '20px' }}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? '#2196f3' : '#ccc'}`,
          borderRadius: '4px',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: isDragging ? 'rgba(33, 150, 243, 0.1)' : '#f8f9fa',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          marginBottom: '20px'
        }}
      >
        <input
          type="file"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          id="logo-upload"
          accept="image/*"
        />
        <label htmlFor="logo-upload" style={{ cursor: 'pointer', display: 'block' }}>
          <Icon icon="upload" size={32} color={isDragging ? '#2196f3' : '#666'} />
          <p style={{ margin: '10px 0 0', color: isDragging ? '#2196f3' : '#666' }}>
            {loading ? 'Uploading...' : 'Drag & drop a logo here or click to upload'}
          </p>
        </label>
      </div>
      <div style={{ marginTop: '20px' }}>
        {logos.map((logo) => (
          <div
            key={logo.file_url}
            onClick={async () => {
              const element = await store.activePage?.addElement({
                type: 'image',
                src: logo.file_url,
              });
            }}
            style={{ cursor: 'pointer', marginBottom: '10px' }}
          >
            <img
              src={logo.file_url}
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