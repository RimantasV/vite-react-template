import { ChangeEvent, useCallback, useState } from 'react';

import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { AddWordToListModal } from '../../components';
import { useLanguageStore } from '../../store';
import { EnglishTranslation } from '../../types/types';

import styles from './examples.module.scss';

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
    }/api/dictionary/search/${searchTerm}?lang=${selectedLanguage}`;

    const response = await fetch(ENDPOINT);
    const data = await response.json();

    setWords(data);
  }, [searchTerm, selectedLanguage]);

  const handleSearch = () => {
    if (searchTerm) {
      fetchWords();
    }
  };

  const getCountryCode = (el: string[]) => {
    const country = el[0];

    switch (country) {
      case 'Argentina':
        return 'AR';
      case 'Mexico':
        return 'MX';
      case 'Costa-Rica':
        return 'CR';
      case 'Spain':
        return 'ES';

      default:
        return '';
    }
  };

  const renderFlag = (tags: string | string[] | undefined) => {
    if (Array.isArray(tags)) {
      if (
        tags.some((el) =>
          ['Argentina', 'Costa-Rica', 'Mexico', 'Spain'].includes(el),
        )
      ) {
        const countryCode = getCountryCode(
          tags.filter((el) =>
            ['Argentina', 'Costa-Rica', 'Mexico', 'Spain'].includes(el),
          ),
        );
        return (
          <img
            title={countryCode}
            src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode}.svg`}
          />
        );
      }
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
            <div
              className={styles.translationsCard}
              style={{ flex: '1', marginRight: '20px' }}
            >
              <div className={styles.headerContainer}>
                <h2>{word.word_id?.split('-')[0]}</h2>
                <p>{word.word_id?.split('-')[1]}</p>
              </div>
              <div className={styles.languageContainer}>
                <div className={styles.flagContainer}>
                  <img
                    title={'us'}
                    src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg`}
                  />
                </div>
                <ol>
                  {word?.info?.translation?.map((el, i) => (
                    <li key={i}>
                      {renderFlag(el.tags)}
                      {/* {`${el.glosses} (${el.tags?.join(' ')})`} */}
                      {`${el.glosses} `}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
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
