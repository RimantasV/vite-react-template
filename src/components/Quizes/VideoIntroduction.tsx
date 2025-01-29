import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ActionIcon,
  Badge,
  Button,
  Card,
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
import { IconChevronRight, IconEyeOff } from '@tabler/icons-react';

import { Layout, SentenceRow, Video } from '../../components';
import { TextToSpeech } from '../../components/TextToSpeech';
import RenderFlag from '../../pages/Quiz/RenderFlag';
import { useExamplesQuery } from '../../queries';
import { useLanguageStore } from '../../store';
import { QUIZ_STEPS, TRANSLATION_STATUS, Wordx } from '../../types/types';

type Props = {
  wordsData: Wordx[][];
  isPendingWords: boolean;
  isErrorWords: boolean;
  wordsError: Error | null;
  quizState: {
    step: QUIZ_STEPS;
    index: number;
    translation: TRANSLATION_STATUS;
  };
  handleSubmitPositive: (x: Wordx) => void;
  handleExcludeWordClick: (word: Wordx[]) => void;
};

export default function VideoIntroduction({
  wordsData,
  isPendingWords,
  isErrorWords,
  wordsError,
  quizState,
  handleSubmitPositive,
  handleExcludeWordClick,
}: Props) {
  const navigate = useNavigate();
  const { selectedLanguage } = useLanguageStore();

  const {
    isPending: isPendingExamples,
    isError: isErrorExamples,
    data: examplesData,
    error: examplesError,
  } = useExamplesQuery(
    selectedLanguage!.language_id,
    'mediaItemId',
    wordsData![quizState.index][0].word_id,
  );

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === ' ' || event.key === 'Enter') {
        handleSubmitPositive(wordsData![quizState.index][0]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleSubmitPositive, quizState.index, wordsData]);

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

        {isPendingWords && <Text>Loading...</Text>}
        {isErrorWords && <Text>Error: {wordsError?.message}</Text>}
        <Group w='100%'>
          <Paper px='md' w='40%'>
            {isPendingExamples ? (
              <span>Loading...</span>
            ) : isErrorExamples ? (
              <span>Error: {examplesError?.message}</span>
            ) : (
              examplesData.filter((el) => el.video_id).length > 0 && (
                <>
                  <Title order={3} mb='md'>
                    Video examples
                  </Title>
                  <Video
                    examples={examplesData
                      .filter((el) => el.video_id)
                      .slice(0, 1)}
                  />
                </>
              )
            )}
          </Paper>
          <Card shadow='md' bg='whitesmoke' flex={1} w='50%' mb='xl' p='xl'>
            {/* Foreign word */}
            <Card.Section p='xl' withBorder>
              <Flex justify='center' align='center'>
                <Paper mr='md' bg='gray' p='sm' radius='xl'>
                  <TextToSpeech
                    autoplay
                    text={wordsData![quizState.index][0].word_id.split('-')[0]}
                  />
                </Paper>
                <Title fz={42} order={2}>
                  {wordsData![quizState.index][0].word_id.split('-')[0]}
                </Title>
              </Flex>
            </Card.Section>
            {/* Translation */}
            <Card.Section p='xl' mah='300' style={{ overflow: 'auto' }}>
              <Flex justify='center'>
                {wordsData![quizState.index].map((el, i) => (
                  <Group key={i} align='center'>
                    <Badge>{el.word_id.split('-')[1]}</Badge>
                    <Group key={i} style={{ display: 'flex' }}>
                      {<RenderFlag tags={el.info[0].tags} />}
                      <Text size='xl'>{el.info[0].glosses}</Text>
                    </Group>
                  </Group>
                ))}
              </Flex>
            </Card.Section>
          </Card>
          <Paper px='md' w='100%'>
            {isPendingExamples ? (
              <span>Loading...</span>
            ) : isErrorExamples ? (
              <span>Error: {examplesError?.message}</span>
            ) : (
              examplesData.length > 0 && (
                <>
                  <Title order={3} mb='md'>
                    Exampes
                  </Title>
                  <SentenceRow
                    sentenceObj={examplesData[0]}
                    handleWordClick={() => {}}
                  />
                </>
              )
            )}
          </Paper>

          <Group w='100%' justify='end'>
            <Button
              onClick={() =>
                handleSubmitPositive(wordsData![quizState.index][0])
              }
              rightSection={<IconChevronRight size='1rem' />}
            >
              Continue
            </Button>
          </Group>
        </Group>
      </Stack>
    </Layout>
  );
}
