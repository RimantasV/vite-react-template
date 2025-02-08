import { SetStateAction, useEffect, useState } from 'react';

import ReaderModeComponent from './ReaderModeComponent';
import SavedTextsListComponent from './SavedTextsListComponent';
import TextInputComponent from './TextInputComponent';

export type SavedText = { id: string; text: string };

const Reader = () => {
  const [savedTexts, setSavedTexts] = useState<SavedText[]>([]);
  const [selectedText, setSelectedText] = useState<SavedText>();

  useEffect(() => {
    const storedTexts = JSON.parse(localStorage.getItem('savedTexts')!) || [];
    setSavedTexts(storedTexts);
  }, []);

  const handleSave = (savedText: SavedText) => {
    const updatedTexts = [...savedTexts, savedText];
    setSavedTexts(updatedTexts);
    localStorage.setItem('savedTexts', JSON.stringify(updatedTexts));
  };

  const handleSelectText = (
    savedText: SetStateAction<SavedText | undefined>,
  ) => {
    setSelectedText(savedText);
  };

  const handleBack = () => {
    setSelectedText(undefined);
  };

  return (
    <div>
      {selectedText ? (
        <ReaderModeComponent text={selectedText.text} onBack={handleBack} />
      ) : (
        <>
          <TextInputComponent onSave={handleSave} />
          <SavedTextsListComponent
            savedTexts={savedTexts}
            onSelectText={handleSelectText}
          />
        </>
      )}
    </div>
  );
};

export default Reader;
