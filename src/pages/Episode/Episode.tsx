import { ClassAttributes, HTMLAttributes, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Button, Container, Flex, Tabs, Title, rem } from '@mantine/core';
import { Modal } from '@restart/ui';
import { IconBook, IconCheck, IconEyeOff, IconPlus } from '@tabler/icons-react';

import { ExamplesMoviesModal } from '../../components';
import {
  useResourceStatusQuery,
  useToggleFollowQuery,
  useUpdateWordStatusMutation,
} from '../../queries';
import { useLanguageStore } from '../../store';
import { Words, Wordx } from '../../types/types';
import Items from './Items';

import styles2 from '../List/vocabularyOverview.module.scss';
import styles from './movie.module.scss';

export default function Episode() {
  const { selectedLanguage } = useLanguageStore();
  const iconStyle = { width: rem(12), height: rem(12) };

  const { id, episode } = useParams();
  // const { state } = useLocation();

  const [words] = useState<Words>([]);
  const [show, setShow] = useState(false);
  const [activeWord, setActiveWord] = useState<Wordx>();
  // const [newName, setNewName] = useState(state.listName);
  const [isFollowing, setIsFollowing] = useState(false);
  const { mutate, isPending: isPendingUpdateWordStatus } =
    useUpdateWordStatusMutation();
  const {
    // isPending: isPendingToggleQuery,
    // isError: isErrorToggleQuery,
    // data: toggleQueryData,
    // error: toggleQueryError,
    refetch: refetchToggleQuery,
  } = useToggleFollowQuery(selectedLanguage, '', setIsFollowing);

  const {
    isPending: isPendingResourceStatus,
    // isError: isErrorResourceStatus,
    data: resourceStatusData,
    // error: resourceStatusError,
  } = useResourceStatusQuery(id!);

  useEffect(() => {
    setIsFollowing(resourceStatusData);
  }, [resourceStatusData]);

  // const handleFormSubmit = async (
  //   word: string,
  //   isLearning: boolean,
  //   isExcluded: boolean
  // ) => {
  //   const ENDPOINT = `${import.meta.env.VITE_BASE_URL}/api/words/progress`;
  //   const payload = {
  //     word,
  //     markedToLearn: isLearning,
  //     markedToExclude: isExcluded,
  //   };

  //   const response = await fetch(`${ENDPOINT}`, {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application.json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(payload),
  //   });

  //   if (response.ok) {
  //     // // Utility function to deeply clone and update the state
  //     const updateNestedState = (words: Words, id: string): Words => {
  //       return words.map((wordList) =>
  //         wordList.map((word) =>
  //           word.word === id
  //             ? {
  //                 ...word,
  //                 marked_to_learn: isLearning,
  //                 marked_to_exclude: isExcluded,
  //               }
  //             : word
  //         )
  //       );
  //     };

  //     setWords((prevWords) => updateNestedState(prevWords, word));
  //   }
  // };

  const handleExcludeClick = (word: Wordx[]) => {
    // word.forEach((el) => handleFormSubmit(el.word, false, true));
    word.forEach((el) =>
      mutate({ word: el, isLearning: false, isExcluded: true }),
    );
  };

  const handleLearnClick = (word: Wordx[]) => {
    // word.forEach((el) => handleFormSubmit(el.word, true, false));
    word.forEach((el) =>
      mutate({ word: el, isLearning: false, isExcluded: true }),
    );
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
            // resource='series'
            // id={id!}
            // episode={episode!}
            mediaItemId={mediaItemId}
            setShow={setShow}
            setActiveWord={setActiveWord}
            handleExcludeClick={handleExcludeClick}
            isPendingUpdateWordStatus={isPendingUpdateWordStatus}
          />
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
                <ExamplesMoviesModal
                  activeWord={activeWord!}
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
                    handleLearnClick([activeWord!]);
                    setShow(false);
                  }}
                >
                  Learn
                </button>
                <button
                  className={styles2.button}
                  onClick={() => {
                    handleExcludeClick([activeWord!]);
                    setShow(false);
                  }}
                >
                  Exclude
                </button>
              </div>
            </div>
          </Modal>
        </Tabs.Panel>
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
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
