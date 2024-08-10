import { ActionIcon, Flex, Text } from '@mantine/core';
import { IconEyeOff } from '@tabler/icons-react';

import { Wordx } from '../../types';
import { getDisplayDate, getNextReviewDate } from '../../utils';

import styles from './vocabularyListRow.module.scss';

type Props = {
  item: Wordx[];
  handleExcludeClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    word: Wordx[],
  ) => void;
  setActiveWord: React.Dispatch<React.SetStateAction<Wordx | undefined>>;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function VocabularyListRow({
  item,
  handleExcludeClick,
  setActiveWord,
  setShow,
}: Props) {
  return (
    <div
      className={styles.item}
      onClick={() => {
        setShow(true);
        setActiveWord(item[0]);
      }}
    >
      <div>
        <Text>{item[0].word_id.split('-')[0]}</Text>
        {item.map((item, i) => (
          <Text key={i} c='blue' size='lg'>
            {item.word_id.split('-')[1]} - {item.info?.[0].glosses}
          </Text>
        ))}
      </div>
      <Flex gap='lg' justify='center'>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {getDisplayDate(
            getNextReviewDate(item[0].learning_level, item[0].last_answer_ts),
          )}
        </div>
        <ActionIcon
          onClick={(e) => handleExcludeClick(e, item)}
          variant='subtle'
          color='gray'
          size='xl'
          radius='xl'
          aria-label='Delete'
        >
          {/* //TODO: in vocabulary lists, add delte from list option instead or in addition to exclude option */}
          {/* <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} /> */}
          <IconEyeOff style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
      </Flex>
    </div>
  );
}
