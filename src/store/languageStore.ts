import { create } from 'zustand';

import { Language } from '../types';

interface LanguageState {
  selectedLanguage: Language | null;
  setSelectedLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  selectedLanguage: null,
  setSelectedLanguage: (language: Language) =>
    set({ selectedLanguage: language }),
}));
