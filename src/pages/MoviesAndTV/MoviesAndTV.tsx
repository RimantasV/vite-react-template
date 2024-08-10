import { useCallback, useEffect, useState } from 'react';
import { ListCardMovie } from '../../components/ListCard';
import { Layout } from '../../components';
import { Flex } from '@mantine/core';
import { useLanguageStore } from '../../store';

type MediaItem = {
  media_item_id: string;
  media_type: string;
  title: string;
  segment_title: string;
  // is_following: boolean; //TODO: add is_following property to API response
};

export default function MoviesAndTV() {
  const { selectedLanguage } = useLanguageStore();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const fetchMediaItems = useCallback(async () => {
    const ENDPOINT =
      import.meta.env.VITE_ENVIRONMENT === 'TEST'
        ? '/media-items.json'
        : `${
            import.meta.env.VITE_BASE_URL
          }/api/media-items?lang=${selectedLanguage}`;

    const response = await fetch(ENDPOINT);
    const data = await response.json();

    setMediaItems(data);
  }, [selectedLanguage]);

  useEffect(() => {
    fetchMediaItems();
  }, [fetchMediaItems]);

  return (
    <Layout>
      <Flex
        flex={1}
        direction='row'
        align={'flex-start'}
        justify='flex-start'
        wrap='wrap'
      >
        {mediaItems.map((resource) => (
          <ListCardMovie
            mediaItemId={resource.media_item_id}
            name={`${resource.media_type} -  ${resource.title}`}
            key={resource.title}
            linkToList={`../${resource.media_type}/${resource.title}`}
            linkToSubtitles={`../subtitles?media-item-id=${resource.media_item_id}`}
            // isFollowing={resource.is_following}
            isFollowing={false}
          />
        ))}
      </Flex>
    </Layout>
  );
}
