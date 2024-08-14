import { useNavigate } from 'react-router-dom';

import {
  Avatar,
  Center,
  Group,
  Indicator,
  List,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import { languages } from '../../const';
import { useLanguageStore } from '../../store';
import { Language } from '../../types';

import styles from './languageSelect.module.scss';

export default function LanguageSelect() {
  const { setSelectedLanguage } = useLanguageStore();
  const navigate = useNavigate();

  const handleItemClicked = (language: Language) => {
    setSelectedLanguage(language);
    navigate('/');
  };

  return (
    <Center mih='100vh'>
      <Stack p='lg'>
        <Title order={3}>Select a language:</Title>
        <List listStyleType='none'>
          {languages.map((language) => (
            <List.Item key={language.language_id} pb='lg'>
              <Indicator
                disabled={language.language_id === 'es'}
                label='BETA'
                size={16}
              >
                <Paper
                  // component={Link}
                  // to={'/'}
                  onClick={() => handleItemClicked(language)}
                  className={styles.card}
                  shadow='md'
                >
                  <Group gap='md' p='lg' w='200px'>
                    <Avatar size={35} src={language.icon} radius={30} />
                    <Text c={'var(--mantine-color-text)'} fz='xl' fw={500}>
                      {language.title}
                    </Text>
                  </Group>
                </Paper>
              </Indicator>
            </List.Item>
          ))}
        </List>
      </Stack>
    </Center>
  );
}
