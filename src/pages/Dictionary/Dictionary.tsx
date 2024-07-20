import {
  ChangeEvent,
  ClassAttributes,
  HTMLAttributes,
  useCallback,
  useState,
} from 'react';

import styles from './examples.module.scss';
import styles2 from './dictionary.module.scss';
import { EnglishTranslation } from '../../types/types';
import { Modal } from '@restart/ui';

type Word = { word: string; info: EnglishTranslation };

type List = { id: number; list_name: string };

export default function Dictionary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeWord, setActiveWord] = useState('');
  const [words, setWords] = useState<Word[]>([]);
  const [show, setShow] = useState(false);
  const [lists, setLists] = useState<List[]>([]);

  const handleSetSearchTerm = (text: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(text.target.value);
  };

  const fetchUserCreatedLists = async () => {
    const ENDPOINT = `${import.meta.env.VITE_BASE_URL}/api/user-created-lists`;

    const response = await fetch(ENDPOINT);
    const data = await response.json();

    setLists(data);
  };

  const fetchWords = useCallback(async () => {
    const ENDPOINT = `${
      import.meta.env.VITE_BASE_URL
    }/api/dictionary/search/${searchTerm}`;

    const response = await fetch(ENDPOINT);
    const data = await response.json();

    setWords(data);
  }, [searchTerm]);

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
          ['Argentina', 'Costa-Rica', 'Mexico', 'Spain'].includes(el)
        )
      ) {
        const countryCode = getCountryCode(
          tags.filter((el) =>
            ['Argentina', 'Costa-Rica', 'Mexico', 'Spain'].includes(el)
          )
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
    setActiveWord(word.word);
    setShow(true);
  };

  const fetchAddWordToList = async (id: number) => {
    const ENDPOINT = `${
      import.meta.env.VITE_BASE_URL
    }/api/user-created-list/word`;

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
    }/api/user-created-lists/list-word`;

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
          <li key={word.word} style={{ display: 'flex', flex: '1' }}>
            <div
              className={styles.translationsCard}
              style={{ flex: '1', marginRight: '20px' }}
            >
              <div className={styles.headerContainer}>
                <h2>{word.word?.split('-')[0]}</h2>
                <p>{word.word?.split('-')[1]}</p>
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
            HTMLAttributes<HTMLDivElement>
        ) => <div {...props} className={styles2.backdrop} />}
        className={styles2.modal}
      >
        <div>
          <ul style={{ listStyle: 'none', padding: '0' }}>
            {lists.map((list) => (
              <li
                onClick={() => handleAddWordToList(list.id)}
                key={list.id}
                className={styles2.listItem}
              >
                {list.list_name}
              </li>
            ))}
          </ul>
          <button onClick={handleCreateNewList}>Create new</button>
        </div>
      </Modal>
    </div>
  );
}
