import { useState } from 'react';
import { Sheet } from 'react-modal-sheet';
import { useNavigate, useParams } from 'react-router-dom';

import { ActionIcon, Container, Group, Tooltip } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconTrash } from '@tabler/icons-react';

import {
  ExamplesMoviesModal,
  ListTitle,
  VocabularyListRow,
} from '../../components';
import {
  useDeleteListMutation,
  useDeleteWordFromListMutation,
  useUpdateWordStatusMutation,
  useUserCreatedListVocabularyQuery,
} from '../../queries';
import { useLanguageStore } from '../../store';
import { Wordx } from '../../types/types';

import './sheet.scss';

export default function List() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedLanguage } = useLanguageStore();
  const [activeWord, setActiveWord] = useState<Wordx>();
  const [isOpen, setOpen] = useState(false);

  const {
    isPending: isPendingWords,
    isError: isErrorWords,
    data: wordsData,
    error: wordsError,
  } = useUserCreatedListVocabularyQuery(
    selectedLanguage!.language_id,
    parseInt(id!),
  );

  const { mutate } = useUpdateWordStatusMutation();
  const { mutate: mutateDeleteWord } = useDeleteWordFromListMutation();
  const { mutate: mutateDeleteList } = useDeleteListMutation();

  const handleExcludeClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    word: Wordx[],
  ) => {
    e.stopPropagation();
    word.forEach((el) =>
      mutate({
        language: selectedLanguage!.language_id,
        word: el,
        isLearning: false,
        isExcluded: true,
        id: parseInt(id!),
      }),
    );
  };

  const handleDeleteWordClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    word: Wordx[],
  ) => {
    e.stopPropagation();
    word.forEach((el) =>
      mutateDeleteWord({
        lang: selectedLanguage!.language_id,
        wordId: el.word_id,
        customItemId: id!,
      }),
    );
  };

  const handleDeleteListClick = () => {
    mutateDeleteList(
      {
        lang: selectedLanguage!.language_id,
        customItemId: id!,
      },
      {
        onSuccess: () => {
          notifications.show({
            color: 'blue',
            // title: data.list,
            message: 'List has been deleted',
          });
          navigate('../learn');
        },
        onError(error) {
          notifications.show({
            color: 'red',
            message: error.message,
          });
        },
      },
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
      <Group align='baseline'>
        <ListTitle />
        <Tooltip label='Delete list'>
          <ActionIcon
            onClick={handleDeleteListClick}
            variant='subtle'
            color='red'
            size='sm'
            radius='xl'
            aria-label='Delete list'
          >
            <IconTrash style={{ width: '100%', height: '100%' }} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      </Group>
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
              hasDeleteIcon={true}
              key={id}
              item={item}
              handleExcludeClick={handleExcludeClick}
              handleDeleteWordClick={handleDeleteWordClick}
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
              <ExamplesMoviesModal activeWord={activeWord!} mediaItemId='' />
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
