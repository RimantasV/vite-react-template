import { Button, Card, Group, Text } from '@mantine/core';
import { IconBook, IconCheck, IconMovie } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import classes from './ListCard.module.css';

type Props = {
  name: string;
  linkToSubtitles: string;
  linkToList: string;
  isFollowing: boolean;
};

export function ListCardMovie({
  name,
  linkToList,
  linkToSubtitles,
  isFollowing,
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
          state={{ listName: name }}
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
