import { ListCard } from '../../components/ListCard';
import { useUserCreatedListsQuery } from '../../queries';
import { useLanguageStore } from '../../store';

import styles from './myLists.module.scss';

export default function MyLists() {
  const { selectedLanguage } = useLanguageStore();

  const {
    isPending: isPendingUsserCreatedLists,
    isError: isErrorUserCreatedLists,
    data: userCreatedListData,
    error: userCreatedListError,
  } = useUserCreatedListsQuery(selectedLanguage);

  if (isPendingUsserCreatedLists) {
    return <span>Loading...</span>;
  }

  if (isErrorUserCreatedLists) {
    return <span>Error: {userCreatedListError?.message}</span>;
  }

  return (
    <ul className={styles.ul}>
      {userCreatedListData?.map((el, i) => (
        <li key={i}>
          <ListCard
            name={el.title}
            to={`../lists/${el.custom_item_id.toString()}`}
            id={el.custom_item_id.toString()}
          />
        </li>
      ))}
    </ul>
  );
}
