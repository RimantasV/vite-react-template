import { useCallback, useEffect, useState } from 'react';
import { Resource } from '../../types';
import { Layout } from '../../components';
import { Link, useParams } from 'react-router-dom';
import { useLanguageStore } from '../../store';

export default function Episodes() {
  const { selectedLanguage } = useLanguageStore();
  const { id } = useParams();
  const [resources, setResources] = useState<Resource[]>([]);

  const fetchResources = useCallback(async () => {
    const ENDPOINT =
      import.meta.env.VITE_ENVIRONMENT === 'TEST'
        ? '/resources.json'
        : `${
            import.meta.env.VITE_BASE_URL
          }/api/resources?lang=${selectedLanguage}`;

    const response = await fetch(ENDPOINT);
    const data: Resource[] = await response.json();

    setResources(
      data
        .filter((el) => el.key === id)
        .sort((a, b) => (a.chapter_or_episode > b.chapter_or_episode ? 1 : -1))
    );
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return (
    <Layout>
      {resources.map((el) => (
        <Link to={`./${el.chapter_or_episode}`}>
          {el.resource} - {el.key} - {el.chapter_or_episode}
        </Link>
      ))}
    </Layout>
  );
}
