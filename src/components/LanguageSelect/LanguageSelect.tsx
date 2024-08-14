import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import cx from 'clsx';

import { Avatar, Group, Menu, Paper, UnstyledButton, rem } from '@mantine/core';
import { IconChevronDown, IconPlus } from '@tabler/icons-react';

import { languages } from '../../const';
import { useLanguageStore } from '../../store';
import { Language } from '../../types';

import styles from './languageSelect.module.scss';

const LanguageSelect = () => {
  const { selectedLanguage, setSelectedLanguage } = useLanguageStore();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const navigate = useNavigate();
  const handleMenuItemClicked = (language: Language) => {
    setSelectedLanguage(language);
    navigate('/');
  };

  return (
    <Paper visibleFrom='xs'>
      <Menu
        // width={260}
        position='bottom-end'
        transitionProps={{ transition: 'pop-top-right' }}
        onClose={() => setUserMenuOpened(false)}
        onOpen={() => setUserMenuOpened(true)}
        withinPortal
      >
        <Menu.Target>
          <UnstyledButton
            className={cx(styles.user, {
              [styles.userActive]: userMenuOpened,
            })}
          >
            <Group gap={7}>
              <Avatar
                src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${selectedLanguage?.country_id}.svg`}
                alt={'user.name'}
                radius='xl'
                size={20}
              />
              <IconChevronDown
                style={{ width: rem(12), height: rem(12) }}
                stroke={1.5}
              />
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Select Language</Menu.Label>
          {languages.map((language) => (
            <Menu.Item
              key={language.language_id}
              onClick={() => handleMenuItemClicked(language)}
              leftSection={<Avatar size={rem(16)} src={language.icon} />}
            >
              {language.title}
            </Menu.Item>
          ))}
          <Menu.Divider />
          <Menu.Item
            leftSection={
              <IconPlus
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
          >
            Add Language
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Paper>
  );
};

export default LanguageSelect;
