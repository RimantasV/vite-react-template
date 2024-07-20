import Modal from '@restart/ui/Modal';
import { ClassAttributes, HTMLAttributes, useEffect, useState } from 'react';
import { FaCheck, FaEye, FaPlus } from 'react-icons/fa';

import styles from '../Lists/lists.module.scss';

import { useCallback } from 'react';
import ExamplesMoviesModal from '../../components/ExamplesMoviesModal';

import { useSearchParams } from 'react-router-dom';
import { NUMBER_OF_WORDS_IN_A_QUIZ } from '../../consts';
import { Data, DataMovies, Word, Words } from '../../types/types';
import { getCountryCode, getNextReviewDate, shuffleArray } from '../../utils';
import { Settings } from './components';

export default function Quiz() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const key = searchParams.get('key');
  console.log(id, key);
  const [show, setShow] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [vocabularyLevel, setVocabularyLevel] = useState(0);
  const [, setWords] = useState<Words>([]);
  const [quizWords, setQuizWords] = useState<Words>([]);
  const [translationStatus, setTranslationStatus] = useState<
    'hidden' | 'visible'
  >('hidden');
  const [activeKey, setActiveKey] = useState<string | number>('');

  useEffect(() => {
    const saved = localStorage.getItem('vocabularyLevel');
    if (saved) {
      setVocabularyLevel(JSON.parse(saved));
    }
  }, []);
  type WordProgressPayload = {
    word: string;
    learningLevel: number;
    lastAnswerTs: Date;
    markedToLearn: boolean;
    markedToExclude: boolean;
  };
  const fetchVocabulary = useCallback(
    async (key: string) => {
      const ENDPOINT =
        import.meta.env.VITE_ENVIRONMENT === 'TEST'
          ? '/vocabulary-translation.json'
          : `${
              import.meta.env.VITE_BASE_URL
            }/api/vocabulary-translation/movies/${key}`;

      const response = await fetch(ENDPOINT);
      let data: DataMovies = await response.json();
      data = data
        .filter((el) => !el.word.endsWith('*'))
        .filter((el) => el.frequency > vocabularyLevel || el.marked_to_learn)
        .filter((el) => !el.marked_to_exclude);
      data = data.map((el) => ({
        ...el,
        nextReviewDate: getNextReviewDate(el.learning_level, el.last_answer_ts),
      }));

      const cleaned = data.reduce(function (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        obj: { [x: string]: any },
        item: { word: string }
      ) {
        if (
          !Object.prototype.hasOwnProperty.call(obj, item.word.split('-')[0])
        ) {
          obj[item.word.split('-')[0]] = [item];
        } else {
          obj[item.word.split('-')[0]] = [
            ...obj[item.word.split('-')[0]],
            item,
          ];
        }

        return obj;
      }, {});

      setWords(Object.values(cleaned));
      return Object.values(cleaned);
    },
    [vocabularyLevel]
  );

  const fetchUserCreatedListVocabulary = useCallback(async (key: number) => {
    const ENDPOINT = `${
      import.meta.env.VITE_BASE_URL
    }/api/vocabulary-translation/lists/${key}`;

    const response = await fetch(ENDPOINT);
    let data: Data = await response.json();
    data = data.filter((el) => !el.marked_to_exclude);

    data = data.map((el) => ({
      ...el,
      nextReviewDate: getNextReviewDate(el.learning_level, el.last_answer_ts),
    }));

    const cleaned = data.reduce(function (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      obj: { [x: string]: any },
      item: { word: string }
    ) {
      if (!Object.prototype.hasOwnProperty.call(obj, item.word.split('-')[0])) {
        obj[item.word.split('-')[0]] = [item];
      } else {
        obj[item.word.split('-')[0]] = [...obj[item.word.split('-')[0]], item];
      }

      return obj;
    }, {});

    setWords(Object.values(cleaned));
    return Object.values(cleaned);
  }, []);

  const handleStartQuiz = useCallback(
    async (key: string) => {
      setActiveKey(key);
      const words = await fetchVocabulary(key);
      if (words.length) {
        const wordsForQuiz = shuffleArray(
          words.some((word) => {
            return (
              new Date(word[0].nextReviewDate).getTime() < new Date().getTime()
            );
          })
            ? words.filter(
                (word) =>
                  new Date(word[0].nextReviewDate).getTime() <
                  new Date().getTime()
              )
            : words.filter((word) => word[0].nextReviewDate === null)
        ).slice(0, NUMBER_OF_WORDS_IN_A_QUIZ);

        setQuizWords(wordsForQuiz);
      }
      setShow(true);
      setTranslationStatus('hidden');
    },
    [fetchVocabulary]
  );

  const handleStartQuizUserCreatedQuiz = useCallback(
    async (key: number) => {
      console.log({ key });
      setActiveKey(key);
      const words = await fetchUserCreatedListVocabulary(key);
      if (words.length) {
        // const wordsForQuiz = shuffleArray(words).slice(
        //   0,
        //   NUMBER_OF_WORDS_IN_A_QUIZ
        // );

        const wordsDueForReview = words.filter(
          (word) =>
            new Date(word[0].nextReviewDate).getTime() <=
              new Date().getTime() && word[0].nextReviewDate !== null
        );

        let wordsForQuiz = shuffleArray(wordsDueForReview).slice(
          0,
          NUMBER_OF_WORDS_IN_A_QUIZ
        );

        if (wordsForQuiz.length < NUMBER_OF_WORDS_IN_A_QUIZ) {
          const newWordsShuffled = shuffleArray(
            words.filter((word) => word[0].nextReviewDate === null)
          ).slice(0, NUMBER_OF_WORDS_IN_A_QUIZ - wordsForQuiz.length);

          wordsForQuiz = wordsForQuiz.concat(newWordsShuffled);
        }

        if (wordsForQuiz.length < NUMBER_OF_WORDS_IN_A_QUIZ) {
          const reviewedWordsShuffled = words
            .filter(
              (word) =>
                new Date(word[0].nextReviewDate).getTime() >
                  new Date().getTime() && word[0].nextReviewDate !== null
            )
            .slice(0, NUMBER_OF_WORDS_IN_A_QUIZ - wordsForQuiz.length);

          wordsForQuiz = wordsForQuiz.concat(reviewedWordsShuffled);
        }

        wordsForQuiz = shuffleArray(wordsForQuiz);

        setQuizWords(wordsForQuiz);
      }
      setShow(true);
      setTranslationStatus('hidden');
    },
    [fetchUserCreatedListVocabulary]
  );

  const handleSubmitPositive = (x: Word) => {
    const payload: WordProgressPayload = {
      word: x.word,
      learningLevel: !x.learning_level
        ? 1
        : x.learning_level === 5
        ? 5
        : x.learning_level + 1,
      lastAnswerTs: new Date(),
      markedToLearn: x.marked_to_learn,
      markedToExclude: x.marked_to_exclude,
    };

    fetchUpdateWordProgress(payload);

    if (translationStatus === 'hidden') {
      setTranslationStatus('visible');
    } else {
      setTranslationStatus('hidden');
      const newArr = [...quizWords];
      setQuizWords(newArr.slice(1));
    }
  };

  const handleSubmitNegative = (x: Word) => {
    const payload: WordProgressPayload = {
      word: x.word,
      learningLevel: !x.learning_level ? 0 : x.learning_level - 1,
      lastAnswerTs: new Date(),
      markedToLearn: x.marked_to_learn,
      markedToExclude: x.marked_to_exclude,
    };

    fetchUpdateWordProgress(payload);

    if (translationStatus === 'hidden') {
      setTranslationStatus('visible');
    } else {
      setTranslationStatus('hidden');
      const newArr = [...quizWords];
      setQuizWords(newArr.slice(1));
    }
  };

  const handleReveal = () => {
    setTranslationStatus('visible');
  };

  const fetchUpdateWordProgress = async ({
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
      markedToLearn: markedToLearn,
      markedToExclude: markedToExclude,
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
                  marked_to_learn: markedToLearn,
                  marked_to_exclude: markedToExclude,
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
      //I would like to be able to update words array with info which words have been excluded,
      //as to avoid ading them to the quiz, in case user will repeast the quiz without fetching list again.
      // But that triggers repopulation of quiz words.

      const newArr = [...quizWords];
      setQuizWords(newArr.slice(1));
      setTranslationStatus('hidden');

      // // Utility function to deeply clone and update the state
      // const updateNestedState = (words: Words, id: string): Words => {
      //   return words.map((wordList) =>
      //     wordList.map((word) =>
      //       word.word === id
      //         ? {
      //             ...word,
      //             marked_to_learn: isLearning,
      //             marked_to_exclude: isExcluded,
      //           }
      //         : word
      //     )
      //   );
      // };
      // setWords((prevWords) => updateNestedState(prevWords, word));
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

  return (
    <>
      <Settings
        onClick={
          id
            ? () => handleStartQuizUserCreatedQuiz(parseInt(id))
            : () => handleStartQuiz(key!)
        }
      />
      <Modal
        show={show}
        aria-labelledby='modal-1-label'
        onHide={() => {
          setShow(false);
          setActiveKey('');
          setWords([]);
          setQuizWords([]);
        }}
        renderBackdrop={(
          props: JSX.IntrinsicAttributes &
            ClassAttributes<HTMLDivElement> &
            HTMLAttributes<HTMLDivElement>
        ) => <div {...props} className={styles.backdrop} />}
        className={styles.modal}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            position: 'relative',
          }}
        >
          <div>
            <div className={styles.flashcard}>
              <h3>{quizWords[0]?.[0].word.split('-')[0]}</h3>
              <hr />
              <div>
                {quizWords[0]?.map((el, i) => (
                  <div
                    className={`${styles.translation} ${
                      translationStatus === 'hidden'
                        ? styles.hidden
                        : styles.visible
                    }`}
                    key={i}
                  >
                    <h5
                      style={{
                        textTransform: 'uppercase',
                        margin: '0',
                        marginBlock: '15px',
                      }}
                    >
                      {el.word.split('-')[1]}
                    </h5>
                    <ol style={{ paddingLeft: '20px', margin: '0' }}>
                      {el.info.map((el, i) => (
                        <li
                          key={i}
                          style={{
                            margin: '0',
                            marginBottom: '5px',
                            fontSize: '14px',
                          }}
                        >
                          {renderFlag(el.tags)}
                          {el.glosses}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ flex: '1' }}>
            {quizWords[0]?.[0].word && activeKey && (
              <ExamplesMoviesModal
                activeWord={quizWords[0]?.[0].word}
                resourceKey={activeKey as string}
                renderOnlyExampes={true}
                translationStatus={translationStatus}
              />
            )}
          </div>
          <div className={styles.toolbar}>
            <div className={styles.iconsContainer}>
              {translationStatus === 'visible' && (
                <button
                  onClick={() => handleSubmitPositive(quizWords[0]?.[0])}
                  className={`${styles.iconButton} ${styles.correct}`}
                >
                  <FaCheck />
                </button>
              )}
              {translationStatus === 'hidden' && (
                <button
                  onClick={handleReveal}
                  className={`${styles.iconButton} ${styles.eye}`}
                >
                  <FaEye />
                </button>
              )}
              {translationStatus === 'visible' && (
                <button
                  onClick={() => handleSubmitNegative(quizWords[0]?.[0])}
                  className={`${styles.iconButton} ${styles.incorrect}`}
                >
                  <FaPlus />
                </button>
              )}
            </div>
            <div className={styles.otherButtons}>
              <button
                className={styles.button}
                onClick={() => {
                  handleExcludeClick(quizWords[0]);
                }}
              >
                Exclude word
              </button>
              <button
                className={styles.button}
                onClick={() => {
                  setShow(false);
                  setActiveKey('');
                  setWords([]);
                  setQuizWords([]);
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
