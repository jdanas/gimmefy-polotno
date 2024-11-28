// components/editor/CustomHelloSection.tsx
"use client";

import React, { useState } from 'react';
import { SectionTab, SectionContent } from 'polotno/side-panel';
import type { StoreType } from 'polotno/model/store';
import { observer } from 'mobx-react-lite';
import { Icon } from '@blueprintjs/core';

interface CustomHelloSectionProps {
  store: StoreType;
}

const tabs = [
  { id: 'tab1', label: 'Info', icon: 'info-sign' },
  { id: 'tab2', label: 'Settings', icon: 'cog' },
  { id: 'tab3', label: 'Help', icon: 'help' },
];

export const CustomHelloSection = {
  name: 'custom',
  Tab: (props) => (
    <SectionTab name="Custom" {...props}>
      <Icon icon="hand" />
    </SectionTab>
  ),
  Panel: observer(({ store }) => {
    const [activeTab, setActiveTab] = useState('tab1');

    return (
      <div style={{ padding: '20px' }}>
        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '20px',
          borderBottom: '1px solid #ddd',
          paddingBottom: '10px'
        }}>
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
                gap: '5px'
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
            <h3>Information</h3>
            <p>Elements on the current page: {store.activePage?.children.length}</p>
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