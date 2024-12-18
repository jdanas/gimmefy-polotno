import { createContext, useContext } from 'react';

export interface BrandKitConfig {
  brand_kit_uid: string;
  initial_size?: string;
  project_uid?: string;
}

export const BrandKitContext = createContext<BrandKitConfig>({
  brand_kit_uid: '',
});

export const useBrandKit = () => useContext(BrandKitContext);