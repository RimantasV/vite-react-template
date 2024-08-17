import { useEffect, useState } from 'react';
import { Sheet } from 'react-modal-sheet';
import { useParams } from 'react-router-dom';

import {
  Button,
  Container,
  Flex,
  Group,
  Pagination,
  Paper,
  RangeSlider,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
  rem,
} from '@mantine/core';
import {
  IconBook,
  IconCheck,
  IconEyeOff,
  IconPlus,
  IconX,
} from '@tabler/icons-react';

import { ExamplesMoviesModal, VocabularyListRow } from '../../components';
import {
  useMovieVocabularyQuery,
  useResourceStatusQuery,
  useToggleFollowQuery,
  useUpdateWordStatusMutation,
} from '../../queries';
import { useLanguageStore } from '../../store';
import { Wordx } from '../../types/types';

import styles from './movie.module.scss';

export default function Movie() {
  const { selectedLanguage } = useLanguageStore();
  const { mutate } = useUpdateWordStatusMutation();
  const { id } = useParams();
  const [activePage, setPage] = useState(1);
  const [isOpen, setOpen] = useState(false);
  const [activeWord, setActiveWord] = useState<Wordx>();
  const [isFollowing, setIsFollowing] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const iconStyle = { width: rem(12), height: rem(12) };
  const [sliderValue, setSliderValue] = useState<[number, number]>([1, 3]);

  const {
    // isPending: isPendingToggleQuery,
    // isError: isErrorToggleQuery,
    // data: toggleQueryData,
    // error: toggleQueryError,
    refetch: refetchToggleQuery,
  } = useToggleFollowQuery(selectedLanguage!.language_id, id!, setIsFollowing);

  const {
    isPending: isPendingResourceStatus,
    isError: isErrorResourceStatus,
    data: resourceStatusData,
    // error: resourceStatusError,
  } = useResourceStatusQuery(selectedLanguage!.language_id, id!);

  const {
    isPending: isPendingWords,
    isError: isErrorWords,
    data: wordsData,
    error: wordsError,
  } = useMovieVocabularyQuery(selectedLanguage!.language_id, id!);

  useEffect(() => {
    setIsFollowing(resourceStatusData?.is_following || false);
  }, [resourceStatusData]);

  const handleExcludeClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    word: Wordx[],
  ) => {
    e.stopPropagation();
    word.forEach((el) =>
      mutate({
        language: selectedLanguage!.language_id,
        word: el,
        isLearning: false,
        isExcluded: true,
        id: parseInt(id!),
      }),
    );
  };

  // const handleLearnClick = (word: Wordx[]) => {
  //   word.forEach((el) =>
  //     mutate({
  //       language: selectedLanguage!.language_id,
  //       word: el,
  //       isLearning: true,
  //       isExcluded: false,
  //       id: parseInt(id!),
  //     }),
  //   );
  // };

  const handleToggleFollowing = () => {
    refetchToggleQuery();
  };

  if (isPendingWords) {
    return <span>Loading...</span>;
  }

  if (isErrorWords) {
    return <span>Error: {wordsError?.message}</span>;
  }

  const handleFilterChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setFilterValue(e.target.value);
    setPage(1);
  };

  const filteredWordsData = wordsData.filter((word) =>
    word.some(
      (el) =>
        ((el.frequency >= sliderValue[0] && el.frequency <= sliderValue[1]) ||
          !el.frequency) &&
        (el.word_id
          .toLowerCase()
          .replace('í', 'i')
          .replace('ó', 'o')
          .replace('á', 'a')
          .replace('ú', 'u')
          .replace('é', 'e')
          .replace('ñ', 'n')
          .includes(
            filterValue
              .toLowerCase()
              .replace('í', 'i')
              .replace('ó', 'o')
              .replace('á', 'a')
              .replace('ú', 'u')
              .replace('é', 'e')
              .replace('ñ', 'n'),
          ) ||
          el.info.some((el) =>
            el.glosses.toLowerCase().includes(filterValue.toLowerCase()),
          )),
    ),
  );

  return (
    <Container size='lg'>
      <div className={styles.titleContainer}>
        <Flex align='baseline' my='lg'>
          {isPendingResourceStatus ? (
            <Text>Loading...</Text>
          ) : isErrorResourceStatus ? (
            <Text>Error ocurred, try refreshing page</Text>
          ) : (
            <Stack gap={0}>
              <Title>{resourceStatusData.details.originalTitle}</Title>
              <Text size='lg' c='gray' fw='bolder'>
                {resourceStatusData.segment_title}
              </Text>
            </Stack>
          )}
        </Flex>
      </div>
      <Group align='start'>
        <TextInput
          autoComplete='off'
          label='Search for words'
          type='search'
          name='search'
          id='search'
          value={filterValue}
          onChange={handleFilterChange}
          placeholder='Enter search term'
          rightSection={
            <IconX
              onClick={() => {
                setFilterValue('');
                setPage(1);
              }}
              style={{ width: rem(16), height: rem(16) }}
            />
          }
        />
        <Paper>
          <Text size='sm'>FIlter by frequency</Text>
          <RangeSlider
            minRange={0}
            min={1}
            max={3}
            step={1}
            marks={[
              { value: 1, label: '1' },
              { value: 2, label: '2' },
              { value: 3, label: '3' },
            ]}
            value={sliderValue}
            onChange={setSliderValue}
            w='300px'
          />
        </Paper>

        <Button
          onClick={handleToggleFollowing}
          my='lg'
          loading={isPendingResourceStatus}
          loaderProps={{ type: 'oval' }}
          leftSection={
            isFollowing ? <IconCheck size={14} /> : <IconPlus size={14} />
          }
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Button>
      </Group>
      <Tabs defaultValue='learning'>
        <Tabs.List>
          <Tabs.Tab
            value='learning'
            leftSection={<IconBook style={iconStyle} />}
          >
            Learning
          </Tabs.Tab>
          <Tabs.Tab
            value='excluded'
            leftSection={<IconEyeOff style={iconStyle} />}
          >
            Excluded
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='learning'>
          <Title order={2} my='lg'>
            Learning
          </Title>
          <Pagination
            value={activePage}
            onChange={setPage}
            siblings={1}
            total={Math.ceil((filteredWordsData.length || 0) / 100)}
            mx='auto'
            my='lg'
          />
          <ul style={{ listStyle: 'none', padding: '0' }}>
            {filteredWordsData
              .slice(100 * (activePage - 1), 100 * activePage)
              .filter((word) => !word[0].marked_to_exclude)
              .sort((a, b) => {
                if (a[0].nextReviewDate === null) {
                  return 1;
                }
                if (b[0].nextReviewDate === null) {
                  return -1;
                }
                return (
                  new Date(a[0].nextReviewDate).getTime() -
                  new Date(b[0].nextReviewDate).getTime()
                );
              })
              .map((item, id) => (
                <VocabularyListRow
                  hasAddToListIcon={true}
                  key={id}
                  item={item}
                  handleExcludeClick={handleExcludeClick}
                  setActiveWord={setActiveWord}
                  setShow={setOpen}
                />
              ))}
          </ul>
          <Sheet
            isOpen={isOpen}
            onClose={() => setOpen(false)}
            detent='content-height'
          >
            <Sheet.Container>
              <Sheet.Header />
              <Sheet.Content>
                <Sheet.Scroller>
                  <ExamplesMoviesModal
                    activeWord={activeWord!}
                    // resourceKey={''}
                    mediaItemId={id!}
                  />
                </Sheet.Scroller>
              </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop
              onTap={() => {
                setOpen(false);
              }}
            />
          </Sheet>
        </Tabs.Panel>
        <Tabs.Panel value='excluded'>
          <Title order={2} mb='lg'>
            Excluded
          </Title>
          <ul style={{ listStyle: 'none', padding: '0' }}>
            {filteredWordsData
              .filter((word) => word[0].marked_to_exclude)
              .map((item, id) => (
                <VocabularyListRow
                  hasAddToListIcon={true}
                  key={id}
                  item={item}
                  handleExcludeClick={handleExcludeClick}
                  setActiveWord={setActiveWord}
                  setShow={setOpen}
                />
              ))}
            {/* // <li key={i} className={styles.rowContainer}> */}
            {/* //   <div className={styles.wordCard}> */}
            {/* //     <div> */}
            {/* //       <p>{el[0].word_id.split('-')[0]}</p> */}
            {/* //       {el.map((el, i) => ( */}
            {/* //         <p key={i}> */}
            {/* //           {el.word_id.split('-')[1]} - {el.info[0].glosses} */}
            {/* //         </p> */}
            {/* //       ))} */}
            {/* //     </div> */}
            {/* //   </div> */}
            {/* //   <button onClick={() => handleLearnClick(el)}>Learn</button> */}
            {/* // </li> */}
            {/* // ))} */}
          </ul>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
