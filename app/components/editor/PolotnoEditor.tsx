"use client";

import { useEffect, useRef } from 'react';
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { PagesTimeline } from 'polotno/pages-timeline';
import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import { SidePanel } from 'polotno/side-panel';
import { Workspace } from 'polotno/canvas/workspace';

import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/popover2/lib/css/blueprint-popover2.css';

import { createStore } from 'polotno/model/store';

const PolotnoEditor = () => {
  const store = useRef(createStore({
    key: process.env.NEXT_PUBLIC_POLOTNO_API_KEY || 'nFA5H9elEytDyPyvKL7T',
    showCredit: true
  }));

  useEffect(() => {
    if (store.current.pages.length === 0) {
      store.current.addPage();
    }
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <PolotnoContainer>
        <SidePanelWrap>
          <SidePanel store={store.current} />
        </SidePanelWrap>
        <WorkspaceWrap>
          <Toolbar store={store.current} downloadButtonEnabled />
          <Workspace store={store.current} />
          <ZoomButtons store={store.current} />
          <PagesTimeline store={store.current} />
        </WorkspaceWrap>
      </PolotnoContainer>
    </div>
  );
};

export default PolotnoEditor;