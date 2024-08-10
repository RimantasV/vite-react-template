import { create } from 'zustand';
import { Languages } from '../types';

interface LanguageState {
  selectedLanguage: Languages;
  setSelectedLanguage: (language: Languages) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  selectedLanguage: Languages.es,
  setSelectedLanguage: (language: Languages) =>
    set({ selectedLanguage: language }),
}));
