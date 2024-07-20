import { useCallback, useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import { FaRegCircleCheck } from 'react-icons/fa6';

import styles from './vocabularyLevel.module.scss';
import { Layout } from '../../components';
import { Stack, Title } from '@mantine/core';

type Words = {
  word: string;
  occurencies: number;
  chapters: string[];
  frequency: number;
}[];

export default function VocabularyLevel() {
  const [words, setWords] = useState<Words>([]);
  const [vocabularyLevel, setVocabularyLevel] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem('vocabularyLevel');
    if (saved) {
      setVocabularyLevel(JSON.parse(saved));
    }
  }, []);

  const fetchVocabulary = useCallback(async () => {
    const response = await fetch(
      `https://spanish-api.up.railway.app/api/vocabulary/espejismo/`
    );
    const data: Words = await response.json();
    setWords(data.filter((el) => !el.word.endsWith('*')));
  }, []);

  useEffect(() => {
    fetchVocabulary();
  }, [fetchVocabulary]);

  // @ts-expect-error fff
  const levelClicked = (x) => {
    const wordId = x.currentTarget.getAttribute('data-level');
    setVocabularyLevel(Number.parseInt(wordId));
    localStorage.setItem('vocabularyLevel', JSON.stringify(wordId));
  };

  return (
    <Layout>
      <Stack>
        <Title>Set your vocabulary level</Title>
        <div
          data-level='100'
          className={`${styles.levelContainer} ${
            vocabularyLevel >= 100 ? styles.active : ''
          }`}
          onClick={levelClicked}
        >
          <FaRegCircleCheck
            className={`${styles.checkmarkIcon} ${
              vocabularyLevel >= 100 ? styles.visible : ''
            }`}
          />
          <h6>1-100</h6>
          <div className={styles.wordContainer}>
            {words
              .filter((el) => el.frequency === 100)
              .sort((a, b) => b.occurencies - a.occurencies)
              .map((word) => (
                // <Link key={word.word} to={`../examples/${word.word}`}>
                <div className={styles.word} key={word.word}>
                  {word.word.split('-')[0]}
                </div>
                // </Link>
              ))}
          </div>
        </div>
        <div
          data-level='200'
          className={`${styles.levelContainer} ${
            vocabularyLevel >= 200 ? styles.active : ''
          }`}
          onClick={levelClicked}
        >
          <FaRegCircleCheck
            className={`${styles.checkmarkIcon} ${
              vocabularyLevel >= 200 ? styles.visible : ''
            }`}
          />
          <h6>101-200</h6>
          <div className={styles.wordContainer}>
            {words
              .filter((el) => el.frequency === 200)
              .sort((a, b) => b.occurencies - a.occurencies)
              .map((word) => (
                // <Link key={word.word} to={`../examples/${word.word}`}>
                <div className={styles.word} key={word.word}>
                  {word.word.split('-')[0]}
                </div>
                // </Link>
              ))}
          </div>
        </div>
        <div
          data-level='500'
          className={`${styles.levelContainer} ${
            vocabularyLevel >= 500 ? styles.active : ''
          }`}
          onClick={levelClicked}
        >
          <FaRegCircleCheck
            className={`${styles.checkmarkIcon} ${
              vocabularyLevel >= 500 ? styles.visible : ''
            }`}
          />
          <h6>201-500</h6>
          <div className={styles.wordContainer}>
            {words
              .filter((el) => el.frequency === 500)
              .sort((a, b) => b.occurencies - a.occurencies)
              .map((word) => (
                // <Link key={word.word} to={`../examples/${word.word}`}>
                <div className={styles.word} key={word.word}>
                  {word.word.split('-')[0]}
                </div>
                // </Link>
              ))}
          </div>
        </div>
        <div
          data-level='1000'
          className={`${styles.levelContainer} ${
            vocabularyLevel >= 1000 ? styles.active : ''
          }`}
          onClick={levelClicked}
        >
          <FaRegCircleCheck
            className={`${styles.checkmarkIcon} ${
              vocabularyLevel >= 1000 ? styles.visible : ''
            }`}
          />
          <h6>501-1000</h6>
          <div className={styles.wordContainer}>
            {words
              .filter((el) => el.frequency === 1000)
              .sort((a, b) => b.occurencies - a.occurencies)
              .map((word) => (
                // <Link key={word.word} to={`../examples/${word.word}`}>
                <div className={styles.word} key={word.word}>
                  {word.word.split('-')[0]}
                </div>
                // </Link>
              ))}
          </div>
        </div>
        <div
          data-level='2000'
          className={`${styles.levelContainer} ${
            vocabularyLevel >= 2000 ? styles.active : ''
          }`}
          onClick={levelClicked}
        >
          <FaRegCircleCheck
            className={`${styles.checkmarkIcon} ${
              vocabularyLevel >= 2000 ? styles.visible : ''
            }`}
          />
          <h6>1001-2000</h6>
          <div className={styles.wordContainer}>
            {words
              .filter((el) => el.frequency === 2000)
              .sort((a, b) => b.occurencies - a.occurencies)
              .map((word) => (
                // <Link key={word.word} to={`../examples/${word.word}`}>
                <div className={styles.word} key={word.word}>
                  {word.word.split('-')[0]}
                </div>
                // </Link>
              ))}
          </div>
        </div>
        <div
          data-level='5000'
          className={`${styles.levelContainer} ${
            vocabularyLevel >= 5000 ? styles.active : ''
          }`}
          onClick={levelClicked}
        >
          <FaRegCircleCheck
            className={`${styles.checkmarkIcon} ${
              vocabularyLevel >= 5000 ? styles.visible : ''
            }`}
          />
          <h6>2001-5000</h6>
          <div className={styles.wordContainer}>
            {words
              .filter((el) => el.frequency === 5000)
              .sort((a, b) => b.occurencies - a.occurencies)
              .map((word) => (
                // <Link key={word.word} to={`../examples/${word.word}`}>
                <div className={styles.word} key={word.word}>
                  {word.word.split('-')[0]}
                </div>
                // </Link>
              ))}
          </div>
        </div>
        <div
          data-level='8000'
          className={`${styles.levelContainer} ${
            vocabularyLevel >= 8000 ? styles.active : ''
          }`}
          onClick={levelClicked}
        >
          <FaRegCircleCheck
            className={`${styles.checkmarkIcon} ${
              vocabularyLevel >= 8000 ? styles.visible : ''
            }`}
          />
          <h6>5001-8000</h6>
          <div className={styles.wordContainer}>
            {words
              .filter((el) => el.frequency === 8000)
              .sort((a, b) => b.occurencies - a.occurencies)
              .map((word) => (
                // <Link key={word.word} to={`../examples/${word.word}`}>
                <div className={styles.word} key={word.word}>
                  {word.word.split('-')[0]}
                </div>
                // </Link>
              ))}
          </div>
        </div>
        <div
          data-level='11000'
          className={`${styles.levelContainer} ${
            vocabularyLevel >= 11000 ? styles.active : ''
          }`}
          onClick={levelClicked}
        >
          <FaRegCircleCheck
            className={`${styles.checkmarkIcon} ${
              vocabularyLevel >= 11000 ? styles.visible : ''
            }`}
          />
          <h6>8001-11000</h6>
          <div className={styles.wordContainer}>
            {words
              .filter((el) => el.frequency === 11000)
              .sort((a, b) => b.occurencies - a.occurencies)
              .map((word) => (
                // <Link key={word.word} to={`../examples/${word.word}`}>
                <div className={styles.word} key={word.word}>
                  {word.word.split('-')[0]}
                </div>
                // </Link>
              ))}
          </div>
        </div>
      </Stack>
    </Layout>
  );
}
