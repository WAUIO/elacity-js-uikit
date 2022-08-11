export type ThemeValue = 'light' | 'dark';

export interface IUserPreferences {
  theme?: ThemeValue;
  direction?: 'ltr' | 'rtl';
  lang?: string;
  walletProvider?: string | null;
  searchbar?: boolean;
  sidebarMinimized?: boolean;
}