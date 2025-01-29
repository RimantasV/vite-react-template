import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NavigateFunction } from 'react-router-dom';

import {
  ActionIcon,
  Alert,
  Button,
  CloseButton,
  Grid,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconCheck,
  IconChevronRight,
  IconEyeOff,
} from '@tabler/icons-react';

import Correct from '../../assets/sounds/correct1.wav';
import Wrong from '../../assets/sounds/wrong1.wav';
import {
  QUIZ_STEPS,
  TRANSLATION_STATUS,
  Wordx,
  WordxMultiple,
} from '../../types';
import { Layout } from '../Layout';

type Props = {
  wordsData: Wordx[][];
  multipleChoiceQuizWords: WordxMultiple[][];
  handleExcludeWordClick: (word: Wordx[]) => void;
  navigate: NavigateFunction;
  goToNextWord: () => void;
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
  handleSubmitPositive: (x: Wordx) => void;
  handleSubmitNegative: (x: Wordx) => void;
};

const Quiz: React.FC<Props> = ({
  goToNextWord,
  handleExcludeWordClick,
  handleSubmitNegative,
  handleSubmitPositive,
  multipleChoiceQuizWords,
  navigate,
  quizState,
  wordsData,
}) => {
  const correctAudio = useMemo(() => new Audio(Correct), []);
  const incorrectAudio = useMemo(() => new Audio(Wrong), []);
  // const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  // const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = multipleChoiceQuizWords[quizState.index];

  useEffect(() => {
    if (isAnswerCorrect === true) {
      correctAudio.play();
    } else if (isAnswerCorrect === false) {
      incorrectAudio.play();
    }
  }, [correctAudio, incorrectAudio, isAnswerCorrect]);

  const handleAnswerClick = useCallback(
    (answerIndex: number) => {
      setSelectedAnswer(answerIndex);
      const correct =
        answerIndex ===
        currentQuestion[0].options.findIndex(
          (el) => el === currentQuestion[0].word_id,
        );
      setIsAnswerCorrect(correct);
      if (correct) {
        setScore(score + 1);
        handleSubmitPositive(currentQuestion[0]);
      } else {
        handleSubmitNegative(currentQuestion[0]);
      }
    },
    [currentQuestion, handleSubmitNegative, handleSubmitPositive, score],
  );

  const handleNextQuestion = useCallback(() => {
    if (quizState.index < multipleChoiceQuizWords.length - 1) {
      // setCurrentQuestionIndex(currentQuestionIndex + 1);
      goToNextWord();
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
    } else {
      // setQuizCompleted(true);
      // onComplete();
      goToNextWord();
    }
  }, [goToNextWord, multipleChoiceQuizWords.length, quizState.index]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (selectedAnswer === null) {
        const keyNumber = parseInt(event.key);
        if (keyNumber >= 1 && keyNumber <= currentQuestion[0].options.length) {
          handleAnswerClick(keyNumber - 1);
        }
      } else if (event.key === ' ' || event.key === 'Enter') {
        handleNextQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [selectedAnswer, currentQuestion, handleAnswerClick, handleNextQuestion]);

  // const restartQuiz = () => {
  //   setCurrentQuestionIndex(0);
  //   setSelectedAnswer(null);
  //   setIsAnswerCorrect(null);
  //   setScore(0);
  //   setQuizCompleted(false);
  // };

  // if (quizCompleted) {
  //   return (
  //     <Layout>
  //       <Stack flex={1} align='center'>
  //         <Grid w={'100%'} align='center' mb='xl'>
  //           <Grid.Col span={2}>
  //             <CloseButton onClick={() => navigate(-1)} />
  //           </Grid.Col>
  //           <Grid.Col span={8}>
  //             <Progress
  //               transitionDuration={200}
  //               value={(quizState.index / (wordsData?.length || 0 - 1)) * 100}
  //               // value={
  //               //   ((currentQuestionIndex + 1) /
  //               //     multipleChoiceQuizWords.length) *
  //               //   100
  //               // }
  //               size='lg'
  //               radius='lg'
  //             />
  //           </Grid.Col>
  //           <Grid.Col
  //             span={2}
  //             style={{
  //               marginLeft: 'auto',
  //               display: 'flex',
  //               justifyContent: 'flex-end',
  //             }}
  //           >
  //             <ActionIcon
  //               size='lg'
  //               variant='subtle'
  //               aria-label='Exclude word'
  //               onClick={() =>
  //                 handleExcludeWordClick(wordsData![quizState.index])
  //               }
  //             >
  //               <IconEyeOff stroke={2} />
  //             </ActionIcon>
  //           </Grid.Col>
  //         </Grid>
  //         <Container size='sm'>
  //           <Paper shadow='xs' p='md' mt='xl'>
  //             <Title order={2} mb='md'>
  //               Quiz Completed!
  //             </Title>
  //             <Text size='xl' mb='md'>
  //               Congratulations on finishing the quiz!
  //             </Text>
  //             <Text size='lg' mb='xl'>
  //               Your final score: {score}/{multipleChoiceQuizWords.length}
  //             </Text>
  //             <Button
  //               onClick={restartQuiz}
  //               leftSection={<IconRefresh size='1rem' />}
  //               fullWidth
  //             >
  //               Restart Quiz
  //             </Button>
  //           </Paper>
  //         </Container>
  //       </Stack>
  //     </Layout>
  //   );
  // }

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
              // value={
              //   ((quizState.index + 1) / multipleChoiceQuizWords.length) *
              //   100
              // }
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
          {/* <Title order={2} mb='md'>
            Quiz
          </Title> */}
          {/* <Text>
            {`Question ${currentQuestionIndex + 1} of ${multipleChoiceQuizWords.length}`}
          </Text> */}
          {/* <Progress
            value={
              ((currentQuestionIndex + 1) / multipleChoiceQuizWords.length) *
              100
            }
            mb='md'
          /> */}
          <Title ta='center' fw={500} mb='md'>
            {currentQuestion[0].info[0].glosses}
          </Title>
          <Stack>
            {currentQuestion[0].options.map((option, index) => (
              <Button
                size='lg'
                key={index}
                onClick={() => handleAnswerClick(index)}
                variant={
                  selectedAnswer === index
                    ? isAnswerCorrect
                      ? 'filled'
                      : 'filled'
                    : 'outline'
                }
                color={
                  selectedAnswer === index
                    ? isAnswerCorrect
                      ? 'green'
                      : 'red'
                    : 'blue'
                }
                disabled={selectedAnswer !== null}
                fullWidth
              >
                {option.split('-')[0]}
              </Button>
            ))}
          </Stack>
          {isAnswerCorrect !== null && (
            <Alert
              icon={
                isAnswerCorrect ? (
                  <IconCheck size='1rem' />
                ) : (
                  <IconAlertCircle size='1rem' />
                )
              }
              title={isAnswerCorrect ? 'Correct!' : 'Incorrect'}
              color={isAnswerCorrect ? 'green' : 'red'}
              mt='md'
            >
              {isAnswerCorrect
                ? 'Great job! You got it right.'
                : `The correct answer is: ${currentQuestion[0].word_id}`}
            </Alert>
          )}
          {selectedAnswer !== null && (
            <Group justify='space-between' mt='md'>
              <Text>
                Score: {score}/{quizState.index + 1}
              </Text>
              <Button
                onClick={handleNextQuestion}
                rightSection={<IconChevronRight size='1rem' />}
              >
                {quizState.index < multipleChoiceQuizWords.length - 1
                  ? 'Next Question'
                  : 'Finish Quiz'}
              </Button>
            </Group>
          )}
        </Paper>
        {/* </Container> */}
      </Stack>
    </Layout>
  );
};

export default Quiz;
