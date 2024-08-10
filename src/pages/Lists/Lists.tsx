import { Container, Title } from '@mantine/core';

import { ListCard } from '../../components/ListCard';
import { useResourcesQuery, useUserCreatedListsQuery } from '../../queries';
import { useLanguageStore } from '../../store';

import styles from './lists.module.scss';

export default function Lists() {
  const { selectedLanguage } = useLanguageStore();

  const {
    isPending: isPendingUsserCreatedLists,
    isError: isErrorUserCreatedLists,
    data: userCreatedListData,
    error: userCreatedListError,
  } = useUserCreatedListsQuery(selectedLanguage);

  const {
    isPending: isPendingResources,
    isError: isErrorResources,
    data: resourcesData,
    error: respurcesError,
  } = useResourcesQuery(selectedLanguage);

  if (isPendingUsserCreatedLists || isPendingResources) {
    return <span>Loading...</span>;
  }

  if (isErrorUserCreatedLists || isErrorResources) {
    return (
      <span>
        Error: {userCreatedListError?.message || respurcesError?.message}
      </span>
    );
  }

  return (
    <Container size='lg'>
      <Title p='lg' order={1}>
        Continue Learning
      </Title>
      <Title p='md' order={3}>
        From My Lists
      </Title>

      <ul className={styles.ul}>
        {userCreatedListData?.map((el, i) => (
          <li key={i}>
            <ListCard
              name={el.title}
              to={el.custom_item_id.toString()}
              id={el.custom_item_id.toString()}
            />
          </li>
        ))}
      </ul>
      <Title p='lg' order={3}>
        From Lists I Am Following
      </Title>
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
    </Container>
  );
}
