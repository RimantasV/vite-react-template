import {
  Button,
  Card,
  // Container,
  Flex,
  Group,
  Indicator,
  NumberInput,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Wordx } from '../../../types';

type Props = {
  onClick: () => {};
  wordsData: Wordx[][] | undefined;
};

export default function Settings({ onClick, wordsData }: Props) {
  const numberOfWords = wordsData?.length;
  const numberOfWordsDue = wordsData?.filter(
    (el) => new Date(el[0].nextReviewDate!).getTime() < new Date().getTime()
  ).length;

  console.log(wordsData?.length);

  console.log({ numberOfWordsDue });

  return (
    // <Container my='lg' size='md' bg='whitesmoke'>
    <Card bg='whitesmoke' w='100%' mb='xl' p='xl'>
      <Card.Section withBorder p='md'>
        <Flex justify='space-between' align='center'>
          <Title order={2}>Quiz settings</Title>
          <Stack align='flex-end' justify='start' gap={0}>
            <Text>Words in list: {numberOfWords}</Text>
            <Text>Due for review: {numberOfWordsDue}</Text>
          </Stack>
        </Flex>
      </Card.Section>
      <Card.Section withBorder p='md'>
        <Title order={4} mb='md'>
          Quiz type
        </Title>
        <Group gap='xl' mx='md' justify='start'>
          <Button w='150' miw={'150'} flex={0} variant='filled'>
            Flashcard
          </Button>
          <Indicator
            position='top-center'
            offset={-5}
            inline
            color='red'
            label='Coming soon'
            size={24}
          >
            <Button disabled miw={'150'} flex={0} variant='default'>
              Multiple Choice
            </Button>
          </Indicator>
          <Indicator
            position='top-center'
            offset={-5}
            inline
            color='red'
            label='Coming soon'
            size={24}
          >
            <Button disabled miw={'150'} flex={0} variant='filled'>
              Writing
            </Button>
          </Indicator>
          {/* <Indicator
              position='top-center'
              offset={-5}
              inline
              color='red'
              label='Coming soon'
              size={24}
            >
              <Button disabled miw={'150'} flex={0} variant='filled'>
                Speed Review
              </Button>
            </Indicator> */}
        </Group>
      </Card.Section>
      <Card.Section withBorder p={'md'}>
        <Title order={4} mb='md'>
          Number of Words
        </Title>
        <NumberInput
          styles={{
            input: { fontSize: '30px' },
            wrapper: { width: '150px' },
          }}
          placeholder='0'
          step={5}
          min={5}
          max={100}
          defaultValue={10}
        />
      </Card.Section>
      <Card.Section withBorder p='xl'>
        <Group justify='center'>
          <Button onClick={onClick} size='xl' fz='xl'>
            Start Quiz
          </Button>
        </Group>
      </Card.Section>
    </Card>
    // </Container>
  );
}
