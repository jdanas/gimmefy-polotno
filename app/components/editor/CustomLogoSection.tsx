// components/editor/CustomLogoSection.tsx
"use client";

import React from 'react';
import { SectionTab } from 'polotno/side-panel';
import { observer } from 'mobx-react-lite';
import { Icon } from '@blueprintjs/core';
import { DEFAULT_SECTIONS } from 'polotno/side-panel';

// Find and use the default upload section
const UploadSection = DEFAULT_SECTIONS.find(
  (section) => section.name === 'upload'
);

export const CustomLogoSection = {
  name: 'logos',
  Tab: observer(({ store }) => (
    <SectionTab name="logos" title="Upload Logo">
      <Icon icon="upload" />
    </SectionTab>
  )),
  // Use the default upload panel
  Panel: UploadSection?.Panel
};

export default CustomLogoSection;