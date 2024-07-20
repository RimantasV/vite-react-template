import { useCallback, useEffect, useState } from 'react';
import { ListCardMovie } from '../../components/ListCard';
import { Layout } from '../../components';
import { Flex } from '@mantine/core';

type Resource = {
  resource: string;
  key: string;
  chapter_or_episode: string;
  is_following: boolean;
};

export default function MoviesAndTV() {
  const [resources, setResources] = useState<Resource[]>([]);

  const fetchResources = useCallback(async () => {
    const ENDPOINT =
      import.meta.env.VITE_ENVIRONMENT === 'TEST'
        ? '/resources.json'
        : `${import.meta.env.VITE_BASE_URL}/api/resources`;

    const response = await fetch(ENDPOINT);
    const data = await response.json();

    setResources(data);
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return (
    <Layout>
      <Flex
        flex={1}
        direction='row'
        align={'flex-start'}
        justify='flex-start'
        wrap='wrap'
      >
        {resources.map((resource) => (
          <ListCardMovie
            name={`${resource.resource} -  ${resource.key}`}
            key={resource.key}
            linkToList={`../${resource.resource}/${resource.key}`}
            linkToSubtitles={`../subtitles?type=${resource.resource}&key=${resource.key}`}
            isFollowing={resource.is_following}
          />
        ))}
      </Flex>
    </Layout>
  );
}
