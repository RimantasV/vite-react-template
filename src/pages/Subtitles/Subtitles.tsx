import { useCallback, useState } from 'react';
import { Sheet } from 'react-modal-sheet';
import { useSearchParams } from 'react-router-dom';

import {
  ActionIcon,
  Checkbox,
  Flex,
  Group,
  NativeSelect,
  Pagination,
  Paper,
  Skeleton,
  Space,
  Stack,
  Text,
} from '@mantine/core';
import { IconStar } from '@tabler/icons-react';

import { Layout } from '../../components';
import { SheetContent } from '../../components/';
import { useSubtitlesQuery } from '../../queries';
import { useLanguageStore } from '../../store';
import { DictionaryRecord } from '../../types';

import styles from '../../components/SheetContent/sheetContent.module.scss';
import styles2 from './subtitles.module.scss';

enum SORT_ORDER {
  CHRONOLOGICALLY = 'Chronologically',
  SHORTEST_TO_LONGEST = 'Shortest to longest',
  LONGEST_TO_SHORTEST = 'Longest to shortest',
}

export default function Subtitles() {
  const [searchParams] = useSearchParams();
  // const type = searchParams.get('type');
  // const key = searchParams.get('key');
  const { selectedLanguage } = useLanguageStore();
  const mediaItemId = searchParams.get('media-item-id');

  const [dictionaryRecord, setDictionaryRecord] = useState<DictionaryRecord[]>(
    [],
  );
  const [isOpen, setOpen] = useState(false);
  const [activeWords, setActiveWords] = useState<string[]>();
  const [activeForm, setActiveForm] = useState<string>();
  const [isExpanded, setIsExpanded] = useState(false);

  const [orderBy, setOrderBy] = useState('');
  const [activePage, setPage] = useState(1);

  const {
    isPending: isPendingSubtitles,
    isError: isErrorSubtitles,
    data: subtitlesData,
    error: subtitlesError,
  } = useSubtitlesQuery(selectedLanguage, mediaItemId!);

  const fetchDictionaryRecord = useCallback(
    async (id: string) => {
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/dictionary/${id}?lang=${selectedLanguage}`,
      );

      const data: DictionaryRecord[] = await response.json();
      if (data[0].word_id) {
        setDictionaryRecord((prevState) => [...prevState, data[0]]);
      }
    },
    [selectedLanguage],
  );

  const fetchEng = (wordIdArray: string[]) => {
    if (wordIdArray && wordIdArray?.length > 0) {
      const filtered = [
        ...new Set(wordIdArray.filter((el) => !el.endsWith('*'))),
      ];

      filtered.forEach((word: string) => {
        fetchDictionaryRecord(word);
      });
    } else {
      setDictionaryRecord([]);
    }
  };

  const handleWordClick: React.MouseEventHandler<HTMLParagraphElement> = (
    e,
  ) => {
    const target = e.target as HTMLParagraphElement;

    if (!target.classList.contains('clickable')) return;
    target.classList.toggle(styles.highlight);

    const wordId = target.dataset.wordId;
    let wordIdArray: string[] = [];
    if (wordId) {
      wordIdArray = wordId?.split('_');
    }

    if (wordId) {
      setActiveForm(target.textContent!);
      setActiveWords(wordIdArray);
      setOpen(true);
      fetchEng(wordIdArray);
    }
  };

  return (
    <Layout>
      <Stack w='100%'>
        <Group align='center'>
          <NativeSelect
            label='Order by'
            description='Select sorting criteria'
            value={orderBy}
            onChange={(event) => setOrderBy(event.currentTarget.value)}
            data={[
              SORT_ORDER.CHRONOLOGICALLY,
              SORT_ORDER.LONGEST_TO_SHORTEST,
              SORT_ORDER.SHORTEST_TO_LONGEST,
            ]}
          />
          <Checkbox
            maw={190}
            defaultChecked
            label='Show translation'
            description='Show english translation under each sentence'
          />
        </Group>
        <Pagination
          value={activePage}
          onChange={setPage}
          siblings={1}
          total={Math.ceil((subtitlesData?.length || 0) / 100)}
          mx='auto'
        />
        {isPendingSubtitles ? (
          <>
            <Skeleton height={64} radius='sm' />
            <Skeleton height={64} radius='sm' />
            <Skeleton height={64} radius='sm' />
            <Skeleton height={64} radius='sm' />
            <Skeleton height={64} radius='sm' />
          </>
        ) : isErrorSubtitles ? (
          <Text>Error: {subtitlesError?.message}</Text>
        ) : (
          subtitlesData
            .slice(100 * (activePage - 1), 100 * activePage)
            .map((sentenceObj, i) => (
              <Paper key={i} bg='whitesmoke' radius='sm' p='xs' shadow='xs'>
                <Flex align='center' justify='space-between' gap='xs'>
                  <div>
                    <Text
                      key={i}
                      fz='h4'
                      onClick={handleWordClick}
                      dangerouslySetInnerHTML={{
                        __html: sentenceObj.sentence_html,
                      }}
                    />
                    <Space h='xs' />
                    <Text fz='sm' className={styles2.translation}>
                      {sentenceObj.sentence_en_semantic}
                    </Text>
                  </div>
                  <ActionIcon
                    bg='lightgrey'
                    variant='default'
                    radius='md'
                    size={36}
                  >
                    <IconStar color='yellow' stroke={1.5} />
                  </ActionIcon>
                </Flex>
              </Paper>
            ))
        )}
        <Pagination
          value={activePage}
          onChange={setPage}
          total={Math.ceil((subtitlesData?.length || 0) / 100)}
          mx='auto'
        />
        <Sheet
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          detent='content-height'
          onCloseEnd={() => {
            setIsExpanded(false);
            const el = document.querySelector(`.${styles.highlight}`);
            el?.classList.toggle(`${styles.highlight}`);
          }}
        >
          <Sheet.Container>
            <Sheet.Header />
            <Sheet.Content>
              <SheetContent
                activeWords={activeWords}
                activeForm={activeForm!}
                dictionaryRecord={dictionaryRecord}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                setOpen={setOpen}
              />
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop
            onTap={() => {
              setOpen(false);
            }}
          />
        </Sheet>
      </Stack>
    </Layout>
  );
}
