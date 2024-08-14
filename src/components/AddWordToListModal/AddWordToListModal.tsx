import {
  Button,
  List,
  Loader,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
  rem,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconList, IconPlaylistAdd } from '@tabler/icons-react';

import { useUserCreatedListsQuery } from '../../queries';
import { useLanguageStore } from '../../store';
import { UserCreatedList } from '../../types';

import styles from './addWordToListModal.module.scss';

type Props = {
  close: () => void;
  activeWord: string;
};

export default function AddWordToListModal({ activeWord, close }: Props) {
  const { selectedLanguage } = useLanguageStore();

  const {
    isPending: isPendingUsserCreatedLists,
    isError: isErrorUserCreatedLists,
    data: userCreatedListData,
    // error: userCreatedListError,
  } = useUserCreatedListsQuery(selectedLanguage?.language_id);

  const fetchAddWordToList = async (list: UserCreatedList) => {
    const ENDPOINT = `${
      import.meta.env.VITE_BASE_URL
    }/api/user-created-list/word?lang=${selectedLanguage?.language_id}`;

    const payload = { listId: list.custom_item_id, word: activeWord };

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application.json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      notifications.show({
        color: 'green',
        title: list.title,
        message: `"${activeWord.split('-')[0]}" has been added`,
      });
    } catch (e) {
      alert(e);
    }
  };

  const handleAddWordToList = (list: UserCreatedList) => {
    fetchAddWordToList(list);
    close();
  };

  const fetchCreateNewList = async () => {
    const ENDPOINT = `${
      import.meta.env.VITE_BASE_URL
    }/api/user-created-lists/list-word?lang=${selectedLanguage?.language_id}`;

    const payload = { word: activeWord };

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application.json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data: { list: string; word: string; message?: string } =
        await response.json();
      if (!response.ok) throw new Error(data.message);

      notifications.show({
        color: 'green',
        title: data.list,
        message: `"${data.word.split('-')[0]}" has been added`,
      });
    } catch (e) {
      alert(e);
    }
  };

  const handleCreateNewList = () => {
    fetchCreateNewList();
    close();
  };

  return (
    <div>
      {isPendingUsserCreatedLists ? (
        <Loader />
      ) : isErrorUserCreatedLists ? (
        <Text>Error occured. Try realoding the page</Text>
      ) : (
        <Paper radius='md' withBorder className={styles.card} mt={20}>
          <ThemeIcon className={styles.icon} size={60} radius={60}>
            <IconPlaylistAdd
              style={{ width: rem(32), height: rem(32) }}
              stroke={1.5}
            />
          </ThemeIcon>
          <div>
            <Stack align='center' gap='xs' mb='md'>
              <Title>Add to list</Title>
              <Text>
                Add{' '}
                <span className={styles.wordToAdd}>
                  "{activeWord.split('-')[0]}"
                </span>{' '}
                to:
              </Text>
            </Stack>
            <List
              spacing='xs'
              size='sm'
              center
              icon={
                <ThemeIcon color='indigo' size={24} radius='xl'>
                  <IconList style={{ width: rem(16), height: rem(16) }} />
                </ThemeIcon>
              }
            >
              <Button
                w={'100%'}
                mb='md'
                variant='outline'
                onClick={handleCreateNewList}
              >
                Create new list
              </Button>
              {userCreatedListData.map((list) => (
                <List.Item
                  onClick={() => handleAddWordToList(list)}
                  key={list.custom_item_id}
                  className={styles.listItem}
                >
                  {list.title}
                </List.Item>
              ))}
            </List>
          </div>
        </Paper>
      )}
    </div>
  );
}
