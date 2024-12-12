// PolotnoEditor.tsx
"use client";

import { useEffect, useRef } from 'react';
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { PagesTimeline } from 'polotno/pages-timeline';
import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import { SidePanel } from 'polotno/side-panel';
import { Workspace } from 'polotno/canvas/workspace';
import { createStore } from 'polotno/model/store';
import { DEFAULT_SECTIONS } from 'polotno/side-panel';
import type { Section } from 'polotno/side-panel';
import { CustomSection } from './CustomSection';
import { createContext } from 'react';
import CustomToolbar from './CustomToolbar';

import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/popover2/lib/css/blueprint-popover2.css';
import './Editor.css';

export const CustomDataContext = createContext<{
  authKey: string;
  onPanelClick?: () => void;
}>({ authKey: '' });

const DUMMY_AUTH_KEY = `test-auth-key-${Math.random().toString(36).substr(2, 9)}`;

interface PolotnoEditorProps {
  authKey?: string;
  onPanelClick?: () => void;
}

const PolotnoEditor = ({ authKey = DUMMY_AUTH_KEY, onPanelClick }: PolotnoEditorProps) => {
  const store = useRef(createStore({
    key: process.env.NEXT_PUBLIC_POLOTNO_API_KEY || 'nFA5H9elEytDyPyvKL7T',
    showCredit: true
  }));

  useEffect(() => {
    if (store.current.pages.length === 0) {
      store.current.addPage();
    }
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'textToImage') {
        window.parent.postMessage({ type: 'textToImage', data: {} }, '*');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const filteredDefaultSections = DEFAULT_SECTIONS.filter(section => 
    ![
      'templates',
      'photos',
    ].includes(section.name.toLowerCase())
  );

  const sections: Section[] = [
    CustomSection,
    ...filteredDefaultSections
  ];

  const handleTemplateSaved = () => {
    // You could either reload the page
    window.location.reload();
    
    // Or just refresh the templates list if you have that functionality
    // refreshTemplates();
  };

  return (
    <div id="vividly-app" style={{ width: '100vw', height: '100vh' }}>
      <PolotnoContainer>
        <CustomDataContext.Provider value={{ authKey, onPanelClick }}>
          <SidePanelWrap>
            <SidePanel store={store.current} sections={sections} />
          </SidePanelWrap>
          <WorkspaceWrap>
            <CustomToolbar 
              store={store.current} 
              onTemplateSaved={handleTemplateSaved}
            />
            <Workspace store={store.current} />
            <ZoomButtons store={store.current} />
            <PagesTimeline store={store.current} />
          </WorkspaceWrap>
        </CustomDataContext.Provider>
      </PolotnoContainer>
    </div>
  );
};

export default PolotnoEditor;