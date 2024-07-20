import { Button, Card, Container, Group, Text } from '@mantine/core';
import classes from './ListCard.module.css';
import { Link } from 'react-router-dom';
import { IconBook } from '@tabler/icons-react';

interface CommonProps {
  name: string;
  to?: string;
}
interface PropsWithKey extends CommonProps {
  key_: string;
  id?: never;
}
interface PropsWithId extends CommonProps {
  key_?: never;
  id: string;
}
type Props = PropsWithKey | PropsWithId;

export function ListCard({ to, name, key_, id }: Props) {
  return (
    <Container size='350'>
      <Card withBorder radius='md' p='md' className={classes.card}>
        <Text fz='h3' fw={500} lineClamp={1}>
          {name}
        </Text>
        <Group mt='xs'>
          <Button
            to={`${id ? `../quiz?id=${id}` : `../quiz-movie?key=${key_}`}  `}
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
          {key_ && (
            <Button
              component={Link}
              state={{ listName: name }}
              to={`../movies/${key_}`}
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
