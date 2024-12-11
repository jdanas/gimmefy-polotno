// components/editor/CustomSection.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Section, SectionTab } from 'polotno/side-panel';
import { observer } from 'mobx-react-lite';
import { Icon, Button, Intent, Dialog } from '@blueprintjs/core';
import type { StoreType } from 'polotno/model/store';
import { CustomPalleteSection } from './CustomPalleteSection';
import { CustomLogoSection } from './CustomLogoSection';
import { CustomFontSection } from './CustomFontSection';
import { useContext } from 'react';
import { CustomDataContext } from './PolotnoEditor';

// Add these imports at the top
import { TemplateApiService } from '../../services/templateApi';
import { ImagesGrid } from 'polotno/side-panel/images-grid';

// Interface definitions
interface StoreType {
  activePage?: {
    addElement: (element: {
      type: string;
      src: string;
      width: number;
      height: number;
      x: number;
      y: number;
    }) => Promise<void>;
  };
}

interface PanelProps {
  store: StoreType;
}

interface TabProps {
  name: string;
  [key: string]: any; // For additional props being spread
}
interface CustomSectionProps {
  store: StoreType;
  authKey: string;
  onPanelClick?: () => void;
}
interface Tab {
  id: string;
  label: string;
  icon: string;
}
interface Template {
  uid: string;
  thumbnail_url: string;
  name: string;
  description?: string;
  width?: number;
  height?: number;
  created_at?: string;
}

interface ApiError {
  message: string;
  stack?: string;
  response?: {
    data?: any;
    status?: number;
    statusText?: string;
  };
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

// Add function to get URL params
const getTokenFromUrl = () => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    return params.get('token');
  }
  return null;
};

