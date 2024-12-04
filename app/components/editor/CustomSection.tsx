// components/editor/CustomSection.tsx
"use client";

import React, { useState } from 'react';
import { SectionTab } from 'polotno/side-panel';
import { observer } from 'mobx-react-lite';
import { Icon, Button, Intent, Dialog } from '@blueprintjs/core';
import type { StoreType } from 'polotno/model/store';
import { CustomPalleteSection } from './CustomPalleteSection';
import { CustomLogoSection } from './CustomLogoSection';
import { CustomFontSection } from './CustomFontSection';

interface CustomSectionProps {
  store: StoreType;
}

interface Tab {
  id: string;
  label: string;
  icon: string;
}

const dummyImages = [
  {
    id: 1,
    url: 'https://picsum.photos/400/300',
    title: 'Sample Image 1'
  },
  {
    id: 2, 
    url: 'https://picsum.photos/400/301',
    title: 'Sample Image 2'
  },
  {
    id: 3,
    url: 'https://picsum.photos/401/300',
    title: 'Sample Image 3'
  }
];

const tabs: Tab[] = [
  { id: 'tab1', label: 'Upload Template', icon: 'upload' },
  { id: 'tab2', label: 'Palletes', icon: 'tint' },
  { id: 'tab3', label: 'Logos', icon: 'media' },
  { id: 'tab4', label: 'Fonts', icon: 'font' },
];

export const CustomSection = {
  name: 'Design',
  Tab: (props: any) => (
    <SectionTab name="POC1" {...props}>
      <Icon icon="cog" />
    </SectionTab>
  ),
  Panel: observer(({ store }: CustomSectionProps) => {
    const [activeTab, setActiveTab] = useState<string>('tab1');
    const [file, setFile] = useState<File | null>(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

    const toggleLightbox = () => setIsLightboxOpen(!isLightboxOpen);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        setFile(event.target.files[0]);
      }
    };

    const handleInsertImage = async (imageUrl: string) => {
      if (store.activePage) {
        await store.activePage.addElement({
          type: 'image',
          src: imageUrl,
          width: 300,
          height: 200,
          x: 50,
          y: 50
        });
        toggleLightbox();
      }
    };

    return (
      <div>
        <div style={{ 
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          borderBottom: '1px solid #ddd',
          paddingBottom: '10px',
          overflowX: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: '#ccc transparent'
        }}>
          <style>
            {`
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
                flexShrink: 0
              }}
            >
              <Icon icon={tab.icon} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'tab1' && (
          <div>
            <input 
              type="file" 
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.svg"
              style={{ marginBottom: '10px' }}
            />
            <Button
              icon="upload"
              intent={Intent.PRIMARY}
              disabled={!file}
              onClick={() => {
                // Handle upload logic
              }}
            >
              Upload Template
            </Button>
            
            <Button
              icon="media"
              intent={Intent.SUCCESS}
              onClick={toggleLightbox}
              style={{ marginLeft: '10px' }}
            >
              Browse Images
            </Button>
          </div>
        )}
        
        {activeTab === 'tab2' && (
          <div>
            <CustomPalleteSection.Panel store={store} />
          </div>
        )}
        
        {activeTab === 'tab3' && (
          <div>
            <CustomLogoSection.Panel store={store} />
          </div>
        )}

        {activeTab === 'tab4' && (
          <div>
            <CustomFontSection.Panel store={store} />
          </div>
        )}

        <Dialog
          isOpen={isLightboxOpen}
          onClose={toggleLightbox}
          title="Image Gallery"
          style={{ width: '800px' }}
        >
          <div className="bp3-dialog-body">
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              padding: '20px'
            }}>
              {dummyImages.map((image) => (
                <div key={image.id} style={{ textAlign: 'center' }}>
                  <img 
                    src={image.url} 
                    alt={image.title}
                    style={{ 
                      width: '100%',
                      borderRadius: '8px',
                      marginBottom: '10px'
                    }}
                  />
                  <Button
                    icon="add"
                    intent={Intent.SUCCESS}
                    onClick={() => handleInsertImage(image.url)}
                  >
                    Insert Image
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="bp3-dialog-footer">
            <Button
              icon="cross"
              intent={Intent.DANGER}
              onClick={toggleLightbox}
            >
              Close Gallery
            </Button>
          </div>
        </Dialog>
      </div>
    );
  })
};

export default CustomSection;