import { ListCard } from '../../components/ListCard';
import { useResourcesQuery } from '../../queries';
import { useLanguageStore } from '../../store';

import styles from './myMoviesAndTV.module.scss';

export default function MyMoviesAndTV() {
  const { selectedLanguage } = useLanguageStore();

  const {
    isPending: isPendingResources,
    isError: isErrorResources,
    data: resourcesData,
    error: respurcesError,
  } = useResourcesQuery(selectedLanguage);

  if (isPendingResources) {
    return <span>Loading...</span>;
  }

  if (isErrorResources) {
    return <span>Error: {respurcesError?.message}</span>;
  }

  return (
    <ul className={styles.ul}>
      {resourcesData.map((el, i) => (
        <li key={i}>
          <ListCard
            mediaItemId={el.media_item_id}
            mediaType={el.media_type}
            segmentTitle={el.segment_title}
            name={el.title}
            title={el.title}
          />
        </li>
      ))}
    </ul>
  );
}
