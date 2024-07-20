import { Container, Title } from '@mantine/core';
import { ListCard } from '../../components/ListCard';
import { useResourcesQuery, useUserCreatedListsQuery } from '../../queries';

import styles from './lists.module.scss';

export default function Lists() {
  const {
    isPending: isPendingUsserCreatedLists,
    isError: isErrorUserCreatedLists,
    data: userCreatedListData,
    error: userCreatedListError,
  } = useUserCreatedListsQuery();

  const {
    isPending: isPendingResources,
    isError: isErrorResources,
    data: resourcesData,
    error: respurcesError,
  } = useResourcesQuery();

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
              name={el.list_name}
              to={el.id.toString()}
              id={el.id.toString()}
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
            <ListCard name={el.key} key_={el.key} />
          </li>
        ))}
      </ul>
    </Container>
  );
}
