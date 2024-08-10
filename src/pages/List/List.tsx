import { useState } from 'react';
import { Sheet } from 'react-modal-sheet';
import { useParams } from 'react-router-dom';

import { Container } from '@mantine/core';

import {
  ExamplesMoviesModal,
  ListTitle,
  VocabularyListRow,
} from '../../components';
import {
  useUpdateWordStatusMutation,
  useUserCreatedListVocabularyQuery,
} from '../../queries';
import { useLanguageStore } from '../../store';
import { Wordx } from '../../types/types';

import './sheet.scss';

export default function List() {
  const { id } = useParams();
  const { selectedLanguage } = useLanguageStore();
  const [activeWord, setActiveWord] = useState<Wordx>();
  const [isOpen, setOpen] = useState(false);

  const {
    isPending: isPendingWords,
    isError: isErrorWords,
    data: wordsData,
    error: wordsError,
  } = useUserCreatedListVocabularyQuery(selectedLanguage, parseInt(id!));

  const { mutate } = useUpdateWordStatusMutation();

  const handleExcludeClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    word: Wordx[],
  ) => {
    e.stopPropagation();
    word.forEach((el) =>
      mutate({
        word: el,
        isLearning: false,
        isExcluded: true,
        id: parseInt(id!),
      }),
    );
  };

  if (isPendingWords) {
    return <span>Loading...</span>;
  }

  if (isErrorWords) {
    return <span>Error: {wordsError?.message}</span>;
  }

  return (
    <Container size='lg'>
      <ListTitle />
      <ul style={{ listStyle: 'none', padding: '0' }}>
        {wordsData
          .filter((word) => !word[0].marked_to_exclude)
          .sort((a, b) => {
            if (a[0].nextReviewDate === null) {
              return 1;
            }
            if (b[0].nextReviewDate === null) {
              return -1;
            }
            return (
              new Date(a[0].nextReviewDate).getTime() -
              new Date(b[0].nextReviewDate).getTime()
            );
          })
          .map((item, id) => (
            <VocabularyListRow
              key={id}
              item={item}
              handleExcludeClick={handleExcludeClick}
              setActiveWord={setActiveWord}
              setShow={setOpen}
            />
          ))}
      </ul>
      <Sheet
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        detent='content-height'
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <Sheet.Scroller>
              <ExamplesMoviesModal activeWord={activeWord!} resourceKey={''} />
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop
          onTap={() => {
            setOpen(false);
          }}
        />
      </Sheet>
    </Container>
  );
}
