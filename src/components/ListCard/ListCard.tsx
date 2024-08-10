import { Link } from 'react-router-dom';

import { Button, Card, Container, Group, Text } from '@mantine/core';
import { IconBook } from '@tabler/icons-react';

import classes from './ListCard.module.css';

interface CommonProps {
  name: string;
  to?: string;
}
interface PropsWithKey extends CommonProps {
  title: string;
  id?: never;
  mediaType: string;
  segmentTitle: string;
  mediaItemId: string;
}
interface PropsWithId extends CommonProps {
  title?: never;
  mediaType?: never;
  segmentTitle?: never;
  id: string;
  mediaItemId?: never;
}
type Props = PropsWithKey | PropsWithId;

export function ListCard({
  to,
  name,
  title,
  id,
  mediaType,
  segmentTitle,
  mediaItemId,
}: Props) {
  return (
    <Container size='350'>
      <Card withBorder radius='md' p='md' className={classes.card}>
        <Text fz='h3' fw={500} lineClamp={1}>
          {name} {mediaType === 'series' ? `- ${segmentTitle}` : ''}
        </Text>
        <Group mt='xs'>
          <Button
            to={`${
              id
                ? `../quiz?id=${id}`
                : `../quiz-movie?media-item-id=${mediaItemId}&mediaType=${mediaType}&key=${title}&segmentTitle=${segmentTitle}`
            }  `}
            component={Link}
            radius='md'
            style={{ flex: 1 }}
          >
            <Group>
              <IconBook />
              Quiz
            </Group>
          </Button>
          {to && (
            <Button
              component={Link}
              state={{ listName: name }}
              to={to}
              variant='outline'
              radius='md'
              style={{ flex: 1 }}
            >
              Vocabulary
            </Button>
          )}
          {title && (
            <Button
              component={Link}
              state={{ listName: name, mediaItemId }}
              to={`../movie/${title}`}
              variant='outline'
              radius='md'
              style={{ flex: 1 }}
            >
              Vocabulary
            </Button>
          )}
        </Group>
      </Card>
    </Container>
  );
}
