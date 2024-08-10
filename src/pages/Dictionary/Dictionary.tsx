import {
  ChangeEvent,
  ClassAttributes,
  HTMLAttributes,
  useCallback,
  useState,
} from 'react';

import { Modal } from '@restart/ui';

import { useLanguageStore } from '../../store';
import { EnglishTranslation } from '../../types/types';

import styles2 from './dictionary.module.scss';
import styles from './examples.module.scss';

type Word = { word_id: string; info: EnglishTranslation };

type List = { custom_item_id: number; title: string };

export default function Dictionary() {
  const { selectedLanguage } = useLanguageStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeWord, setActiveWord] = useState('');
  const [words, setWords] = useState<Word[]>([]);
  const [show, setShow] = useState(false);
  const [lists, setLists] = useState<List[]>([]);

  const handleSetSearchTerm = (text: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(text.target.value);
  };

  const fetchUserCreatedLists = async () => {
    const ENDPOINT = `${
      import.meta.env.VITE_BASE_URL
    }/api/user-created-lists?lang=${selectedLanguage}`;

    const response = await fetch(ENDPOINT);
    const data = await response.json();

    setLists(data);
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
    fetchUserCreatedLists();
    setActiveWord(word.word_id);
    setShow(true);
  };

  const fetchAddWordToList = async (id: number) => {
    const ENDPOINT = `${
      import.meta.env.VITE_BASE_URL
    }/api/user-created-list/word?lang=${selectedLanguage}`;

    const payload = { listId: id, word: activeWord };

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application.json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
    } catch (e) {
      alert(e);
    }
  };

  const handleAddWordToList = (id: number) => {
    fetchAddWordToList(id);
    setShow(false);
  };

  const fetchCreateNewList = async () => {
    const ENDPOINT = `${
      import.meta.env.VITE_BASE_URL
    }/api/user-created-lists/list-word?lang=${selectedLanguage}`;

    const payload = { word: activeWord };

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application.json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
    } catch (e) {
      alert(e);
    }
  };

  const handleCreateNewList = () => {
    fetchCreateNewList();
    setShow(false);
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
      <Modal
        show={show}
        aria-labelledby='modal-1-label'
        onHide={() => setShow(false)}
        renderBackdrop={(
          props: JSX.IntrinsicAttributes &
            ClassAttributes<HTMLDivElement> &
            HTMLAttributes<HTMLDivElement>,
        ) => <div {...props} className={styles2.backdrop} />}
        className={styles2.modal}
      >
        <div>
          <ul style={{ listStyle: 'none', padding: '0' }}>
            {lists.map((list) => (
              <li
                onClick={() => handleAddWordToList(list.custom_item_id)}
                key={list.custom_item_id}
                className={styles2.listItem}
              >
                {list.title}
              </li>
            ))}
          </ul>
          <button onClick={handleCreateNewList}>Create new</button>
        </div>
      </Modal>
    </div>
  );
}
