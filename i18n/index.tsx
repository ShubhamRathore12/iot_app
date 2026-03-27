import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export type Locale = 'en' | 'de';

type Dict = Record<string, string>;

const en: Dict = {
  app_title: 'Grain Technik',
  login_title: 'Sign in',
  username: 'Email or Username',
  email: 'Email',
  password: 'Password',
  sign_in: 'Sign in',
  registering: 'Register',
  contact_us: 'Contact us',
  devices: 'Devices',
  reports: 'Reports',
  home: 'Home',
  explore: 'Explore',
  logout: 'Log out',
  theme: 'Theme',
  light: 'Light',
  dark: 'Dark',
  system: 'System',
  language: 'Language',
};

const de: Dict = {
  app_title: 'Grain Technik',
  login_title: 'Anmelden',
  username: 'E-Mail oder Benutzername',
  email: 'E-Mail',
  password: 'Passwort',
  sign_in: 'Anmelden',
  registering: 'Registrieren',
  contact_us: 'Kontakt',
  devices: 'Geräte',
  reports: 'Berichte',
  home: 'Start',
  explore: 'Entdecken',
  logout: 'Abmelden',
  theme: 'Thema',
  light: 'Hell',
  dark: 'Dunkel',
  system: 'System',
  language: 'Sprache',
};

const dictionaries: Record<Locale, Dict> = { en, de };

const I18nContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (k: keyof typeof en) => string;
} | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  const t = useMemo(() => {
    const dict = dictionaries[locale];
    return (k: keyof typeof en) => dict[k] ?? String(k);
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

