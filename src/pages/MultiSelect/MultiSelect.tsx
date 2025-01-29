import { useEffect, useState } from 'react';
import { Sheet } from 'react-modal-sheet';
import { useParams } from 'react-router-dom';

import {
  Box,
  Button,
  Checkbox,
  Container,
  Group, // Pagination,
  Paper,
  RangeSlider,
  Tabs,
  Text,
  Title,
  rem,
} from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { IconBook, IconEyeOff } from '@tabler/icons-react';

import {
  ExamplesMoviesModal,
  Translation,
  VocabularyListRow,
} from '../../components';
// import { NUMBER_OF_ITEMS_PER_PAGE } from '../../const';
import {
  useMovieVocabularyQuery,
  useUpdateWordStatusMutation,
} from '../../queries';
import { useLanguageStore } from '../../store';
import { Wordx } from '../../types/types';

export default function Movie() {
  const { selectedLanguage } = useLanguageStore();
  const { mutate } = useUpdateWordStatusMutation();
  const { id } = useParams();
  // const [activePage, setPage] = useState(1);
  const [isOpen, setOpen] = useState(false);
  const [activeWord, setActiveWord] = useState<Wordx>();
  // const [filterValue, setFilterValue] = useState('');
  const iconStyle = { width: rem(12), height: rem(12) };
  const [sliderValue, setSliderValue] = useState<[number, number]>([1, 3]);

  const {
    isPending: isPendingWords,
    isError: isErrorWords,
    data: filteredWordsData,
    error: wordsError,
  } = useMovieVocabularyQuery(selectedLanguage!.language_id, id!);

  // const [wordIdsList, setWordIdsList] =
  //   useState<{ id: string; checked: boolean }[]>();

  // useEffect(() => {
  //   if (filteredWordsData) {
  //     const data = filteredWordsData.map((el) => ({
  //       id: el[0].word_id,
  //       checked: false,
  //     }));

  //     setWordIdsList(data);
  //   }
  // }, [filteredWordsData]);

  // eslint-disable-next-line prefer-const
  let [values, handlers] = useListState<{
    id: string;
    translation: string;
    checked: boolean;
  }>([]);

  useEffect(() => {
    if (filteredWordsData) {
      filteredWordsData
        .filter((el) => !el[0].marked_to_exclude)
        // .slice(0, 100)
        .forEach((word, i) =>
          handlers.setItem(i, {
            id: `${word[0].word_id}`,
            translation: word[0].info[0].glosses,
            checked: false,
          }),
        );
    }
  }, [filteredWordsData]);

  const excludeAll = () => {
    const idsToExclude = values.filter((el) => el.checked).map((el) => el.id);
    const xxx = filteredWordsData?.filter((el) =>
      idsToExclude.includes(el[0].word_id),
    );

    xxx?.forEach((el) => {
      handleExcludeClick(undefined, el);
    });
  };

  // console.log({ values });
  const handleExcludeClick = (
    e?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    word: Wordx[],
  ) => {
    e?.stopPropagation();
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

  if (isPendingWords) {
    return <span>Loading...</span>;
  }

  if (isErrorWords) {
    return <span>Error: {wordsError?.message}</span>;
  }

  // const handleFilterChange = (e: {
  //   target: { value: React.SetStateAction<string> };
  // }) => {
  //   setFilterValue(e.target.value);
  //   setPage(1);
  // };

  // const filteredWordsData = wordsData;

  // const filteredWordsData = wordsData.filter((word) =>
  //   word.some(
  //     (el) =>
  //       ((el.frequency >= sliderValue[0] && el.frequency <= sliderValue[1]) ||
  //         !el.frequency) &&
  //       (el.word_id
  //         .toLowerCase()
  //         .replace('í', 'i')
  //         .replace('ó', 'o')
  //         .replace('á', 'a')
  //         .replace('ú', 'u')
  //         .replace('é', 'e')
  //         .replace('ñ', 'n')
  //         .includes(
  //           filterValue
  //             .toLowerCase()
  //             .replace('í', 'i')
  //             .replace('ó', 'o')
  //             .replace('á', 'a')
  //             .replace('ú', 'u')
  //             .replace('é', 'e')
  //             .replace('ñ', 'n'),
  //         ) ||
  //         el.info.some((el) =>
  //           el.glosses.toLowerCase().includes(filterValue.toLowerCase()),
  //         )),
  //   ),
  // );

  return (
    <Container size='lg'>
      <Button onClick={excludeAll}>Exclude all seelcted</Button>
      <Group align='start'>
        {/* <TextInput
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
        /> */}
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
          {/* <Pagination
            value={activePage}
            onChange={setPage}
            siblings={1}
            total={Math.ceil(
              (filteredWordsData.filter((word) => !word[0].marked_to_exclude)
                .length || 0) / NUMBER_OF_ITEMS_PER_PAGE,
            )}
            mx='auto'
            my='lg'
          /> */}
          {values.map((value, index) => {
            // console.log(value);
            return (
              <Paper key={index} shadow='xs' mb='sm'>
                <Group p='xs' align='center'>
                  <Checkbox
                    mt='xs'
                    ml={33}
                    label={value.id}
                    key={value.id}
                    checked={value.checked}
                    onChange={(event) =>
                      handlers.setItemProp(
                        index,
                        'checked',
                        event.currentTarget.checked,
                      )
                    }
                  />
                  <Text>{value.translation}</Text>
                </Group>
              </Paper>
            );
          })}
          {/* <ul style={{ listStyle: 'none', padding: '0' }}>
            {filteredWordsData
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
              .slice(
                NUMBER_OF_ITEMS_PER_PAGE * (activePage - 1),
                NUMBER_OF_ITEMS_PER_PAGE * activePage,
              )
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
          </ul> */}
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
          {/* <ul style={{ listStyle: 'none', padding: '0' }}>
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
              ))} */}
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
          {/* </ul> */}
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
