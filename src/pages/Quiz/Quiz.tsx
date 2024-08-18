import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { CloseButton, Grid, Stack } from '@mantine/core';

import { Layout } from '../../components';
import {
  Flashcards,
  MatchingPairs,
  MultipleChoice,
  Summary,
  Typing,
} from '../../components/Quizes';
import { useUserCreatedListVocabularyQuery } from '../../queries';
import { useLanguageStore } from '../../store';
import {
  QUIZ_STEPS,
  TRANSLATION_STATUS,
  Wordsx,
  Wordx,
  WordxMultiple,
} from '../../types/types';
import { Settings } from './components';
import { transformToMultipleChoice } from './test';

export default function Quiz() {
  const { selectedLanguage } = useLanguageStore();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [, setWords] = useState<Wordsx>([]);
  // const [quizWords, setQuizWords] = useState<Wordsx>([]);
  // const [translationStatus, setTranslationStatus] = useState<
  //   'hidden' | 'visible'
  // >('hidden');
  // const [activeKey, setActiveKey] = useState<string | number>('');
  const navigate = useNavigate();
  // const [progressValue, setProgressValue] = useState(80);
  const [quizState, setQuizState] = useState({
    step: QUIZ_STEPS.SETTINGS,
    index: 0,
    translation: TRANSLATION_STATUS.HIDDEN,
  });

  const goToNextWord = () => {
    setQuizState((prevState) => {
      const isLastWord = wordsData!.length - 1 === prevState.index;
      return {
        step: isLastWord ? QUIZ_STEPS.SUMMARY : prevState.step, //QUIZ_STEPS.FLASHCARDS,
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
    isPending: isPendingWords,
    isError: isErrorWords,
    data: wordsData,
    error: wordsError,
  } = useUserCreatedListVocabularyQuery(
    selectedLanguage!.language_id,
    parseInt(id!),
  );

  const handleStartFlashcardsQuiz = () => {
    setQuizState((prevState) => ({
      ...prevState,
      step: QUIZ_STEPS.FLASHCARDS,
    }));

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

  const handleStartMultipleChoiceQuiz = () => {
    setQuizState((prevState) => ({
      ...prevState,
      step: QUIZ_STEPS.MULTIPLE_CHOICE,
    }));
  };

  const handleStartTypingQuiz = () => {
    setQuizState((prevState) => ({
      ...prevState,
      step: QUIZ_STEPS.TYPING,
    }));
  };

  const handleStartMatchingPairsQuiz = () => {
    setQuizState((prevState) => ({
      ...prevState,
      step: QUIZ_STEPS.MATCHING_PAIRS,
    }));
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

  // const handleTranslationReveal = () => {
  //   setQuizState((prevState) => ({
  //     ...prevState,
  //     translation: TRANSLATION_STATUS.VISIBLE,
  //   }));
  // };

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
    const ENDPOINT = `${import.meta.env.VITE_BASE_URL}/api/words/progress?lang=${selectedLanguage?.language_id}`;
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

  const [multipleChoiceQuizWords, setMultipleChoiceQuizWords] =
    useState<WordxMultiple[][]>();

  useEffect(() => {
    if (wordsData) {
      setMultipleChoiceQuizWords(transformToMultipleChoice(wordsData));
    }
  }, [wordsData]);

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
            wordsData={wordsData}
            handleStartFlashcardsQuiz={handleStartFlashcardsQuiz}
            handleStartMultipleChoiceQuiz={handleStartMultipleChoiceQuiz}
            handleStartTypingQuiz={handleStartTypingQuiz}
            handleStartMatchingPairsQuiz={handleStartMatchingPairsQuiz}
          />
        </Stack>
      </Layout>
    );
  }

  if (quizState.step === QUIZ_STEPS.MULTIPLE_CHOICE) {
    return (
      <MultipleChoice
        multipleChoiceQuizWords={multipleChoiceQuizWords!}
        handleExcludeWordClick={handleExcludeWordClick}
        navigate={navigate}
        wordsData={wordsData!}
        goToNextWord={goToNextWord}
        quizState={quizState}
        setQuizState={setQuizState}
      />
    );
  }

  if (quizState.step === QUIZ_STEPS.TYPING) {
    return (
      <Typing
        quizState={quizState}
        setQuizState={setQuizState}
        goToNextWord={goToNextWord}
        wordsData={wordsData!}
        onComplete={() =>
          setQuizState((preState) => ({
            ...preState,
            step: QUIZ_STEPS.SUMMARY,
          }))
        }
        handleExcludeWordClick={handleExcludeWordClick}
        navigate={navigate}
      />
    );
  }

  if (quizState.step === QUIZ_STEPS.MATCHING_PAIRS) {
    return (
      <MatchingPairs
        wordsData={wordsData!.slice(0, 10)}
        onComplete={() =>
          setQuizState((preState) => ({
            ...preState,
            step: QUIZ_STEPS.SETTINGS,
          }))
        }
      />
    );
  }

  if (quizState.step === QUIZ_STEPS.FLASHCARDS) {
    return (
      <Flashcards
        wordsData={wordsData!}
        isPendingWords={isPendingWords}
        isErrorWords={isErrorWords}
        wordsError={wordsError}
        quizState={quizState}
        setQuizState={setQuizState}
        handleSubmitPositive={handleSubmitPositive}
        handleSubmitNegative={handleSubmitNegative}
        handleExcludeWordClick={handleExcludeWordClick}
      />
    );
  }
  if (quizState.step === QUIZ_STEPS.SUMMARY) {
    setTimeout(() => {
      // setProgressValue(100);
    }, 0);
    return (
      <Summary
        wordsData={wordsData!}
        quizState={quizState}
        setQuizState={setQuizState}
      />
    );
  }
}
