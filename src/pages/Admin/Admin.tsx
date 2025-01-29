import { useCallback, useEffect, useState } from 'react';

import { Button, Container, Flex, Input } from '@mantine/core';

import { useLanguageStore } from '../../store';
import { SentenceObj } from '../../types';
import Sentence from './Sentence';
import WordVerification from './WordVerification';
import { getWordIdsFromSentence } from './utils';

export default function Admin() {
  const { selectedLanguage } = useLanguageStore();

  const [sentences, setSentences] = useState<SentenceObj[]>([]);
  const [wordId, setWordId] = useState<string>('');

  const fetchUnverifiedSentences = useCallback(async () => {
    console.log('fetchUnverifiedSentences');
    let url = `${
      import.meta.env.VITE_BASE_URL
    }/api/sentences-unverified?lang=${selectedLanguage?.language_id}`;

    if (wordId) {
      console.log({ wordId });
      url += `&wordId=${wordId}`;
    }
    console.log({ url });
    const response = await fetch(url);

    const data: SentenceObj[] = await response.json();

    const dataWithClass = data.slice(0, 1);

    setSentences(dataWithClass);
  }, [selectedLanguage?.language_id, wordId]);

  const rejectSentence = useCallback(
    async (sentenceId: string, reasonId: number) => {
      const payload = {
        sentenceId,
        isVerified: false,
        reasonId,
      };

      const url = `${
        import.meta.env.VITE_BASE_URL
      }/api/sentence?lang=${selectedLanguage?.language_id}`;
      console.log({ wordId });

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Accept: 'application.json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        fetchUnverifiedSentences();
      } else throw new Error((await response.json()).message);
    },

    [fetchUnverifiedSentences, selectedLanguage?.language_id, wordId],
  );

  const acceptSentence = useCallback(
    async (
      sentenceId: string,
      reasonId: number | null,
      sentenceHtml: string,
      sentenceEnSemantic: string,
      sentenceEnLiteral: string,
    ) => {
      const payload = {
        sentenceId,
        isVerified: true,
        reasonId,
        sentenceHtml,
        wordIds: getWordIdsFromSentence(sentenceHtml),
        sentenceEnSemantic,
        sentenceEnLiteral,
      };
      console.log(payload);
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/sentence?lang=${selectedLanguage?.language_id}`,
        {
          method: 'PUT',
          headers: {
            Accept: 'application.json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        fetchUnverifiedSentences();
      } else throw new Error((await response.json()).message);
    },

    [fetchUnverifiedSentences, selectedLanguage?.language_id],
  );

  useEffect(() => {
    fetchUnverifiedSentences();
  }, [fetchUnverifiedSentences]);

  const handleSetWordId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWordId(event.target.value);
  };

  return (
    <div>
      <Container size='lg'>
        <WordVerification setWordId={setWordId} />
        <Flex>
          <Button mr='md' onClick={fetchUnverifiedSentences}>
            Refresh
          </Button>
          <Input
            type='text'
            placeholder='Word id'
            value={wordId}
            onChange={handleSetWordId}
          />
        </Flex>
      </Container>
      {sentences.map((sentence) => (
        <Container key={sentence.sentence_id} size='lg'>
          <Sentence
            sentence={sentence}
            rejectSentence={rejectSentence}
            acceptSentence={acceptSentence}
          />
        </Container>
      ))}
    </div>
  );
}
