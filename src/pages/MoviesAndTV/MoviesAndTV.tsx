import { useCallback, useEffect, useState } from 'react';

import { Flex, Pagination } from '@mantine/core';

import { Layout } from '../../components';
import { ListCardMovie, ListCardSeries } from '../../components/ListCard';
import { useLanguageStore } from '../../store';

export type Details = {
  imdbLink: string;
  netflixLink: string;
  countryOfOrigin: string[];
  genres: string[];
  originalTitle: string;
  year: string;
  englishTitle: string;
  imageLink: string;
};

type MediaItem = {
  media_item_id: string;
  media_type: string;
  title: string;
  segment_title: string;
  details: Details;
  // is_following: boolean; //TODO: add is_following property to API response
};

export type SegmentTitleArray = {
  segment_title: string;
  media_item_id: string;
};

type TransformedMediaItem = {
  media_item_id: string | null;
  media_type: string;
  title: string;
  segment_title_array: SegmentTitleArray[];
  details: Details;
};

const itemsPerPage = 20;

export default function MoviesAndTV() {
  const { selectedLanguage } = useLanguageStore();
  const [mediaItems, setMediaItems] = useState<TransformedMediaItem[]>([]);
  const [activePage, setPage] = useState(1);

  function transformMediaItems(items: MediaItem[]): TransformedMediaItem[] {
    const groupedItems: { [key: string]: TransformedMediaItem } = {};

    items.forEach((item) => {
      const key = `${item.media_type}-${item.title}`;

      if (!groupedItems[key]) {
        groupedItems[key] = {
          media_item_id: null,
          media_type: item.media_type,
          title: item.title,
          segment_title_array: [],
          details: item.details,
        };
      }
      if (item.segment_title) {
        groupedItems[key].segment_title_array.push({
          media_item_id: item.media_item_id,
          segment_title: item.segment_title,
        });
      } else {
        groupedItems[key].media_item_id = item.media_item_id;
      }
    });

    return Object.values(groupedItems);
  }

  const fetchMediaItems = useCallback(async () => {
    const ENDPOINT =
      import.meta.env.VITE_ENVIRONMENT === 'TEST'
        ? '/media-items.json'
        : `${
            import.meta.env.VITE_BASE_URL
          }/api/media-items?lang=${selectedLanguage?.language_id}`;

    const response = await fetch(ENDPOINT);
    const data = await response.json();

    const transformed = transformMediaItems(data);

    setMediaItems(transformed);
  }, [selectedLanguage]);

  useEffect(() => {
    fetchMediaItems();
  }, [fetchMediaItems]);

  return (
    <Layout>
      <Pagination
        value={activePage}
        onChange={setPage}
        siblings={1}
        total={Math.ceil((mediaItems.length || 0) / itemsPerPage)}
        mx='auto'
        my='lg'
      />
      <Flex
        flex={1}
        direction='row'
        align={'flex-start'}
        justify='flex-start'
        wrap='wrap'
        gap='15px'
      >
        {mediaItems
          .slice(itemsPerPage * (activePage - 1), itemsPerPage * activePage)
          .map((resource) =>
            resource.media_item_id ? (
              <ListCardMovie
                details={resource.details}
                mediaItemId={resource.media_item_id}
                // name={`${resource.media_type} -  ${resource.title}`}
                name={`${resource.details.originalTitle}`}
                key={resource.media_item_id}
                // linkToList={`../${resource.media_type}/${resource.title}`}
                linkToList={`../${'movies-and-tv'}/${resource.media_item_id}`}
                linkToSubtitles={`../subtitles?media-item-id=${resource.media_item_id}`}
                // isFollowing={resource.is_following}
                isFollowing={false}
              />
            ) : (
              <ListCardSeries
                details={resource.details}
                // mediaItemId={resource.media_item_id}
                segmentTitleArray={resource.segment_title_array}
                // name={`${resource.media_type} -  ${resource.title}`}
                name={`${resource.details.originalTitle}`}
                key={resource.media_type + resource.title}
                // linkToList={`../${resource.media_type}/${resource.title}`}
                // linkToSubtitles={`../subtitles?media-item-id=${resource.media_item_id}`}
                // isFollowing={resource.is_following}
                isFollowing={false}
              />
            ),
          )}
      </Flex>
    </Layout>
  );
}
