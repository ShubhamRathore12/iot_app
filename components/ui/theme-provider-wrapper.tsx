import { ThemeProviderCustom } from '@/providers/theme';
import React from 'react';

interface ThemeProviderWrapperProps {
  children: React.ReactNode;
}

const ThemeProviderWrapper: React.FC<ThemeProviderWrapperProps> = ({ children }) => {
  return (
    <ThemeProviderCustom>
      {children}
    </ThemeProviderCustom>
  );
};

export default ThemeProviderWrapper;