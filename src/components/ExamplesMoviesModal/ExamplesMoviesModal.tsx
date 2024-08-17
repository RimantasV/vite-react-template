import { useCallback, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import { Paper, Stack } from '@mantine/core';

import { useLanguageStore } from '../../store';
import { EnglishTranslation, SentencesRespose, Wordx } from '../../types/types';
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
  const [examples, setExamples] = useState<SentencesRespose>([]);
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

  const fetchExamples = useCallback(async () => {
    const ENDPOINT = `${
      import.meta.env.VITE_BASE_URL
    }/api/sentences-movies?lang=${selectedLanguage?.language_id}&media-item-id=${mediaItemId}&word=${activeWord.word_id}`;

    const response = await fetch(ENDPOINT);
    const data: SentencesRespose = await response.json();

    const re2 = new RegExp(
      `<span class="clickable resolved" data-word-id="[^>]*?${id}[^*].*?>`,
      'gm',
    );
    const re = new RegExp(
      `<span class="clickable" data-word-id="[^>]*?${id}.*?>`,
      'gm',
    );

    const dataWithClass = data.map((el) => ({
      id: el.id,
      sentence: el.sentence_original,
      sentence_html: el.sentence_html
        .replace(re, `<span class="example" data-word-id="${id}">`)
        .replace(re2, `<span class="example" data-word-id="${id}">`)
        .replaceAll('class="clickable"', '')
        .replaceAll('class="clickable resolved"', '')
        .replaceAll('class="clickable multiple"', ''),
      sentence_en_semantic: el.sentence_en_semantic,
      sentence_id: el.sentence_id,
      sentence_original: el.sentence_original,
      sentence_en_literal: el.sentence_en_literal,
      sentence_index: el.sentence_index,
      media_item_id: el.media_item_id,
      sentence_timestamps: el.sentence_timestamps,
      word_ids: el.word_ids,
      is_verified: el.is_verified,
      created_at: el.created_at,
      sentence_start_time: el.sentence_start_time,
      sentence_end_time: el.sentence_end_time,
      media_type: el.media_type,
      title: el.title,
      segment_title: el.segment_title,
      video_id: el.video_id,
    }));

    setExamples(dataWithClass);
  }, [activeWord.word_id, id, mediaItemId, selectedLanguage]);

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
    fetchExamples();
    if (!renderOnlyExampes) {
      fetchDictionaryRecord();
    }
  }, [fetchDictionaryRecord, fetchExamples, renderOnlyExampes]);

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
        <Video examples={examples} />
      </Paper>
      <div style={{ flex: '1' }}>
        <Paper px='md'>
          <h3>Examples</h3>
        </Paper>
        <Stack px='md' pb='md'>
          {examples.length > 0 ? (
            examples.map((el, i) => (
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
