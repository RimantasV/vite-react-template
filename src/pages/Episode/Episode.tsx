import { Modal } from '@restart/ui';
import { ClassAttributes, HTMLAttributes, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ExamplesMoviesModal from '../../components/ExamplesMoviesModal';

import styles2 from '../List/vocabularyOverview.module.scss';
import styles from './movie.module.scss';

import {
  IconBook,
  IconBrain,
  IconCheck,
  IconEyeOff,
  IconPlus,
} from '@tabler/icons-react';

import { Button, Container, Flex, rem, Tabs, Title } from '@mantine/core';
import { useResourceStatusQuery, usetoggleFollowQuery } from '../../queries';
import { Words } from '../../types/types';
import Items from './Items';

export default function Episode() {
  const iconStyle = { width: rem(12), height: rem(12) };

  const { id, episode } = useParams();
  console.log(id, episode);
  // const { state } = useLocation();

  const [words, setWords] = useState<Words>([]);
  const [show, setShow] = useState(false);
  const [activeWord, setActiveWord] = useState<string>('');
  // const [newName, setNewName] = useState(state.listName);
  const [isFollowing, setIsFollowing] = useState(false);

  const {
    // isPending: isPendingToggleQuery,
    // isError: isErrorToggleQuery,
    // data: toggleQueryData,
    // error: toggleQueryError,
    refetch: refetchToggleQuery,
  } = usetoggleFollowQuery('movie', id!, 'n/a', setIsFollowing);

  const {
    isPending: isPendingResourceStatus,
    // isError: isErrorResourceStatus,
    data: resourceStatusData,
    // error: resourceStatusError,
  } = useResourceStatusQuery(id!);

  useEffect(() => {
    setIsFollowing(resourceStatusData);
  }, [resourceStatusData]);

  const handleFormSubmit = async (
    word: string,
    isLearning: boolean,
    isExcluded: boolean
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
            word.word === id
              ? {
                  ...word,
                  marked_to_learn: isLearning,
                  marked_to_exclude: isExcluded,
                }
              : word
          )
        );
      };

      setWords((prevWords) => updateNestedState(prevWords, word));
    }
  };

  const handleExcludeClick = (word: { word: string }[]) => {
    word.forEach((el) => handleFormSubmit(el.word, false, true));
  };

  const handleLearnClick = (word: { word: string }[]) => {
    word.forEach((el) => handleFormSubmit(el.word, true, false));
  };

  const handleToggleFollowing = () => {
    refetchToggleQuery();
  };

  return (
    <Container size='lg'>
      <div className={styles.titleContainer}>
        {
          <>
            <Flex align='baseline' my='lg'>
              <Title>{id}</Title>
            </Flex>
          </>
        }
      </div>
      <Button
        onClick={handleToggleFollowing}
        my='lg'
        loading={isPendingResourceStatus}
        loaderProps={{ type: 'oval' }}
        leftSection={
          isFollowing ? <IconCheck size={14} /> : <IconPlus size={14} />
        }
      >
        {isFollowing ? 'Following' : 'Follow'}
      </Button>
      <Tabs defaultValue='gallery'>
        <Tabs.List>
          <Tabs.Tab
            value='gallery'
            leftSection={<IconBook style={iconStyle} />}
          >
            Learning
          </Tabs.Tab>
          <Tabs.Tab
            value='messages'
            leftSection={<IconBrain style={iconStyle} />}
          >
            Known
          </Tabs.Tab>
          <Tabs.Tab
            value='settings'
            leftSection={<IconEyeOff style={iconStyle} />}
          >
            Excluded
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='gallery'>
          <Title order={2} my='lg'>
            Learning
          </Title>
          <Items
            id={id!}
            episode={episode!}
            setShow={setShow}
            setActiveWord={setActiveWord}
            handleExcludeClick={handleExcludeClick}
          />
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
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ flex: '1' }}>
                <ExamplesMoviesModal
                  activeWord={activeWord}
                  resourceKey={id!}
                  episode={episode!}
                />
              </div>
              <div className={styles2.toolbar}>
                <button
                  className={styles2.button}
                  onClick={() => setShow(false)}
                >
                  Close
                </button>
                <button
                  className={styles2.button}
                  onClick={() => {
                    handleLearnClick([{ word: activeWord }]);
                    setShow(false);
                  }}
                >
                  Learn
                </button>
                <button
                  className={styles2.button}
                  onClick={() => {
                    handleExcludeClick([{ word: activeWord }]);
                    setShow(false);
                  }}
                >
                  Exclude
                </button>
              </div>
            </div>
          </Modal>
        </Tabs.Panel>

        <Tabs.Panel value='messages'>Known tab content</Tabs.Panel>

        <Tabs.Panel value='settings'>
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
                      <p>{el[0].word.split('-')[0]}</p>
                      {el.map((el, i) => (
                        <p key={i}>
                          {el.word.split('-')[1]} - {el.info[0].glosses}
                        </p>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => handleLearnClick(el)}>Learn</button>
                </li>
              ))}
          </ul>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
