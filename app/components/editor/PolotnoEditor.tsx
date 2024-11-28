"use client";

import { useEffect, useRef } from 'react';
import { createStore } from '@polotno/core';
import { Workspace } from '@polotno/workspace';
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { DEFAULT_SECTIONS } from '@polotno/side-panel';
import { Toolbar } from '@polotno/toolbar/toolbar';
import { ZoomButtons } from '@polotno/toolbar/zoom-buttons';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/popover2/lib/css/blueprint-popover2.css';

const PolotnoEditor = () => {
  const store = useRef(createStore({
    key: process.env.NEXT_PUBLIC_POLOTNO_API_KEY || 'nFA5H9elEytDyPyvKL7T',
    showCredit: true
  }));

  useEffect(() => {
    // Create a default page if none exists
    if (store.current.pages.length === 0) {
      store.current.addPage();
    }
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <PolotnoContainer>
        <SidePanelWrap>
          <DEFAULT_SECTIONS store={store.current} />
        </SidePanelWrap>
        <WorkspaceWrap>
          <Toolbar store={store.current} downloadButtonEnabled />
          <Workspace store={store.current} />
          <ZoomButtons store={store.current} />
        </WorkspaceWrap>
      </PolotnoContainer>
    </div>
  );
};

export default PolotnoEditor;