import {
  ClassAttributes,
  HTMLAttributes,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { Container, Flex, Text, Title } from '@mantine/core';
import { Modal } from '@restart/ui';
import {
  IconCheck,
  IconEdit,
  IconEyeOff,
  IconPlaylistAdd,
  IconTrash,
  IconX,
} from '@tabler/icons-react';

import { ExamplesMoviesModal } from '../../components';
import { useLanguageStore } from '../../store';
import { Data, Words, Wordx } from '../../types/types';
import { getDisplayDate, getNextReviewDate } from '../../utils/index';

import classes from './DndList.module.css';
import styles from './list.module.scss';
import styles2 from './vocabularyOverview.module.scss';

export default function List() {
  const { id } = useParams();
  const { state } = useLocation();
  const { selectedLanguage } = useLanguageStore();

  const [words, setWords] = useState<Words>([]);
  const [show, setShow] = useState(false);
  const [activeWord, setActiveWord] = useState<Wordx>();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(state.listName);

  const fetchUserCreatedListVocabulary = useCallback(
    async (key: string) => {
      const ENDPOINT = `${
        import.meta.env.VITE_BASE_URL
      }/api/vocabulary-translation/lists/${key}?lang=${selectedLanguage}`;

      const response = await fetch(ENDPOINT);
      let data: Data = await response.json();
      // data = data.filter((el) => !el.marked_to_exclude);

      data = data.map((el) => ({
        ...el,
        nextReviewDate: getNextReviewDate(el.learning_level, el.last_answer_ts),
      }));

      const cleaned = data.reduce(function (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        obj: { [x: string]: any },
        item: { word_id: string },
      ) {
        if (
          !Object.prototype.hasOwnProperty.call(obj, item.word_id.split('-')[0])
        ) {
          obj[item.word_id.split('-')[0]] = [item];
        } else {
          obj[item.word_id.split('-')[0]] = [
            ...obj[item.word_id.split('-')[0]],
            item,
          ];
        }

        return obj;
      }, {});

      setWords(Object.values(cleaned));
    },
    [selectedLanguage],
  );

  const items = words
    .filter((word) => !word[0].marked_to_exclude)
    .map((el) => [...el])
    .sort((a, b) => {
      if (a[0].nextReviewDate === null) {
        return 1;
      }
      if (b[0].nextReviewDate === null) {
        return -1;
      }
      return (
        new Date(a[0].nextReviewDate).getTime() -
        new Date(b[0].nextReviewDate).getTime()
      );
    })
    .map((item, id) => (
      <div
        key={id}
        className={classes.item}
        onClick={() => {
          setShow(true);
          setActiveWord(item[0]);
        }}
      >
        <div>
          <Text>{item[0].word_id.split('-')[0]}</Text>
          {item.map((item, i) => (
            <Text key={i} c='blue' size='lg'>
              {item.word_id.split('-')[1]} - {item.info?.[0].glosses}
            </Text>
          ))}
        </div>
        <Flex gap='lg'>
          {getDisplayDate(
            getNextReviewDate(item[0].learning_level, item[0].last_answer_ts),
          )}
          <IconPlaylistAdd
            size={24}
            color='blue'
            stroke={2}
            strokeLinejoin='miter'
          />
          <IconEyeOff
            size={24}
            color='gray'
            stroke={2}
            strokeLinejoin='miter'
          />
          <IconTrash
            onClick={() => handleExcludeClick(item)}
            size={24}
            color='red'
            stroke={2}
            strokeLinejoin='round'
          />
        </Flex>
      </div>
    ));

  useEffect(() => {
    if (id) {
      fetchUserCreatedListVocabulary(id);
    }
  }, [fetchUserCreatedListVocabulary, id]);

  const handleFormSubmit = async (
    word: string,
    isLearning: boolean,
    isExcluded: boolean,
  ) => {
    const ENDPOINT = `${import.meta.env.VITE_BASE_URL}/api/words/status`;
    const payload = {
      word,
      markedToLearn: isLearning,
      markedToExclude: isExcluded,
    };

    const response = await fetch(`${ENDPOINT}`, {
      method: 'POST',
      headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      // // Utility function to deeply clone and update the state
      const updateNestedState = (words: Words, id: string): Words => {
        return words.map((wordList) =>
          wordList.map((word) =>
            word.word_id === id
              ? {
                  ...word,
                  marked_to_learn: isLearning,
                  marked_to_exclude: isExcluded,
                }
              : word,
          ),
        );
      };

      setWords((prevWords) => updateNestedState(prevWords, word));
    }
  };

  const handleExcludeClick = (word: { word_id: string }[]) => {
    word.forEach((el) => handleFormSubmit(el.word_id, false, true));
  };

  const handleLearnClick = (word: { word_id: string }[]) => {
    word.forEach((el) => handleFormSubmit(el.word_id, true, false));
  };

  const handleRenameTitle = async () => {
    const ENDPOINT = `${import.meta.env.VITE_BASE_URL}/api/user-created-list`;

    const payload = { listId: id, newName };

    try {
      const response = await fetch(ENDPOINT, {
        method: 'PUT',
        headers: {
          Accept: 'application.json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      } else {
        state.listName = newName;
        setIsEditing(false);
      }
    } catch (e) {
      alert(e);
    }
  };

  return (
    <Container size='lg'>
      <div className={styles.titleContainer}>
        {!isEditing ? (
          <>
            <Flex align='baseline' my='lg'>
              <Title>{state.listName}</Title>
              <IconEdit
                color='gray'
                size={20}
                onClick={() => setIsEditing(true)}
              />
            </Flex>
          </>
        ) : (
          <div className={styles.editingContainer}>
            <input
              type='text'
              value={newName}
              onChange={(e: { target: { value: unknown } }) =>
                setNewName(e.target.value)
              }
            />
            <IconCheck onClick={handleRenameTitle} />
            <IconX
              onClick={() => {
                setIsEditing(false);
                setNewName(state.listName);
              }}
            />
          </div>
        )}
      </div>
      <Title order={2} mb='lg'>
        Learning
      </Title>
      <ul style={{ listStyle: 'none', padding: '0' }}>{items}</ul>
      <Title order={2} mb='lg'>
        Excluded
      </Title>
      <ul style={{ listStyle: 'none', padding: '0' }}>
        {words
          .filter((word) => word[0].marked_to_exclude)
          .map((el, i) => (
            <li key={i} className={styles.rowContainer}>
              <div className={styles.wordCard}>
                <div>
                  <p>{el[0].word_id.split('-')[0]}</p>
                  {el.map((el, i) => (
                    <p key={i}>
                      {el.word_id.split('-')[1]} - {el.info[0].glosses}
                    </p>
                  ))}
                </div>
              </div>
              <button onClick={() => handleLearnClick(el)}>Learn</button>
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
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ flex: '1' }}>
            <ExamplesMoviesModal activeWord={activeWord!} resourceKey={''} />
          </div>
          <div className={styles2.toolbar}>
            <button className={styles2.button} onClick={() => setShow(false)}>
              Close
            </button>
            <button
              className={styles2.button}
              onClick={() => {
                handleLearnClick([{ word_id: activeWord?.word_id ?? '' }]);
                setShow(false);
              }}
            >
              Learn
            </button>
            <button
              className={styles2.button}
              onClick={() => {
                handleExcludeClick([{ word_id: activeWord?.word_id ?? '' }]);
                setShow(false);
              }}
            >
              Exclude
            </button>
          </div>
        </div>
      </Modal>
    </Container>
  );
}