export const CustomSection = {
  name: 'Design',
  Tab: (props: any) => (
    <SectionTab name="POC1" {...props}>
      <Icon icon="cog" />
    </SectionTab>
  ),
  Panel: observer(({ store }) => {
    const { authKey, onPanelClick } = useContext(CustomDataContext);
    const [activeTab, setActiveTab] = useState<string>('tab1');
    const [file, setFile] = useState<File | null>(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
    const [isGimmefyPopupOpen, setIsGimmefyPopupOpen] = useState<boolean>(false);
    // Add inside Panel component after existing state declarations
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [personalTemplates, setPersonalTemplates] = useState<Template[]>([]);
    const [gimmefyTemplates, setGimmefyTemplates] = useState<Template[]>([]);
    const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState<boolean>(false);

    // Get token from URL
    const urlToken = getTokenFromUrl();

    const toggleLightbox = () => setIsLightboxOpen(!isLightboxOpen);
    const toggleGimmefyPopup = () => setIsGimmefyPopupOpen(!isGimmefyPopupOpen);
    const toggleCreateTemplate = () => setIsCreateTemplateOpen(!isCreateTemplateOpen);

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

    const handleGimmefyClick = () => {
      // Notify parent window
      window.parent.postMessage({
        type: 'textToImage',
        data: {
          text: 'Hello World',
          authKey: urlToken || 'default-token'
        }
      }, '*');
    };

    // Update CustomSection.tsx
    useEffect(() => {
      const fetchTemplates = async () => {
        try {
          setIsLoading(true);
          const api = new TemplateApiService();
          const response = await api.getTemplates();
          
          // Separate templates by category
          const personal = response.payload.filter(
            (template: Template) => template.category === 'personal-templates'
          );
          const gimmefy = response.payload.filter(
            (template: Template) => template.category === 'gimmefy-templates'
          );
          
          setPersonalTemplates(personal);
          setGimmefyTemplates(gimmefy);
        } catch (err) {
          console.error('Template fetch error:', err);
          setError(`Failed to load templates: ${err.message}`);
        } finally {
          setIsLoading(false);
        }
      };
    
      fetchTemplates();
    }, []);


    return (
      <div>
        {/* Tab Navigation */}
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

        {/* Tab Content */}
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
            <div 
              style={{
                padding: '15px',
                margin: '10px 0',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                border: '1px solid #ddd',
                cursor: 'pointer' // Add cursor pointer
              }}
              onClick={() => {
                console.log('click handler accepting callback');
                // Call the callback if provided
                if (onPanelClick) {
                  onPanelClick();
                }
              }}
            >
              {/* <h3>Hello World</h3>
              <p>Auth Key: {authKey}</p>
              <Button
              icon="application"
              intent={Intent.PRIMARY}
              onClick={toggleGimmefyPopup}
              style={{ marginTop: '10px' }}
            >
              Open Gimmefy Popup
            </Button>

            
            <Button
              icon="application"
              intent={Intent.PRIMARY}
              onClick={handleGimmefyClick}
              style={{ marginTop: '10px' }}
            >
              Send Data to Parent
            </Button> */}


            {/* Add Templates Grid */}
            <div style={{ height: 'calc(100vh - 200px)', overflow: 'auto' }}>
              {isLoading && <div>Loading templates...</div>}
              {error && (
                <div style={{ color: 'red', padding: '10px' }}>
                  {error}
                </div>
              )}
              
              <h3 style={{ margin: '20px 0 10px' }}>My Personal Templates</h3>
              <div 
                style={{
                  background: '#f5f5f5',
                  padding: '20px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}
              >
                <Button
                  icon="plus"
                  intent={Intent.PRIMARY}
                  onClick={toggleCreateTemplate}
                  style={{
                    width: '100px',
                    height: '100px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '0 auto',
                    gap: '10px',
                    borderRadius: '8px'
                  }}
                >
                </Button>
                <p style={{ marginTop: '10px', color: '#666' }}>
                  Create or upload a custom template
                </p>
              </div>

              <ImagesGrid
                images={personalTemplates.map(template => ({
                  id: template.uid,
                  src: template.thumbnail_url,
                  preview: template.thumbnail_url,
                  name: template.name,
                  description: template.description
                }))}
                getPreview={(item) => item.preview}
                isLoading={isLoading}
                onSelect={async (item) => {
                  try {
                    const api = new TemplateApiService();
                    const templateDetail = await api.getTemplateById(item.id);
                    if (templateDetail.payload) {
                      store.loadJSON(JSON.parse(templateDetail.payload.content));
                    }
                  } catch (err) {
                    console.error('Failed to load template:', err);
                  }
                }}
                rowsNumber={2}
              />

              <h3 style={{ margin: '20px 0 10px' }}>Gimmefy Templates</h3>
              <ImagesGrid
                images={gimmefyTemplates.map(template => ({
                  id: template.uid,
                  src: template.thumbnail_url,
                  preview: template.thumbnail_url,
                  name: template.name,
                  description: template.description
                }))}
                getPreview={(item) => item.preview}
                isLoading={isLoading}
                onSelect={async (item) => {
                  try {
                    const api = new TemplateApiService();
                    const templateDetail = await api.getTemplateById(item.id);
                    if (templateDetail.payload) {
                      store.loadJSON(JSON.parse(templateDetail.payload.content));
                    }
                  } catch (err) {
                    console.error('Failed to load template:', err);
                  }
                }}
                rowsNumber={2}
              />
            </div>



            </div>
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

        {/* Image Gallery Dialog */}
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


        {/* Add Gimmefy Popup Dialog */}
        <Dialog
  isOpen={isGimmefyPopupOpen}
  onClose={toggleGimmefyPopup}
  title="Gimmefy Popup"
  style={{ width: '500px' }}
>
  <div className="bp3-dialog-body">
    <div 
      style={{
        padding: '15px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        border: '1px solid #ddd',
        marginBottom: '20px'
      }}
    >
      <h3>Hello World</h3>
      <p>Auth Key: {authKey}</p>
      <Button
        icon="add"
        intent={Intent.SUCCESS}
        onClick={() => {
          // Add Hello World text
          store.activePage?.addElement({
            type: 'text',
            x: 50,
            y: 50,
            text: 'Hello World',
            fontSize: 24
          });
          
          // Add Auth Key text below
          store.activePage?.addElement({
            type: 'text',
            x: 50,
            y: 100,
            text: `Auth Key: ${authKey}`,
            fontSize: 16
          });
          
          // Close popup after insertion
          toggleGimmefyPopup();
        }}
      >
        Insert to Canvas
      </Button>
    </div>
  </div>
    <div className="bp3-dialog-footer">
      <Button
        icon="cross"
        intent={Intent.DANGER}
        onClick={toggleGimmefyPopup}
      >
        Close Popup
      </Button>
    </div>
  </Dialog>

  <Dialog
    isOpen={isCreateTemplateOpen}
    onClose={toggleCreateTemplate}
    title="Create New Template"
    style={{ width: '600px' }}
  >
    <div className="bp3-dialog-body">
      <div style={{ padding: '20px' }}>
        <h4>Choose Template Type</h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px',
          marginTop: '20px'
        }}>
          <Button
            icon="upload"
            intent={Intent.PRIMARY}
            style={{ height: '100px' }}
            onClick={() => {
              // Handle upload template logic
              toggleCreateTemplate();
            }}
          >
            Upload Template
          </Button>
          <Button
            icon="build"
            intent={Intent.SUCCESS}
            style={{ height: '100px' }}
            onClick={() => {
              // Handle create from scratch logic
              toggleCreateTemplate();
            }}
          >
            Create from Scratch
          </Button>
        </div>
      </div>
    </div>
    <div className="bp3-dialog-footer">
      <Button
        icon="cross"
        intent={Intent.DANGER}
        onClick={toggleCreateTemplate}
      >
        Cancel
      </Button>
    </div>
  </Dialog>



      </div>
    );
  })
};

export default CustomSection;