import { useCallback, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import { useLanguageStore } from '../../store';
import { EnglishTranslation, SentencesRespose, Wordx } from '../../types/types';
import { Video } from '../index';

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
  translationStatus = 'visible',
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
        },
      ],
    });

  const fetchExamples = useCallback(async () => {
    const ENDPOINT = `${
      import.meta.env.VITE_BASE_URL
    }/api/sentences-movies?lang=${selectedLanguage}&media-item-id=${mediaItemId}&word=${activeWord.word_id}`;

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
      // resource: el.resource,
      // key: el.key,
      // chapter_or_episode: el.chapter_or_episode,
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
    }));

    setExamples(dataWithClass);
  }, [activeWord.word_id, id, mediaItemId, selectedLanguage]);

  const fetchDictionaryRecord = useCallback(async () => {
    const response = await fetch(
      `${
        import.meta.env.VITE_BASE_URL
      }/api/dictionary/${id}?lang=${selectedLanguage}`,
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

  const getCountryCode = (el: string[]) => {
    const country = el[0];

    switch (country) {
      case 'Argentina':
        return 'AR';
      case 'Mexico':
        return 'MX';
      case 'Costa-Rica':
        return 'CR';
      case 'Spain':
        return 'ES';

      default:
        return '';
    }
  };

  const renderFlag = (tags: string | string[] | undefined) => {
    if (Array.isArray(tags)) {
      if (
        tags.some((el) =>
          ['Argentina', 'Costa-Rica', 'Mexico', 'Spain'].includes(el),
        )
      ) {
        const countryCode = getCountryCode(
          tags.filter((el) =>
            ['Argentina', 'Costa-Rica', 'Mexico', 'Spain'].includes(el),
          ),
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
    <div className={styles.layout}>
      <div style={{ marginInline: 'auto', maxWidth: '800px' }}>
        {!renderOnlyExampes && (
          <div className={styles.translationsCard}>
            <div className={styles.headerContainer}>
              <h2>{id?.split('-')[0]}</h2>
              <p>{id?.split('-')[1]}</p>
            </div>
            <div className={styles.languageContainer}>
              <div className={styles.flagContainer}>
                <img
                  title={'us'}
                  src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg`}
                />
              </div>
              <ol>
                {englishTranslation?.translation?.map((el, i) => (
                  <li key={i}>
                    {renderFlag(el.tags)}
                    {/* {`${el.glosses} (${el.tags?.join(' ')})`} */}
                    {`${el.glosses} `}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
        <Video examples={examples} />

        <div style={{ flex: '1' }}>
          <h3>Examples</h3>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {examples.length > 0 ? (
              examples.map((el) => (
                <li
                  key={el.id}
                  style={{
                    backgroundColor: '#e2e1e1',
                    padding: '10px',
                    maxWidth: '800px',
                  }}
                >
                  <p
                    style={{ margin: '0', marginBottom: '5px' }}
                    dangerouslySetInnerHTML={{ __html: el.sentence_html }}
                  ></p>

                  <p
                    className={
                      translationStatus === 'hidden'
                        ? styles.hidden
                        : styles.visible
                    }
                    style={{
                      margin: '0',
                      marginBottom: '5px',
                      fontSize: '14px',
                    }}
                  >
                    {el.sentence_en_semantic}
                  </p>

                  <p
                    style={{
                      margin: '0',
                      fontSize: '14px',
                      color: 'grey',
                      textAlign: 'right',
                    }}
                  >
                    {el.media_item_id}
                  </p>
                </li>
              ))
            ) : (
              <Skeleton count={10} />
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExamplesMoviesModal;
