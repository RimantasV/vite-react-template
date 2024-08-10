import { Link } from 'react-router-dom';

import { Container, Group, Text, Title, UnstyledButton } from '@mantine/core';

import { MyLists, MyMoviesAndTV } from '../../components';

export default function Learn() {
  return (
    <Container size='lg'>
      <Title p='lg' order={1}>
        Continue learning
      </Title>
      <Group align='flex-start' p='lg' justify='flex-start' w='max-content'>
        <UnstyledButton component={Link} to={'../lists'}>
          <Group>
            <Text fw={700} size='xl'>
              My Lists
            </Text>
            <Text size='xl'>{'>'}</Text>
          </Group>
        </UnstyledButton>
      </Group>
      <MyLists />
      <Group align='flex-start' p='lg' justify='flex-start' w='max-content'>
        <UnstyledButton component={Link} to={'../movies-and-tv'}>
          <Group>
            <Text fw={700} size='xl'>
              Movies & TV
            </Text>
            <Text size='xl'>{'>'}</Text>
          </Group>
        </UnstyledButton>
      </Group>
      <MyMoviesAndTV />
    </Container>
  );
}
