import { useCallback, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import { Paper, Stack } from '@mantine/core';

import { useExamplesQuery } from '../../queries';
import { useLanguageStore } from '../../store';
import { EnglishTranslation, Wordx } from '../../types/types';
import { DictionaryTranslationCard, SentenceRow, Video } from '../index';

import styles from '../../pages/Dictionary/examples.module.scss';

// import { useSearchParams } from 'react-router-dom';

type Props = {
  activeWord: Wordx;
  // resourceKey: string;
  renderOnlyExampes?: boolean;
  translationStatus?: 'hidden' | 'visible';
  // episode?: string;
  mediaItemId: string;
};

const ExamplesMoviesModal: React.FC<Props> = ({
  activeWord,
  // resourceKey,
  // episode,
  renderOnlyExampes = false,
  // translationStatus = 'visible',
  mediaItemId,
}) => {
  //   const [searchParams] = useSearchParams();
  //   const id = searchParams.get('word');
  const { selectedLanguage } = useLanguageStore();
  const id = activeWord.word_id;

  const {
    isPending: isPendingExamples,
    isError: isErrorExamples,
    data: examplesData,
    error: examplesError,
  } = useExamplesQuery(selectedLanguage!.language_id, mediaItemId, id);

  // const [examples, setExamples] = useState<SentencesResponse>([]);
  const [englishTranslation, setEnglishTranslation] =
    useState<EnglishTranslation>({
      forms: [
        {
          form: '',
          tags: [],
        },
      ],
      translation: [
        {
          glosses: '',
          tags: [],
        },
      ],
    });

  const fetchDictionaryRecord = useCallback(async () => {
    const response = await fetch(
      `${
        import.meta.env.VITE_BASE_URL
      }/api/dictionary/${id}?lang=${selectedLanguage?.language_id}`,
    );

    const data = await response.json();
    setEnglishTranslation(data[0]?.info);
  }, [id, selectedLanguage]);

  useEffect(() => {
    // fetchExamples();
    if (!renderOnlyExampes) {
      fetchDictionaryRecord();
    }
  }, [fetchDictionaryRecord, renderOnlyExampes]);

  if (isPendingExamples) {
    return <span>Loading...</span>;
  }

  if (isErrorExamples) {
    return <span>Error: {examplesError?.message}</span>;
  }

  return (
    <div className={styles.layout}>
      {!renderOnlyExampes && (
        <Paper px='md'>
          <DictionaryTranslationCard
            wordId={id}
            englishTranslation={englishTranslation}
          />
        </Paper>
      )}
      <Paper px='md'>
        <Video examples={examplesData} />
      </Paper>
      <div style={{ flex: '1' }}>
        <Paper px='md'>
          <h3>Examples</h3>
        </Paper>
        <Stack px='md' pb='md'>
          {examplesData.length > 0 ? (
            examplesData.map((el, i) => (
              <SentenceRow
                key={i}
                sentenceObj={el}
                handleWordClick={() => {}}
              />
            ))
          ) : (
            <Skeleton count={10} />
          )}
        </Stack>
      </div>
    </div>
  );
};

export default ExamplesMoviesModal;
