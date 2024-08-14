import { Link } from 'react-router-dom';

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

import styles from './languageSelect.module.scss';

export default function LanguageSelect() {
  const languages = [
    {
      id: 'es',
      title: 'Spanish',
      icon: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/ES.svg',
    },
    {
      id: 'fr',
      title: 'French',
      icon: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/FR.svg',
    },
    {
      id: 'de',
      title: 'German',
      icon: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/DE.svg',
    },
    {
      id: 'sv',
      title: 'Swedish',
      icon: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/SE.svg',
    },
  ];

  return (
    <Center mih='100vh'>
      <Stack p='lg'>
        <Title order={3}>Select a language:</Title>
        <List listStyleType='none'>
          {languages.map((el) => (
            <List.Item key={el.id} pb='lg'>
              <Indicator disabled={el.id === 'es'} label='BETA' size={16}>
                <Paper
                  component={Link}
                  to={'/'}
                  className={styles.card}
                  shadow='md'
                >
                  <Group gap='md' p='lg' w='200px'>
                    <Avatar size={35} src={el.icon} radius={30} />
                    <Text c={'var(--mantine-color-text)'} fz='xl' fw={500}>
                      {el.title}
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
