import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { NavigateFunction } from 'react-router-dom';

import {
  ActionIcon,
  Alert,
  Button,
  CloseButton,
  Grid,
  Group,
  Kbd,
  Paper,
  Progress,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {
  IconBulb,
  IconCheck,
  IconChevronRight,
  IconEyeOff,
  IconQuestionMark,
  IconX,
} from '@tabler/icons-react';

import Correct from '../../assets/sounds/correct1.wav';
import Wrong from '../../assets/sounds/wrong1.wav';
import { QUIZ_STEPS, TRANSLATION_STATUS, Wordx } from '../../types';
import { Layout } from '../Layout';

// interface TypingQuestion {
//   id: number;
//   text: string;
//   answer: string;
// }

// const typingQuestions: TypingQuestion[] = [
//   { id: 1, text: 'What is the capital of France?', answer: 'Paris' },
//   { id: 2, text: 'Which planet is known as the Red Planet?', answer: 'Mars' },
//   // Add more questions here
// ];

type Props = {
  wordsData: Wordx[][];
  goToNextWord: () => void;
  onComplete: () => void;
  quizState: {
    step: QUIZ_STEPS;
    index: number;
    translation: TRANSLATION_STATUS;
  };
  setQuizState: React.Dispatch<
    React.SetStateAction<{
      step: QUIZ_STEPS;
      index: number;
      translation: TRANSLATION_STATUS;
    }>
  >;
  handleExcludeWordClick: (word: Wordx[]) => void;
  navigate: NavigateFunction;
};

const TypingQuiz: React.FC<Props> = ({
  onComplete,
  wordsData,
  quizState,
  goToNextWord,
  handleExcludeWordClick,
  navigate,
}) => {
  // const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const correctAudio = useMemo(() => new Audio(Correct), []);
  const incorrectAudio = useMemo(() => new Audio(Wrong), []);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const currentQuestion = wordsData[quizState.index];

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [quizState.index]);

  useEffect(() => {
    if (isAnswerCorrect === true) {
      correctAudio.play();
    } else if (isAnswerCorrect === false) {
      incorrectAudio.play();
    }
  }, [correctAudio, incorrectAudio, isAnswerCorrect]);

  const handleInputChange = (index: number, value: string) => {
    console.log({ userAnswer });
    if (value !== ' ') {
      console.log({ value });
      const newAnswer = [...userAnswer];
      newAnswer[index] = value.toUpperCase();
      setUserAnswer(newAnswer);

      if (
        value &&
        index < currentQuestion[0].word_id.split('-')[0].length - 1
      ) {
        inputRefs.current[index + 1]?.focus();
      }
      console.log(
        newAnswer.join('').length,
        currentQuestion[0].word_id.split('-')[0].toUpperCase().length,
        newAnswer.join(''),
        currentQuestion[0].word_id.split('-')[0].toUpperCase(),
        currentQuestion[0].word_id,
      );
      if (
        newAnswer.join('').length ===
        currentQuestion[0].word_id.split('-')[0].toUpperCase().length
      ) {
        checkAnswer(newAnswer);
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !userAnswer[index] && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
  };

  const checkAnswer = useCallback(
    (newAnswer: string[]) => {
      const isCorrect =
        //   userAnswer.join('') === currentQuestion.answer.toUpperCase();
        newAnswer.join('') ===
        currentQuestion[0].word_id.split('-')[0].toUpperCase();

      console.log(
        newAnswer,
        currentQuestion[0].word_id.split('-')[0].toUpperCase(),
      );

      setIsAnswerCorrect(isCorrect);
      if (isCorrect) {
        setScore(score + 1);
      }
    },
    [currentQuestion, score],
  );

  const handleNextQuestion = useCallback(() => {
    if (quizState.index < wordsData.length - 1) {
      // setCurrentQuestionIndex(currentQuestionIndex + 1);
      goToNextWord();
      setUserAnswer([]);
      setShowHint(false);
      setIsAnswerCorrect(null);
    } else {
      // Quiz completed
      // alert(`Quiz completed! Your score: ${score}/${wordsData.length}`);
      onComplete();
    }
  }, [goToNextWord, onComplete, quizState.index, wordsData.length]);

  const revealHint = useCallback(() => {
    setShowHint(true);
    const hintAnswer = [...userAnswer];
    hintAnswer[0] = currentQuestion[0].word_id[0].toUpperCase();
    hintAnswer[currentQuestion[0].word_id.split('-')[0].length - 1] =
      currentQuestion[0].word_id[
        currentQuestion[0].word_id.split('-')[0].length - 1
      ].toUpperCase();
    setUserAnswer(hintAnswer);
    inputRefs.current[1]?.focus();
  }, [currentQuestion, userAnswer]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isAnswerCorrect !== null) {
        if (event.key === ' ' || event.key === 'Enter') {
          handleNextQuestion();
        }
      } else {
        if (event.key === 'Enter') {
          if (!showHint) {
            revealHint();
          } else {
            checkAnswer(userAnswer);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [
    checkAnswer,
    currentQuestion,
    handleNextQuestion,
    isAnswerCorrect,
    revealHint,
    showHint,
    userAnswer,
  ]);

  const handleAddInput = (letter: string) => {
    // const index = inputRefs.current.findIndex((el) => !el?.value);
    // if (index !== -1) {
    // if (inputRefs.current[index]) {
    // inputRefs.current[index].value = letter;
    // }
    // }

    // const newAnswer = [...userAnswer];
    userAnswer.length;
    const index = userAnswer.findIndex((el) => el == undefined || el == '');
    console.log({ userAnswer });
    console.log({ index });
    // newAnswer[index] = letter.toUpperCase();
    // setUserAnswer(newAnswer);
    // console.log({ userAnswer });
    handleInputChange(2, letter);
  };

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
              value={(quizState.index / (wordsData?.length || 0 - 1)) * 100}
              // value={((quizState.index + 1) / wordsData.length) * 100}
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
                handleExcludeWordClick(wordsData![quizState.index])
              }
            >
              <IconEyeOff stroke={2} />
            </ActionIcon>
          </Grid.Col>
        </Grid>

        {/* <Container size='sm'> */}
        <Paper w='100%' shadow='xs' p='md' mt='xl'>
          <Stack>
            {/* <Title order={2} mb='md'>
              Typing Quiz
            </Title> */}
            {/* <Text mb='xs'>{`Question ${currentQuestionIndex + 1} of ${wordsData.length}`}</Text> */}
            {/* <Progress
              value={((currentQuestionIndex + 1) / wordsData.length) * 100}
              mb='md'
            /> */}
            <Title ta='center' fw={500} mb='md'>
              {currentQuestion[0].info[0].glosses}
            </Title>

            <Group mb='md' justify='center'>
              {currentQuestion[0].word_id
                .split('-')[0]
                .split('')
                .map((_, index) => (
                  <TextInput
                    key={index}
                    value={userAnswer[index] || ''}
                    onChange={(e) =>
                      handleInputChange(index, e.currentTarget.value)
                    }
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    style={{ width: 'calc(3.75rem* var(--mantine-scale)' }}
                    size='xl'
                    maxLength={1}
                    ref={(el) => (inputRefs.current[index] = el)}
                    disabled={
                      (showHint &&
                        (index === 0 ||
                          index ===
                            currentQuestion[0].word_id.split('-')[0].length -
                              1)) ||
                      isAnswerCorrect !== null
                    }
                  />
                ))}
            </Group>
            <Group justify='center'>
              <Kbd
                onClick={() => handleAddInput('Ä')}
                size='xl'
                style={{ alignSelf: 'center' }}
              >
                Ä
              </Kbd>
              <Kbd size='xl' style={{ alignSelf: 'center' }}>
                Ü
              </Kbd>
              <Kbd size='xl' style={{ alignSelf: 'center' }}>
                Ö
              </Kbd>
              <Kbd size='xl' style={{ alignSelf: 'center' }}>
                ẞ
              </Kbd>
            </Group>

            <Group mb='md'>
              {!showHint && (
                <Stack gap='xs'>
                  <Button
                    onClick={revealHint}
                    leftSection={<IconBulb size='1rem' />}
                    disabled={showHint || isAnswerCorrect !== null}
                  >
                    Hint
                  </Button>
                  <Kbd style={{ alignSelf: 'center' }}>Enter</Kbd>
                </Stack>
              )}
              {showHint && isAnswerCorrect === null && (
                <Stack gap='xs'>
                  <Button
                    // onClick={checkAnswer}
                    leftSection={<IconQuestionMark size='1rem' />}
                    disabled={isAnswerCorrect !== null}
                  >
                    Don't know
                  </Button>
                  <Kbd style={{ alignSelf: 'center' }}>Enter</Kbd>
                </Stack>
              )}
            </Group>

            {isAnswerCorrect !== null && (
              <Alert
                icon={
                  isAnswerCorrect ? (
                    <IconCheck size='1rem' />
                  ) : (
                    <IconX size='1rem' />
                  )
                }
                title={isAnswerCorrect ? 'Correct!' : 'Incorrect'}
                color={isAnswerCorrect ? 'green' : 'red'}
                mb='md'
              >
                {isAnswerCorrect
                  ? 'Great job! You got it right.'
                  : `The correct answer is: ${currentQuestion[0].word_id.split('-')[0]}`}
              </Alert>
            )}

            {isAnswerCorrect !== null && (
              <Group justify='space-between'>
                <Text>
                  Score: {score}/{quizState.index + 1}
                </Text>
                <Button
                  onClick={handleNextQuestion}
                  rightSection={<IconChevronRight size='1rem' />}
                >
                  {quizState.index < wordsData.length - 1
                    ? 'Next Question'
                    : 'Finish Quiz'}
                </Button>
              </Group>
            )}
          </Stack>
        </Paper>
        {/* </Container> */}
      </Stack>
    </Layout>
  );
};

export default TypingQuiz;
