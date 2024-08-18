import { useState } from 'react';

import {
  Button,
  Card,
  Flex,
  Group,
  NumberInput,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconCards,
  IconKeyboard,
  IconListCheck,
  IconPuzzle,
} from '@tabler/icons-react';

import { QUIZ_STEPS, Wordx } from '../../../types';

type Props = {
  wordsData: Wordx[][] | undefined;
  handleStartFlashcardsQuiz: () => void;
  handleStartMultipleChoiceQuiz: () => void;
  handleStartTypingQuiz: () => void;
  handleStartMatchingPairsQuiz: () => void;
};

export default function Settings({
  handleStartFlashcardsQuiz,
  handleStartMultipleChoiceQuiz,
  handleStartTypingQuiz,
  handleStartMatchingPairsQuiz,
  wordsData,
}: Props) {
  const numberOfWords = wordsData?.length;
  const numberOfWordsDue = wordsData?.filter(
    (el) => new Date(el[0].nextReviewDate!).getTime() < new Date().getTime(),
  ).length;

  const [selectedQuizType, setSelectedQuizType] = useState<QUIZ_STEPS>(
    QUIZ_STEPS.FLASHCARDS,
  );

  const handleButtonClick = (value: QUIZ_STEPS) => {
    setSelectedQuizType(value);
  };

  const options = [
    {
      name: 'Flashcard review',
      value: QUIZ_STEPS.FLASHCARDS,
      icon: <IconCards size='1rem' />,
      action: handleStartFlashcardsQuiz,
    },
    {
      name: 'Multiple choice',
      value: QUIZ_STEPS.MULTIPLE_CHOICE,
      icon: <IconListCheck size='1rem' />,
      action: handleStartMultipleChoiceQuiz,
    },
    {
      name: 'Typing',
      value: QUIZ_STEPS.TYPING,
      icon: <IconKeyboard size='1rem' />,
      action: handleStartTypingQuiz,
    },
    {
      name: 'Matching pairs',
      value: QUIZ_STEPS.MATCHING_PAIRS,
      icon: <IconPuzzle size='1rem' />,
      action: handleStartMatchingPairsQuiz,
    },
  ];

  const handleStartQuiz = () => {
    switch (selectedQuizType) {
      case QUIZ_STEPS.FLASHCARDS:
        return handleStartFlashcardsQuiz();
      case QUIZ_STEPS.MULTIPLE_CHOICE:
        return handleStartMultipleChoiceQuiz();
      case QUIZ_STEPS.TYPING:
        return handleStartTypingQuiz();
      case QUIZ_STEPS.MATCHING_PAIRS:
        return handleStartMatchingPairsQuiz();
      default:
        return null;
    }
  };

  return (
    <Card bg='whitesmoke' w='100%' mb='xl' p='xl'>
      <Card.Section withBorder p='md'>
        <Flex justify='space-between' align='center'>
          <Title order={2}>Quiz settings</Title>
          <Stack align='flex-end' justify='start' gap={0}>
            <Text>Words in list: {numberOfWords}</Text>
            <Text>Due for review: {numberOfWordsDue}</Text>
          </Stack>
        </Flex>
      </Card.Section>
      <Card.Section withBorder p='md'>
        <div style={{ padding: '20px' }}>
          <Title mb='md' order={3}>
            Select quiz type
          </Title>
          <Group>
            {options.map((option) => (
              <Button
                key={option.value}
                variant={
                  selectedQuizType === option.value ? 'filled' : 'outline'
                }
                color={selectedQuizType === option.value ? 'blue' : 'gray'}
                onClick={() => handleButtonClick(option.value)}
                leftSection={option.icon}
                size='lg'
                onAuxClick={option.action}
              >
                {option.name}
              </Button>
            ))}
          </Group>
        </div>
      </Card.Section>
      <Card.Section withBorder p={'md'}>
        <Title order={4} mb='md'>
          Number of Words
        </Title>
        <NumberInput
          styles={{
            input: { fontSize: '30px' },
            wrapper: { width: '150px' },
          }}
          placeholder='0'
          step={5}
          min={5}
          max={100}
          defaultValue={10}
        />
      </Card.Section>
      <Card.Section withBorder p='xl'>
        <Group justify='center'>
          <Button
            disabled={!selectedQuizType}
            onClick={handleStartQuiz}
            size='xl'
            fz='xl'
          >
            Start Quiz
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
}
