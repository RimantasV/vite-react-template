import { ChangeEvent, useEffect, useState } from 'react';

import {
  Group,
  List,
  Modal,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
  UnstyledButton,
  lighten,
  rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronRight } from '@tabler/icons-react';

import { AddWordToListModal, Layout } from '../../components';
import { useSearchDictionaryQuery } from '../../queries';
import { useLanguageStore } from '../../store';
import { EnglishTranslation } from '../../types/types';

import styles from './dictionary.module.scss';

type Word = { word_id: string; info: EnglishTranslation };

export default function Dictionary() {
  const { selectedLanguage } = useLanguageStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeWord, setActiveWord] = useState('');
  // const [words, setWords] = useState<Word[]>([]);
  const [opened, { open, close }] = useDisclosure(false);

  // const fetchWords = useCallback(async () => {
  //   const ENDPOINT = `${
  //     import.meta.env.VITE_BASE_URL
  //   }/api/dictionary/search/${searchTerm}?lang=${selectedLanguage?.language_id}`;

  //   const response = await fetch(ENDPOINT);
  //   const data: Word[] = await response.json();

  //   setWords(
  //     data
  //       .sort(
  //         (a, b) =>
  //           a.word_id.split('-')[0].length - b.word_id.split('-')[0].length,
  //       )
  //       .slice(0, 10),
  //   );
  // }, [searchTerm, selectedLanguage]);

  const {
    // isPending: isPendingSearchDictionary,
    isError: isErrorSearchDictionary,
    data: searchDictionaryData,
    isFetching,
    // error: searchDictionaryError,
    refetch,
  } = useSearchDictionaryQuery(selectedLanguage!.language_id, searchTerm);

  // const handleSearch = () => {
  //   if (searchTerm) {
  //     // fetchWords();
  //     refetch();
  //   }
  // };

  const handleLearn = (word: Word) => {
    // fetchUserCreatedLists();
    setActiveWord(word.word_id);
    open();
  };

  const handleSearchTermChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.currentTarget.value);
  };

  useEffect(() => {
    if (searchTerm) {
      // fetchWords();
      refetch();
    }
  }, [refetch, searchTerm]);

  return (
    <div>
      <Layout>
        <Group w='100%'>
          <TextInput
            flex='1'
            label='Search Dictionary'
            // description='Search Dictionary'
            placeholder='Input placeholder...'
            size='xl'
            value={searchTerm}
            onChange={(event) => handleSearchTermChange(event)}
            mb='xl'
          />
          {/* <Button size='xl' onClick={handleSearch}>
            Search
          </Button> */}
        </Group>
        {/* <List listStyleType='none' w='100%'> */}
        {!searchDictionaryData && isFetching ? (
          <>
            <Skeleton mb='sm' height={64} radius='sm' />
            <Skeleton mb='sm' height={64} radius='sm' />
            <Skeleton mb='sm' height={64} radius='sm' />
            <Skeleton mb='sm' height={64} radius='sm' />
            <Skeleton mb='sm' height={64} radius='sm' />
          </>
        ) : isErrorSearchDictionary ? (
          <Text>Error occured. Try realoding the page</Text>
        ) : Array.isArray(searchDictionaryData) &&
          !searchDictionaryData.length ? (
          <Text>No data found...</Text>
        ) : (
          searchDictionaryData?.map((word, i) => (
            // <List.Item key={i} w='100%'>
            <UnstyledButton
              key={i}
              className={styles.user}
              onClick={() => handleLearn(word)}
            >
              <Group key={i} w='100%' justify='space-between'>
                {/* <Group w={'100%'} flex={1} align='center'> */}
                {/* <Stack flex={1}> */}
                <Stack flex={1} gap={0}>
                  <Group align='baseline' gap='xs'>
                    <Title order={4}>{word.word_id.split('-')[0]}</Title>
                    <Text size='xs'>
                      {'(' + word.word_id.split('-')[1] + ')'}
                    </Text>
                  </Group>
                  {/* <Text c={lighten('dark', 0.45)} flex={1} lineClamp={1}>
                    {word.info.translation.reduce(
                      (acc, curr) =>
                        acc ? acc + '; ' + curr.glosses : acc + curr.glosses,
                      '',
                    )}
                  </Text> */}
                  <List>
                    {word.info.translation.map((el) => (
                      <List.Item>
                        <Text c={lighten('dark', 0.45)} flex={1}>
                          {el.glosses}
                        </Text>
                      </List.Item>
                    ))}
                  </List>
                </Stack>
                {/* </Stack> */}
                <IconChevronRight
                  style={{ width: rem(14), height: rem(14) }}
                  stroke={1.5}
                />
              </Group>
              {/* </Group> */}
            </UnstyledButton>
            //  </List.Item>
          ))
        )}
        {/* </List> */}
      </Layout>
      <Modal opened={opened} onClose={close} withCloseButton={false} centered>
        <AddWordToListModal close={close} activeWord={activeWord} />
      </Modal>
    </div>
  );
}
