// components/editor/CustomHelloSection.tsx
"use client";

import React from 'react';
import { SectionTab, SectionContent } from 'polotno/side-panel';
import type { StoreType } from 'polotno/model/store';
import { observer } from 'mobx-react-lite';
import { Icon } from '@blueprintjs/core';

interface CustomHelloSectionProps {
  store: StoreType;
}

export const CustomHelloSection = {
    name: 'custom',
    Tab: (props) => (
      <SectionTab name="Custom" {...props}>
        <Icon icon="hand" />
      </SectionTab>
    ),
    // we need observer to update component automatically on any store changes
    Panel: observer(({ store }) => {
      return (
        <div>
          <p>Here we will define our own custom tab.</p>
          <p>Elements on the current page: {store.activePage?.children.length}</p>
        </div>
      );
    }),
};
