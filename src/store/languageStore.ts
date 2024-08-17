import { StateCreator, create } from 'zustand';
import { PersistOptions, createJSONStorage, persist } from 'zustand/middleware';

import { Language } from '../types';

interface LanguageState {
  selectedLanguage: Language | null;
  setSelectedLanguage: (language: Language) => void;
}

type MyPersist = (
  config: StateCreator<LanguageState>,
  options: PersistOptions<LanguageState>,
) => StateCreator<LanguageState>;

export const useLanguageStore = create<LanguageState>(
  (persist as MyPersist)(
    (set) => ({
      selectedLanguage: null,
      setSelectedLanguage: (language: Language) =>
        set({ selectedLanguage: language }),
    }),
    {
      name: 'language',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
