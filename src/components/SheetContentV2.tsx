import React, { FC } from 'react';
import { WordTranslation } from './WordTranslationV2';

import styles from './sheetContent.module.scss';
import { DictionaryRecord } from '../types';

type Props = {
  activeWords: string[] | undefined;
  activeForm: string;
  dictionaryRecord: DictionaryRecord[];
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const SheetContent: FC<Props> = ({
  activeWords,
  activeForm,
  isExpanded,
  setIsExpanded,
  setOpenModal,
  dictionaryRecord,
}) => {
  const handleLearningClick = () => {
    const filteredActiveWords = activeWords?.filter((el) => !el.endsWith('*'));
    const learning = localStorage.getItem('learning');
    if (!learning || (Array.isArray(learning) && learning.length === 0)) {
      if (filteredActiveWords) {
        localStorage.setItem('learning', JSON.stringify(filteredActiveWords));
      }
    } else {
      if (filteredActiveWords) {
        const newState = new Set([
          ...JSON.parse(learning),
          ...filteredActiveWords,
        ]);
        localStorage.setItem('learning', JSON.stringify([...newState]));
      }
    }
    setOpenModal(false);
  };

  function removeTextInBrackets(input: string): string {
    const regex = /\s*\([^)]*\)\s*$/;

    return input.replace(regex, '');
  }

  const handleReadMoreClick = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const shouldRenderReadMoreButton = activeWords?.some((word) => {
    const record = dictionaryRecord.find((record) => record.word === word);
    const hasMoreThanTwoTranslations = record
      ? record.info.translation.length > 2
      : false;
    const hasBracketsAtTheEnd = dictionaryRecord
      .find((record) => record.word === word)
      ?.info.translation.some((translation) => {
        return (
          translation.glosses.trim() !==
          removeTextInBrackets(translation.glosses).trim()
        );
      });

    return hasMoreThanTwoTranslations || hasBracketsAtTheEnd;
  });

  return (
    <div className={styles.content}>
      <div className={styles.wrapper}>
        {
          <div className={styles.wordCard}>
            {activeWords
              ?.filter((el) => !el.endsWith('*'))
              .map((word) =>
                dictionaryRecord
                  .find((record) => record.word === word)
                  ?.info.forms.filter((el) => el.form === activeForm)
                  .map((el, i) => {
                    return el.tags ? (
                      <p key={i} className={styles.form}>{`${
                        el.form
                      } - ${el.tags?.join(' ')} form of ${
                        word.split('-')[0]
                      }`}</p>
                    ) : null;
                  })
              )}
          </div>
        }
        <div className={styles.wordCard}>
          {activeWords
            ?.filter((el) => !el.endsWith('*'))
            .map((el, i) => (
              <WordTranslation
                excluded={false}
                key={el + i}
                el={el}
                // words={words[el]}
                words={
                  dictionaryRecord.find((record) => record.word === el)?.info
                    .translation
                }
                isExpanded={isExpanded}
              />
            ))}
          {activeWords
            ?.filter((el) => el.endsWith('*'))
            .map((el, i) => (
              <WordTranslation
                excluded={true}
                key={el + i}
                el={el}
                // words={words[el]}
                words={
                  dictionaryRecord.find((record) => record.word === el)?.info
                    .translation
                }
                isExpanded={isExpanded}
              />
            ))}
        </div>
      </div>
      <div className={styles.toolbar}>
        <button
          className={styles.button}
          onClick={() => {
            setOpenModal(false);
          }}
        >
          Dismiss
        </button>
        {shouldRenderReadMoreButton && (
          <button className={styles.button} onClick={handleReadMoreClick}>
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
        <button className={styles.button} onClick={handleLearningClick}>
          Learn
        </button>
      </div>
    </div>
  );
};

export { SheetContent };
