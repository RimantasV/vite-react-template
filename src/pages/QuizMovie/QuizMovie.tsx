import { Key, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  ActionIcon,
  Button,
  Card,
  CloseButton,
  Flex,
  Grid,
  Group,
  List,
  Paper,
  Progress,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconCheck,
  IconEye,
  IconEyeOff,
  IconRepeat,
  IconX,
} from '@tabler/icons-react';

import { Layout } from '../../components';
import { useMovieVocabularyQuery } from '../../queries';
import { useLanguageStore } from '../../store';
import {
  QUIZ_STEPS,
  TRANSLATION_STATUS,
  Wordsx,
  Wordx,
} from '../../types/types';
import RenderFlag from './RenderFlag';
import { Settings } from './components';

import styles from '../Learn/learn.module.scss';
import styles2 from './quiz.module.scss';

export default function Quiz() {
  const { selectedLanguage } = useLanguageStore();
  const [searchParams] = useSearchParams();
  const mediaItemId = searchParams.get('media-item-id');
  const [, setWords] = useState<Wordsx>([]);
  // const [quizWords, setQuizWords] = useState<Wordsx>([]);
  // const [translationStatus, setTranslationStatus] = useState<
  //   'hidden' | 'visible'
  // >('hidden');
  // const [activeKey, setActiveKey] = useState<string | number>('');
  const navigate = useNavigate();
  const [progressValue, setProgressValue] = useState(80);
  const [quizState, setQuizState] = useState({
    step: QUIZ_STEPS.SETTINGS,
    index: 0,
    translation: TRANSLATION_STATUS.HIDDEN,
  });

  const resetQuizState = () => {
    setProgressValue(80);
    setQuizState({
      step: QUIZ_STEPS.SETTINGS,
      translation: TRANSLATION_STATUS.HIDDEN,
      index: 0,
    });
  };

  const goToNextWord = () => {
    setQuizState((prevState) => {
      const isLastWord = wordsMoviesData!.length - 1 === prevState.index;
      return {
        step: isLastWord ? QUIZ_STEPS.SUMMARY : QUIZ_STEPS.PROGRESS,
        translation: TRANSLATION_STATUS.HIDDEN,
        index: isLastWord ? 0 : prevState.index + 1,
      };
    });
  };

  type WordProgressPayload = {
    word: string;
    learningLevel: number;
    lastAnswerTs: Date;
    markedToLearn: boolean;
    markedToExclude: boolean;
  };

  const {
    isPending: isPendingWordsMovies,
    isError: isErrorWordsMovies,
    data: wordsMoviesData,
    error: wordsMoviesError,
  } = useMovieVocabularyQuery(selectedLanguage?.language_id, mediaItemId!);

  const handleStartQuizUserCreatedQuiz = async () => {
    setQuizState((prevState) => ({ ...prevState, step: QUIZ_STEPS.PROGRESS }));

    // setActiveKey(key);
    // const words = await fetchUserCreatedListVocabulary(key);
    // if (words.length) {
    //   // const wordsForQuiz = shuffleArray(words).slice(
    //   //   0,
    //   //   NUMBER_OF_WORDS_IN_A_QUIZ
    //   // );

    //   const wordsDueForReview = words.filter(
    //     (word) =>
    //       new Date(word[0].nextReviewDate).getTime() <= new Date().getTime() &&
    //       word[0].nextReviewDate !== null
    //   );

    //   let wordsForQuiz = shuffleArray(wordsDueForReview).slice(
    //     0,
    //     NUMBER_OF_WORDS_IN_A_QUIZ
    //   );

    //   if (wordsForQuiz.length < NUMBER_OF_WORDS_IN_A_QUIZ) {
    //     const newWordsShuffled = shuffleArray(
    //       words.filter((word) => word[0].nextReviewDate === null)
    //     ).slice(0, NUMBER_OF_WORDS_IN_A_QUIZ - wordsForQuiz.length);

    //     wordsForQuiz = wordsForQuiz.concat(newWordsShuffled);
    //   }

    //   if (wordsForQuiz.length < NUMBER_OF_WORDS_IN_A_QUIZ) {
    //     const reviewedWordsShuffled = words
    //       .filter(
    //         (word) =>
    //           new Date(word[0].nextReviewDate).getTime() >
    //             new Date().getTime() && word[0].nextReviewDate !== null
    //       )
    //       .slice(0, NUMBER_OF_WORDS_IN_A_QUIZ - wordsForQuiz.length);

    //     wordsForQuiz = wordsForQuiz.concat(reviewedWordsShuffled);
    //   }

    //   wordsForQuiz = shuffleArray(wordsForQuiz);

    //   setQuizWords(wordsForQuiz);
    // }
    // setShow(true);
    // setTranslationStatus('hidden');
  };

  const handleSubmitPositive = (x: Wordx) => {
    const payload: WordProgressPayload = {
      word: x.word_id,
      learningLevel: !x.learning_level
        ? 1
        : x.learning_level === 5
          ? 5
          : x.learning_level + 1,
      lastAnswerTs: new Date(),
      markedToLearn: x.marked_to_learn,
      markedToExclude: x.marked_to_exclude,
    };

    handleUpdateWordProgress(payload);

    // if (translationStatus === 'hidden') {
    //   setTranslationStatus('visible');
    // } else {
    //   setTranslationStatus('hidden');
    //   const newArr = [...quizWords];
    //   setQuizWords(newArr.slice(1));
    // }
  };

  const handleSubmitNegative = (x: Wordx) => {
    const payload: WordProgressPayload = {
      word: x.word_id,
      learningLevel: !x.learning_level ? 0 : x.learning_level - 1,
      lastAnswerTs: new Date(),
      markedToLearn: x.marked_to_learn,
      markedToExclude: x.marked_to_exclude,
    };

    handleUpdateWordProgress(payload);

    // if (translationStatus === 'hidden') {
    //   setTranslationStatus('visible');
    // } else {
    //   setTranslationStatus('hidden');
    //   const newArr = [...quizWords];
    //   setQuizWords(newArr.slice(1));
    // }
  };

  const handleTranslationReveal = () => {
    setQuizState((prevState) => ({
      ...prevState,
      translation: TRANSLATION_STATUS.VISIBLE,
    }));
  };

  const handleExcludeWordClick = (word: Wordx[]) => {
    word.forEach((el) => {
      const payload = {
        word: el.word_id,
        learningLevel: el.learning_level,
        lastAnswerTs: el.last_answer_ts,
        markedToLearn: false,
        markedToExclude: true,
      };

      handleUpdateWordProgress(payload);
    });
  };

  const handleUpdateWordProgress = async ({
    word,
    learningLevel,
    lastAnswerTs,
    markedToLearn,
    markedToExclude,
  }: WordProgressPayload) => {
    const ENDPOINT = `${import.meta.env.VITE_BASE_URL}/api/words/progress`;
    const payload = {
      word,
      learningLevel,
      lastAnswerTs,
      markedToLearn,
      markedToExclude,
    };

    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      //I would like to be able to update words array with info which words have been excluded,
      //as to avoid ading them to the quiz, in case user will repeast the quiz without fetching list again.
      // But that triggers repopulation of quiz words.

      // const newArr = [...quizWords];
      // setQuizWords(newArr.slice(1));
      // setTranslationStatus('hidden');

      // Utility function to deeply clone and update the state
      const updateNestedState = (words: Wordsx, id: string): Wordsx => {
        return words.map((wordList) =>
          wordList.map((word) =>
            word.word_id === id
              ? {
                  ...word,
                  //TODO update other properties too.
                  marked_to_learn: markedToLearn,
                  marked_to_exclude: markedToExclude,
                }
              : word,
          ),
        );
      };
      setWords((prevWords) => updateNestedState(prevWords, word));
      goToNextWord();
    }
  };
  if (quizState.step === QUIZ_STEPS.SETTINGS) {
    return (
      <Layout>
        <Stack flex={1} align='center'>
          <Grid w={'100%'} align='center' mb='xl'>
            <Grid.Col span={2}>
              <CloseButton
                style={{ marginRight: 'auto' }}
                onClick={() => navigate(-1)}
              />
            </Grid.Col>
          </Grid>
          <Settings
            wordsData={wordsMoviesData}
            onClick={() => handleStartQuizUserCreatedQuiz()}
          />
        </Stack>
      </Layout>
    );
  }

  if (quizState.step === QUIZ_STEPS.PROGRESS) {
    return (
      <Layout>
        <Stack flex={1} align='center'>
          <Grid w={'100%'} align='center' mb='xl'>
            <Grid.Col span={2}>
              <CloseButton onClick={() => navigate(-1)} />
            </Grid.Col>
            <Grid.Col span={8}>
              <Progress
                transitionDuration={200}
                value={
                  (quizState.index / (wordsMoviesData?.length || 0 - 1)) * 100
                }
                size='lg'
                radius='lg'
              />
            </Grid.Col>
            <Grid.Col
              span={2}
              style={{
                marginLeft: 'auto',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <ActionIcon
                size='lg'
                variant='subtle'
                aria-label='Exclude word'
                onClick={() =>
                  handleExcludeWordClick(wordsMoviesData![quizState.index])
                }
              >
                <IconEyeOff stroke={2} />
              </ActionIcon>
            </Grid.Col>
          </Grid>

          {isPendingWordsMovies && <Text>Loading...</Text>}
          {isErrorWordsMovies && (
            <Text>Error: {wordsMoviesError?.message}</Text>
          )}
          <Stack w='100%'>
            <Card shadow='md' bg='whitesmoke' flex={1} w='100%' mb='xl' p='xl'>
              {/* Foreign word */}
              <Card.Section p='xl' withBorder>
                <Flex justify='center'>
                  <Title fz={42} order={2}>
                    {wordsMoviesData![quizState.index][0].word_id.split('-')[0]}
                  </Title>
                </Flex>
              </Card.Section>
              {/* Translation */}
              <Card.Section p='xl' mah='300' style={{ overflow: 'auto' }}>
                {wordsMoviesData![quizState.index].map(
                  (
                    el: {
                      word_id: string;
                      info: { tags: string[]; glosses: string }[];
                    },
                    i: Key | null | undefined,
                  ) => (
                    <div
                      className={`${styles2.translation} ${
                        quizState.translation === TRANSLATION_STATUS.HIDDEN
                          ? styles2.hidden
                          : styles2.visible
                      }`}
                      key={i}
                    >
                      <Title
                        fz={20}
                        order={5}
                        mb='xs'
                        fw='bolder'
                        style={{
                          textTransform: 'uppercase',
                        }}
                      >
                        {el.word_id.split('-')[1]}
                      </Title>
                      <List
                        type='ordered'
                        size='xl'
                        listStyleType='decimal'
                        withPadding
                      >
                        {el.info.map((el, i) => (
                          <List.Item key={i}>
                            <div style={{ display: 'flex' }}>
                              {<RenderFlag tags={el.tags} />}
                              <Text size='xl'>{el.glosses}</Text>
                            </div>
                          </List.Item>
                        ))}
                      </List>
                    </div>
                  ),
                )}
              </Card.Section>
            </Card>
            <div className={styles.toolbar}>
              <div className={styles.iconsContainer}>
                {quizState.translation === TRANSLATION_STATUS.VISIBLE && (
                  <ActionIcon
                    size='48'
                    fz='36px'
                    radius='xl'
                    variant='filled'
                    color='green'
                    aria-label='I got this word right'
                    onClick={() =>
                      handleSubmitPositive(wordsMoviesData![quizState.index][0])
                    }
                  >
                    <IconCheck
                      stroke={2.5}
                      style={{ width: '36', height: '36' }}
                    />
                  </ActionIcon>
                )}
                {quizState.translation === TRANSLATION_STATUS.HIDDEN && (
                  <ActionIcon
                    size='48'
                    fz='36px'
                    radius='xl'
                    variant='filled'
                    color='gray'
                    aria-label='Reveal translation'
                    onClick={handleTranslationReveal}
                  >
                    <IconEye stroke={2} style={{ width: '36', height: '36' }} />
                  </ActionIcon>
                )}
                {quizState.translation === TRANSLATION_STATUS.VISIBLE && (
                  <ActionIcon
                    size='48'
                    fz='36px'
                    radius='xl'
                    variant='filled'
                    color='red'
                    aria-label="I didn't get this word right'"
                    onClick={() =>
                      handleSubmitNegative(wordsMoviesData![quizState.index][0])
                    }
                  >
                    <IconX stroke={2.5} style={{ width: '36', height: '36' }} />
                  </ActionIcon>
                )}
              </div>
            </div>
          </Stack>
        </Stack>
      </Layout>
    );
  }
  if (quizState.step === QUIZ_STEPS.SUMMARY) {
    setTimeout(() => {
      setProgressValue(100);
    }, 0);
    return (
      <Layout>
        <Stack flex={1} align='center'>
          <Grid w={'100%'} align='center'>
            <Grid.Col span={2}>
              <CloseButton
                style={{ marginRight: 'auto' }}
                onClick={() => navigate(-1)}
              />
            </Grid.Col>
            <Grid.Col span={8}>
              <Progress
                transitionDuration={500}
                value={progressValue}
                size='lg'
                radius='lg'
              />
            </Grid.Col>
            <Grid.Col span={2}></Grid.Col>
          </Grid>
          <Group h={'100%'} w={'100%'} justify='center' align='center' flex={1}>
            <Flex align='center' direction='column'>
              <Paper
                mb='lg'
                style={{
                  border: '7px solid green',
                  borderRadius: '50%',
                  padding: '15px',
                }}
              >
                <IconCheck color='green' size={64} stroke={3} />
              </Paper>
              <Title mb='lg'>Congratulations!</Title>
              <Text mb='xl' fz='lg'>
                You have reviewed {wordsMoviesData?.length} word
                {(wordsMoviesData?.length || 0) > 1 && 's'}
              </Text>
              <Group>
                <Button
                  size='lg'
                  variant='outline'
                  onClick={() => navigate(-1)}
                >
                  Go back
                </Button>
                <Button
                  size='lg'
                  leftSection={<IconRepeat size={18} />}
                  onClick={resetQuizState}
                >
                  New quiz
                </Button>
              </Group>
            </Flex>
          </Group>
        </Stack>
      </Layout>
    );
  }
}
