// components/editor/CustomFontSection.tsx
"use client";

import React from 'react';
import { SectionTab } from 'polotno/side-panel';
import { observer } from 'mobx-react-lite';
import { Icon } from '@blueprintjs/core';
import { DEFAULT_SECTIONS } from 'polotno/side-panel';
import type { StoreType } from 'polotno/model/store';

// Find the default text section that includes font handling
const TextSection = DEFAULT_SECTIONS.find(
  (section) => section.name === 'text'
);

export const CustomFontSection = {
  name: 'fonts',
  Tab: observer(({ store }) => (
    <SectionTab name="fonts" title="Fonts">
      <Icon icon="font" />
    </SectionTab>
  )),
  // Use Polotno's default text panel which includes font handling
  Panel: TextSection?.Panel
};

export default CustomFontSection;