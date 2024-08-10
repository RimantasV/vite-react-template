import { useEffect, useState } from 'react';
import { Sheet } from 'react-modal-sheet';
import { useLocation, useParams } from 'react-router-dom';

import {
  Button,
  Container,
  Flex,
  Pagination,
  Tabs,
  Title,
  rem,
} from '@mantine/core';
import { IconBook, IconCheck, IconEyeOff, IconPlus } from '@tabler/icons-react';

import { ExamplesMoviesModal, VocabularyListRow } from '../../components';
import {
  useMovieVocabularyQuery,
  useResourceStatusQuery,
  useToggleFollowQuery,
  useUpdateWordStatusMutation,
} from '../../queries';
import { useLanguageStore } from '../../store';
import { Wordx } from '../../types/types';

// import Items from './Items';
import styles from './movie.module.scss';

export default function Movie() {
  const iconStyle = { width: rem(12), height: rem(12) };
  const { selectedLanguage } = useLanguageStore();
  const { id } = useParams();
  const { state } = useLocation();
  // const [words, setWords] = useState<Words>([]);
  const [activePage, setPage] = useState(1);
  const [isOpen, setOpen] = useState(false);
  // const [show, setShow] = useState(false);
  const [activeWord, setActiveWord] = useState<Wordx>();
  const [isFollowing, setIsFollowing] = useState(false);
  const { mutate } = useUpdateWordStatusMutation();

  const {
    // isPending: isPendingToggleQuery,
    // isError: isErrorToggleQuery,
    // data: toggleQueryData,
    // error: toggleQueryError,
    refetch: refetchToggleQuery,
  } = useToggleFollowQuery(selectedLanguage, state.mediaItemId, setIsFollowing);

  const {
    isPending: isPendingResourceStatus,
    // isError: isErrorResourceStatus,
    data: resourceStatusData,
    // error: resourceStatusError,
  } = useResourceStatusQuery(selectedLanguage, id!);

  const {
    isPending: isPendingWords,
    isError: isErrorWords,
    data: wordsData,
    error: wordsError,
  } = useMovieVocabularyQuery(selectedLanguage, state.mediaItemId);

  useEffect(() => {
    setIsFollowing(resourceStatusData);
  }, [resourceStatusData]);

  // const handleFormSubmit = async (
  //   word: Wordx,
  //   isLearning: boolean,
  //   isExcluded: boolean,
  // ) => {
  //   const ENDPOINT = `${import.meta.env.VITE_BASE_URL}/api/words/progress`;
  //   const payload = {
  //     word_id: word.word_id,
  //     learningLevel: word.learning_level,
  //     lastAnswerTs: word.last_answer_ts,
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
  //     // Utility function to deeply clone and update the state
  //     const updateNestedState = (words: Words, id: string): Words => {
  //       return words.map((wordList) =>
  //         wordList.map((word) =>
  //           word.word_id === id
  //             ? {
  //                 ...word,
  //                 marked_to_learn: isLearning,
  //                 marked_to_exclude: isExcluded,
  //               }
  //             : word,
  //         ),
  //       );
  //     };

  //     setWords((prevWords) => updateNestedState(prevWords, word.word_id));
  //   }
  // };

  const handleExcludeClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    word: Wordx[],
  ) => {
    e.stopPropagation();
    word.forEach((el) =>
      mutate({
        word: el,
        isLearning: false,
        isExcluded: true,
        id: parseInt(id!),
      }),
    );
  };

  const handleLearnClick = (word: Wordx[]) => {
    word.forEach((el) =>
      mutate({
        word: el,
        isLearning: true,
        isExcluded: false,
        id: parseInt(id!),
      }),
    );
  };

  const handleToggleFollowing = () => {
    refetchToggleQuery();
  };

  if (isPendingWords) {
    return <span>Loading...</span>;
  }

  if (isErrorWords) {
    return <span>Error: {wordsError?.message}</span>;
  }

  return (
    <Container size='lg'>
      <div className={styles.titleContainer}>
        <Flex align='baseline' my='lg'>
          <Title>{state.listName}</Title>
        </Flex>
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
      <Tabs defaultValue='learning'>
        <Tabs.List>
          <Tabs.Tab
            value='learning'
            leftSection={<IconBook style={iconStyle} />}
          >
            Learning
          </Tabs.Tab>
          <Tabs.Tab
            value='excluded'
            leftSection={<IconEyeOff style={iconStyle} />}
          >
            Excluded
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='learning'>
          <Title order={2} my='lg'>
            Learning
          </Title>
          {/* <Items
            // resource='movie'
            // id={id!}
            // chapter_or_episode='n/a'
            mediaItemId={state.mediaItemId}
            setShow={setShow}
            setActiveWord={setActiveWord}
            handleExcludeClick={handleExcludeClick}
          /> */}
          <Pagination
            value={activePage}
            onChange={setPage}
            siblings={1}
            total={Math.ceil((wordsData.length || 0) / 100)}
            mx='auto'
            my='lg'
          />
          <ul style={{ listStyle: 'none', padding: '0' }}>
            {wordsData
              .slice(100 * (activePage - 1), 100 * activePage)
              .filter((word) => !word[0].marked_to_exclude)
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
                <VocabularyListRow
                  key={id}
                  item={item}
                  handleExcludeClick={handleExcludeClick}
                  setActiveWord={setActiveWord}
                  setShow={setOpen}
                />
              ))}
          </ul>
          {/* <Modal
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
                  resourceKey={''}
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
                  onClick={(e) => {
                    handleExcludeClick(e, [activeWord!]);
                    setShow(false);
                  }}
                >
                  Exclude
                </button>
              </div>
            </div>
          </Modal> */}
          <Sheet
            isOpen={isOpen}
            onClose={() => setOpen(false)}
            detent='content-height'
          >
            <Sheet.Container>
              <Sheet.Header />
              <Sheet.Content>
                <Sheet.Scroller>
                  <ExamplesMoviesModal
                    activeWord={activeWord!}
                    resourceKey={''}
                  />
                </Sheet.Scroller>
              </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop
              onTap={() => {
                setOpen(false);
              }}
            />
          </Sheet>
        </Tabs.Panel>
        <Tabs.Panel value='excluded'>
          <Title order={2} mb='lg'>
            Excluded
          </Title>
          <ul style={{ listStyle: 'none', padding: '0' }}>
            {wordsData
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
