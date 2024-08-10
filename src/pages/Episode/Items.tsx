import { Key, useEffect, useState } from 'react';

import { ActionIcon, Flex, Pagination, Text } from '@mantine/core';
import {
  IconEyeOff,
  IconPlaylistAdd, //  IconTrash
} from '@tabler/icons-react';

import { useMovieVocabularyQuery } from '../../queries';
import { useLanguageStore } from '../../store';
import {
  // DataMovies,
  Wordsx,
  Wordx,
} from '../../types';
// import InfiniteScroll from 'react-infinite-scroller';
import { getDisplayDate, getNextReviewDate } from '../../utils/index';

import styles from './movie.module.scss';

type Props = {
  // resource: string;
  // id: string;
  // episode: string;
  mediaItemId: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveWord: React.Dispatch<React.SetStateAction<Wordx | undefined>>;
  handleExcludeClick: (word: Wordx[]) => void;
  isPendingUpdateWordStatus: boolean;
};

const Items: React.FC<Props> = ({
  // resource,
  // id,
  // episode,
  mediaItemId,
  setActiveWord,
  setShow,
  handleExcludeClick,
  isPendingUpdateWordStatus,
}) => {
  const { selectedLanguage } = useLanguageStore();

  const {
    isPending: isPendingMovieVocabulary,
    isError: isErrorMovieVocabulary,
    data: movieVocabularyData,
    error: movieVocabularyError,
  } = useMovieVocabularyQuery(selectedLanguage, mediaItemId);
  // } = useMovieVocabularyQuery(resource, id, episode);
  const [activePage, setPage] = useState(1);
  // const [data, setData] = useState<DataMovies>();
  const [data, setData] = useState<Wordsx>();

  movieVocabularyData
    // ?.filter(el => el.)
    ?.filter((word) => !word[0].marked_to_exclude)
    // ?.slice(0, 1000)
    // .map((el) => [...el])
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
    });

  //   const itemsPerPage = data?.length;
  // const [hasMore, setHasMore] = useState(true);
  // const [records, setrecords] = useState(100);

  useEffect(() => {
    setData(movieVocabularyData);
  }, [movieVocabularyData]);

  // const loadMore = () => {
  //   if (records >= (data?.length || 0)) {
  //     setHasMore(false);
  //   } else {
  //     setTimeout(() => {
  //       setrecords(data?.length || 0);
  //     }, 500);
  //   }
  // };
  // const showItems = (item: any) => {
  //   var items = [];
  //   for (var i = 0; i < records; i++) {
  //     const word = item[i][0].word;
  //     items.push(
  //       <div
  //         key={word + i.toString()}
  //         className={styles.item}
  //         onClick={() => {
  //           setShow(true);
  //           setActiveWord(word);
  //         }}
  //       >
  //         <div>
  //           <Text>{item?.[i]?.[0]?.word?.split('-')[0]}</Text>
  //           {item?.[i]?.map(
  //             (
  //               item: {
  //                 word: string;
  //                 info: {
  //                   glosses: string;
  //                 }[];
  //               },
  //               i: Key | null | undefined
  //             ) => (
  //               <Text key={i} c='blue' size='lg'>
  //                 {item.word.split('-')[1]} - {item.info[0].glosses}
  //               </Text>
  //             )
  //           )}
  //         </div>
  //         <Flex gap='lg'>
  //           {getDisplayDate(
  //             getNextReviewDate(
  //               item?.[i]?.[0].learning_level,
  //               item?.[i]?.[0].last_answer_ts
  //             )
  //           )}
  //           <IconPlaylistAdd
  //             size={24}
  //             color='blue'
  //             stroke={2}
  //             strokeLinejoin='miter'
  //           />
  //           <IconEyeOff
  //             size={24}
  //             color='gray'
  //             stroke={2}
  //             strokeLinejoin='miter'
  //           />
  //           <IconTrash
  //             onClick={() => handleExcludeClick(item)}
  //             size={24}
  //             color='red'
  //             stroke={2}
  //             strokeLinejoin='round'
  //           />
  //         </Flex>
  //       </div>
  //       // <div>{item?.[i]?.[0]?.word}</div>
  //     );
  //   }
  //   return items;
  // };

  if (isPendingMovieVocabulary) return <p>Loading...</p>;

  if (isErrorMovieVocabulary) {
    return <span>Error: {movieVocabularyError?.message}</span>;
  }

  return (
    <>
      <Pagination
        value={activePage}
        onChange={setPage}
        siblings={1}
        total={Math.ceil((data?.length || 0) / 100)}
        mx='auto'
        my='lg'
      />
      <ul style={{ listStyle: 'none', padding: '0' }}>
        {data
          ? data
              .filter((word) => !word[0].marked_to_exclude)
              .slice(100 * (activePage - 1), 100 * activePage)
              .map((item, id) => (
                <div
                  key={id}
                  className={styles.item}
                  onClick={() => {
                    setShow(true);
                    setActiveWord(item[0]);
                  }}
                >
                  <div>
                    <Text>{item[0].word_id.split('-')[0]}</Text>
                    {item.map(
                      (
                        item: {
                          word_id: string;
                          info: {
                            glosses: string;
                          }[];
                        },
                        i: Key | null | undefined,
                      ) => (
                        <Text key={i} c='blue' size='lg'>
                          {item.word_id.split('-')[1]} - {item.info[0].glosses}
                        </Text>
                      ),
                    )}
                  </div>
                  <Flex gap='lg'>
                    {getDisplayDate(
                      getNextReviewDate(
                        item[0].learning_level,
                        item[0].last_answer_ts,
                      ),
                    )}
                    <ActionIcon
                      size='lg'
                      variant='subtle'
                      aria-label='Add to custom list'
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      radius='lg'
                    >
                      <IconPlaylistAdd stroke={2} />
                    </ActionIcon>
                    <ActionIcon
                      loading={isPendingUpdateWordStatus}
                      size='lg'
                      c='gray'
                      variant='subtle'
                      aria-label='Exclude word'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExcludeClick(item);
                      }}
                      radius='lg'
                    >
                      <IconEyeOff stroke={2} />
                    </ActionIcon>
                  </Flex>
                </div>
              ))
          : null}
      </ul>
    </>
  );
  // <InfiniteScroll
  //   pageStart={0}
  //   loadMore={loadMore}
  //   hasMore={hasMore}
  //   loader={<h4 className='loader'>Loading...</h4>}
  //   useWindow={false}
  // >
  //   {showItems(data)}
  // </InfiniteScroll>
};

export default Items;
