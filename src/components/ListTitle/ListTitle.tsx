import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { Flex, Title, Tooltip } from '@mantine/core';
import { IconCheck, IconEdit, IconX } from '@tabler/icons-react';

import { useLanguageStore } from '../../store';

import styles from './listTitle.module.scss';

export default function ListTitle() {
  const { selectedLanguage } = useLanguageStore();
  const { id } = useParams();
  const { state } = useLocation();

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(state.listName);

  const handleRenameTitle = async () => {
    const ENDPOINT = `${import.meta.env.VITE_BASE_URL}/api/user-created-list?lang=${selectedLanguage?.language_id}`;
    const payload = { listId: id, newName };

    try {
      const response = await fetch(ENDPOINT, {
        method: 'PUT',
        headers: {
          Accept: 'application.json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      } else {
        state.listName = newName;
        setIsEditing(false);
      }
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div className={styles.titleContainer}>
      {!isEditing ? (
        <>
          <Flex align='baseline' my='lg'>
            <Title>{state.listName}</Title>
            <Tooltip label='Edit list name'>
              <IconEdit
                color='gray'
                size={20}
                onClick={() => setIsEditing(true)}
              />
            </Tooltip>
          </Flex>
        </>
      ) : (
        <div className={styles.editingContainer}>
          <input
            type='text'
            value={newName}
            onChange={(e: { target: { value: unknown } }) =>
              setNewName(e.target.value)
            }
          />
          <IconCheck onClick={handleRenameTitle} />
          <IconX
            onClick={() => {
              setIsEditing(false);
              setNewName(state.listName);
            }}
          />
        </div>
      )}
    </div>
  );
}
