import { ActionIcon, Flex, Modal, Text, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEyeOff, IconPlaylistAdd, IconTrash } from '@tabler/icons-react';

import { Wordx } from '../../types';
import { getDisplayDate, getNextReviewDate } from '../../utils';
import { AddWordToListModal } from '../AddWordToListModal';

import styles from './vocabularyListRow.module.scss';

type Props = {
  item: Wordx[];
  handleExcludeClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    word: Wordx[],
  ) => void;
  setActiveWord: React.Dispatch<React.SetStateAction<Wordx | undefined>>;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  hasAddToListIcon?: boolean;
  hasDeleteIcon?: boolean;
  handleDeleteWordClick?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    word: Wordx[],
  ) => void;
};

export default function VocabularyListRow({
  item,
  handleExcludeClick,
  handleDeleteWordClick,
  hasAddToListIcon,
  hasDeleteIcon,
  setActiveWord,
  setShow,
}: Props) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div className={styles.item}>
      <div
        onClick={() => {
          setShow(true);
          setActiveWord(item[0]);
        }}
        style={{ flex: '1', cursor: 'pointer' }}
      >
        <Text>{item[0].word_id.split('-')[0]}</Text>
        {item.map((item, i) => (
          <Text key={i} c='blue' size='lg'>
            {item.word_id.split('-')[1]} - {item.info?.[0].glosses}
          </Text>
        ))}
      </div>
      <Flex gap='lg' justify='center'>
        <Tooltip label='Due for review'>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label='Due for review'
          >
            {getDisplayDate(
              getNextReviewDate(item[0].learning_level, item[0].last_answer_ts),
            )}
          </div>
        </Tooltip>

        {hasAddToListIcon && (
          <Tooltip label='Add word to your own list'>
            <ActionIcon
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              variant='subtle'
              color='blue'
              size='xl'
              radius='xl'
              aria-label='Add word to your own list'
            >
              <IconPlaylistAdd
                style={{ width: '70%', height: '70%' }}
                stroke={1.5}
              />
            </ActionIcon>
          </Tooltip>
        )}
        <Tooltip label='Exclude word from all quizes'>
          <ActionIcon
            onClick={(e) => handleExcludeClick(e, item)}
            variant='subtle'
            color='gray'
            size='xl'
            radius='xl'
            aria-label='Exclude word from all quizes'
          >
            <IconEyeOff style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
        {hasDeleteIcon && (
          <Tooltip label='Delete word from list'>
            <ActionIcon
              onClick={(e) =>
                handleDeleteWordClick && handleDeleteWordClick(e, item)
              }
              variant='subtle'
              color='red'
              size='xl'
              radius='xl'
              aria-label='Delete word from list'
            >
              <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        )}
      </Flex>
      <Modal opened={opened} onClose={close} withCloseButton={false} centered>
        <AddWordToListModal close={close} activeWord={item[0].word_id} />
      </Modal>
    </div>
  );
}
