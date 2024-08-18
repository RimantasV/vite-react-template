import { useNavigate } from 'react-router-dom';

import {
  ActionIcon,
  Card,
  CloseButton,
  Flex,
  Grid,
  List,
  Paper,
  Progress,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconCheck, IconEye, IconEyeOff, IconX } from '@tabler/icons-react';

import { Layout } from '../../components';
import { TextToSpeech } from '../../components/TextToSpeech';
import RenderFlag from '../../pages/Quiz/RenderFlag';
import { QUIZ_STEPS, TRANSLATION_STATUS, Wordx } from '../../types/types';

import styles from '../../pages/Learn/learn.module.scss';
import styles2 from '../../pages/Quiz/quiz.module.scss';

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
  setQuizState: React.Dispatch<
    React.SetStateAction<{
      step: QUIZ_STEPS;
      index: number;
      translation: TRANSLATION_STATUS;
    }>
  >;
  handleSubmitPositive: (x: Wordx) => void;
  handleSubmitNegative: (x: Wordx) => void;
  handleExcludeWordClick: (word: Wordx[]) => void;
  //   handleUpdateWordProgress: ({ word, learningLevel, lastAnswerTs, markedToLearn, markedToExclude, }: WordProgressPayload) => Promise<void>
};

export default function Quiz({
  wordsData,
  isPendingWords,
  isErrorWords,
  wordsError,
  quizState,
  setQuizState,
  handleSubmitNegative,
  handleSubmitPositive,
  handleExcludeWordClick,
}: Props) {
  //   const { selectedLanguage } = useLanguageStore();
  //   const [searchParams] = useSearchParams();
  //   const id = searchParams.get('id');
  //   const [, setWords] = useState<Wordsx>([]);
  // const [quizWords, setQuizWords] = useState<Wordsx>([]);
  // const [translationStatus, setTranslationStatus] = useState<
  //   'hidden' | 'visible'
  // >('hidden');
  // const [activeKey, setActiveKey] = useState<string | number>('');
  const navigate = useNavigate();
  //   const [quizState, setQuizState] = useState({
  //     step: QUIZ_STEPS.SETTINGS,
  //     index: 0,
  //     translation: TRANSLATION_STATUS.HIDDEN,
  //   });

  //   const goToNextWord = () => {
  //     setQuizState((prevState) => {
  //       const isLastWord = wordsData!.length - 1 === prevState.index;
  //       return {
  //         step: isLastWord ? QUIZ_STEPS.SUMMARY : QUIZ_STEPS.FLASHCARDS,
  //         translation: TRANSLATION_STATUS.HIDDEN,
  //         index: isLastWord ? 0 : prevState.index + 1,
  //       };
  //     });
  //   };

  //   type WordProgressPayload = {
  //     word: string;
  //     learningLevel: number;
  //     lastAnswerTs: Date;
  //     markedToLearn: boolean;
  //     markedToExclude: boolean;
  //   };

  // const {
  // //   isPending: isPendingWords,
  // //   isError: isErrorWords,
  // //   data: wordsData,
  // //   error: wordsError,
  // } = useUserCreatedListVocabularyQuery(
  //   selectedLanguage!.language_id,
  //   parseInt(id!),
  // );

  const handleTranslationReveal = () => {
    setQuizState((prevState) => ({
      ...prevState,
      translation: TRANSLATION_STATUS.VISIBLE,
    }));
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
        <Stack w='100%'>
          <Card shadow='md' bg='whitesmoke' flex={1} w='100%' mb='xl' p='xl'>
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
              {wordsData![quizState.index].map((el, i) => (
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
                    {el.info?.map((el, i) => (
                      <List.Item key={i}>
                        <div style={{ display: 'flex' }}>
                          {<RenderFlag tags={el.tags} />}
                          <Text size='xl'>{el.glosses}</Text>
                        </div>
                      </List.Item>
                    ))}
                  </List>
                </div>
              ))}
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
                    handleSubmitPositive(wordsData![quizState.index][0])
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
                    handleSubmitNegative(wordsData![quizState.index][0])
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
