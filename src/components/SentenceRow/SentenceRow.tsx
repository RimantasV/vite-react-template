import { ActionIcon, Flex, Paper, Space, Text } from '@mantine/core';
import { IconStar } from '@tabler/icons-react';

import { SentenceObj } from '../../types';
import { TextToSpeech } from '../TextToSpeech';

import styles from './sentenceRow.module.scss';

type Props = {
  handleWordClick: React.MouseEventHandler<HTMLParagraphElement>;
  sentenceObj: SentenceObj;
};

export default function SentenceRow({ handleWordClick, sentenceObj }: Props) {
  return (
    <Paper className={styles.item} radius='sm' p='xs' shadow='xs'>
      <Flex align='center' justify='space-between' gap='lg'>
        <TextToSpeech autoplay={false} text={sentenceObj.sentence_original} />
        <ActionIcon bg='lightgrey' variant='default' radius='md' size={36}>
          <IconStar color='yellow' stroke={1.5} />
        </ActionIcon>
        <div style={{ flex: '1' }}>
          <Text
            fz='h4'
            onClick={handleWordClick}
            dangerouslySetInnerHTML={{
              __html: sentenceObj.sentence_html,
            }}
          />
          <Space h='xs' />
          <Text fz='sm' className={styles.translation}>
            {sentenceObj.sentence_en_semantic}
          </Text>
          <Text className={styles.translation} fz='sm' ta='right'>
            {sentenceObj.title}
          </Text>
        </div>
      </Flex>
    </Paper>
  );
}
