import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  CloseButton,
  Flex,
  Grid,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconCheck, IconRepeat } from '@tabler/icons-react';

import { Layout } from '../../components';
import { QUIZ_STEPS, TRANSLATION_STATUS, Wordx } from '../../types/types';

type Props = {
  wordsData: Wordx[][];
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
};

export default function Quiz({ wordsData, quizState, setQuizState }: Props) {
  const navigate = useNavigate();
  const [progressValue, setProgressValue] = useState(80);

  const resetQuizState = () => {
    setProgressValue(80);
    setQuizState({
      step: QUIZ_STEPS.SETTINGS,
      translation: TRANSLATION_STATUS.HIDDEN,
      index: 0,
    });
  };

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
                You have reviewed {wordsData?.length} word
                {(wordsData?.length || 0) > 1 && 's'}
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
