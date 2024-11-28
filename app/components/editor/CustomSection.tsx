// components/editor/CustomSection.tsx
"use client";

import React, { useState } from 'react';
import { SectionTab, SectionContent } from 'polotno/side-panel';
import type { StoreType } from 'polotno/model/store';
import { observer } from 'mobx-react-lite';
import { Icon } from '@blueprintjs/core';

interface CustomSectionProps {
  store: StoreType;
}

const tabs = [
  { id: 'tab1', label: 'Upload Template', icon: 'upload' },
  { id: 'tab2', label: 'Palletes', icon: 'tint' },
  { id: 'tab3', label: 'Logos', icon: 'media' },
  { id: 'tab4', label: 'Fonts', icon: 'cog' },

];

export const CustomSection = {
  name: 'custom',
  Tab: (props) => (
    <SectionTab name="Custom" {...props}>
      <Icon icon="hand" />
    </SectionTab>
  ),
  Panel: observer(({ store }) => {
    const [activeTab, setActiveTab] = useState('tab1');
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
      setFile(event.target.files[0]);
    };

    const handleUpload = () => {
      if (file) {
        // Implement the logic to upload the file and use it as a template
        console.log('Uploading file:', file);
        // Reset file input
        setFile(null);
      }
    };

    return (
      <div style={{ padding: '20px' }}>
        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '20px',
          borderBottom: '1px solid #ddd',
          paddingBottom: '10px',
          overflowX: 'auto',  // Make the tab navigation scrollable
          scrollbarWidth: 'thin',  // Firefox
          scrollbarColor: '#ccc transparent'  // Firefox
        }}>
          <style>
            {`
              /* Webkit browsers */
              ::-webkit-scrollbar {
                height: 6px;
              }
              ::-webkit-scrollbar-thumb {
                background-color: #ccc;
                border-radius: 3px;
              }
              ::-webkit-scrollbar-track {
                background: transparent;
              }
            `}
          </style>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 16px',
                background: activeTab === tab.id ? '#007bff' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'inherit',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                flexShrink: 0  // Prevent buttons from shrinking
              }}
            >
              <Icon icon={tab.icon} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'tab1' && (
          <div>
          <h3>Upload Template</h3>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload} disabled={!file}>
            Upload
          </button>
        </div>
        )}
        
        {activeTab === 'tab2' && (
          <div>
            <h3>Settings</h3>
            <p>Configure your options here</p>
          </div>
        )}
        
        {activeTab === 'tab3' && (
          <div>
            <h3>Help</h3>
            <p>Need assistance? Check our documentation.</p>
          </div>
        )}
      </div>
    );
  }),
};