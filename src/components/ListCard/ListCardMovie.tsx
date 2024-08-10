import { Link } from 'react-router-dom';

import { Button, Card, Group, Text } from '@mantine/core';
import { IconBook, IconCheck, IconMovie } from '@tabler/icons-react';

import classes from './ListCard.module.css';

type Props = {
  isFollowing: boolean;
  linkToList: string;
  linkToSubtitles: string;
  mediaItemId: string;
  name: string;
};

export function ListCardMovie({
  isFollowing,
  linkToList,
  linkToSubtitles,
  mediaItemId,
  name,
}: Props) {
  return (
    <Card
      withBorder
      radius='md'
      p='md'
      className={classes.card}
      flex={1}
      miw={300}
      maw={400}
    >
      <Group>
        <Text fz='h3' fw={500} lineClamp={1}>
          {name}
        </Text>
        {isFollowing && <IconCheck />}
      </Group>
      <Group mt='xs'>
        <Button
          to={linkToSubtitles}
          component={Link}
          radius='md'
          style={{ flex: 1 }}
        >
          <Group>
            <IconMovie />
            Subtitles
          </Group>
        </Button>
        <Button
          component={Link}
          state={{ listName: name, mediaItemId }}
          to={linkToList}
          variant='outline'
          radius='md'
          style={{ flex: 1 }}
        >
          <Group>
            <IconBook />
            Vocabulary
          </Group>
        </Button>
      </Group>
    </Card>
  );
}
