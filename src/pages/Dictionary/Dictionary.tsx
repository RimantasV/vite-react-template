import { ChangeEvent, useCallback, useState } from 'react';

import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import {
  AddWordToListModal,
  DictionaryTranslationCard,
} from '../../components';
import { useLanguageStore } from '../../store';
import { EnglishTranslation } from '../../types/types';

type Word = { word_id: string; info: EnglishTranslation };

export default function Dictionary() {
  const { selectedLanguage } = useLanguageStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeWord, setActiveWord] = useState('');
  const [words, setWords] = useState<Word[]>([]);
  const [opened, { open, close }] = useDisclosure(false);

  const handleSetSearchTerm = (text: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(text.target.value);
  };

  const fetchWords = useCallback(async () => {
    const ENDPOINT = `${
      import.meta.env.VITE_BASE_URL
    }/api/dictionary/search/${searchTerm}?lang=${selectedLanguage?.language_id}`;

    const response = await fetch(ENDPOINT);
    const data = await response.json();

    setWords(data);
  }, [searchTerm, selectedLanguage]);

  const handleSearch = () => {
    if (searchTerm) {
      fetchWords();
    }
  };

  const handleLearn = (word: Word) => {
    // fetchUserCreatedLists();
    setActiveWord(word.word_id);
    open();
  };

  return (
    <div>
      <div>Search Dictionary</div>
      <input
        id='word'
        name='word'
        placeholder='search...'
        style={{ fontSize: '16px' }}
        type='text'
        value={searchTerm}
        onChange={(x) => handleSetSearchTerm(x)}
      />
      <button onClick={handleSearch}>Search</button>
      <ul style={{ listStyle: 'none' }}>
        {words.map((word) => (
          <li key={word.word_id} style={{ display: 'flex', flex: '1' }}>
            <DictionaryTranslationCard
              wordId={word.word_id}
              englishTranslation={word?.info}
            />
            <button
              onClick={() => handleLearn(word)}
              style={{
                marginBottom: '15px',
                color: 'white',
                backgroundColor: '#4242b6',
                border: 'none',
                alignSelf: 'center',
                padding: '15px 30px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Learn
            </button>
          </li>
        ))}
      </ul>

      <Modal opened={opened} onClose={close} withCloseButton={false} centered>
        <AddWordToListModal close={close} activeWord={activeWord} />
      </Modal>
    </div>
  );
}
