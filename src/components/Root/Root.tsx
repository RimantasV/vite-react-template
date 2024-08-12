import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

import cx from 'clsx';
import { signOut } from 'supertokens-auth-react/recipe/session';

import {
  ActionIcon,
  AppShell,
  Burger,
  Container,
  Group,
  Menu,
  Text,
  UnstyledButton,
  rem,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MantineLogo } from '@mantinex/mantine-logo';
import {
  IconChevronDown,
  IconLogout,
  IconMoon,
  IconSettings,
  IconSun,
} from '@tabler/icons-react';

import { LanguageSelect } from '../LanguageSelect';

import classes from './root.module.scss';

export default function Root() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  });
  const navigate = useNavigate();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  async function logoutClicked() {
    await signOut();
    navigate('/auth');
  }
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      styles={{
        header: { paddingTop: 7 },
      }}
      navbar={{
        width: 300,
        breakpoint: 'md',
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding='md'
    >
      <AppShell.Header className={classes.header}>
        <Container size='lg'>
          <Group h='100%' px='md'>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom='md'
              size='sm'
            />
            <Group justify='space-between' style={{ flex: 1 }}>
              <Link to={'./'}>
                <MantineLogo size={30} />
              </Link>
              <Group ml='xl' gap={0} visibleFrom='md'>
                <UnstyledButton
                  className={classes.control}
                  component={Link}
                  to={'./learn'}
                >
                  Learn
                </UnstyledButton>
                <UnstyledButton
                  className={classes.control}
                  component={Link}
                  to={'./movies-and-tv'}
                >
                  Browse Movies & TV
                </UnstyledButton>
                <UnstyledButton
                  className={classes.control}
                  component={Link}
                  to={'./dictionary'}
                >
                  Translate
                </UnstyledButton>
              </Group>
              <Group>
                <LanguageSelect />
                <Menu
                  width={260}
                  position='bottom-end'
                  transitionProps={{ transition: 'pop-top-right' }}
                  onClose={() => setUserMenuOpened(false)}
                  onOpen={() => setUserMenuOpened(true)}
                  withinPortal
                >
                  <Menu.Target>
                    <UnstyledButton
                      className={cx(classes.user, {
                        [classes.userActive]: userMenuOpened,
                      })}
                    >
                      <Group gap={7}>
                        <Text fw={500} size='sm' lh={1} mr={3}>
                          RV
                        </Text>
                        <IconChevronDown
                          style={{ width: rem(12), height: rem(12) }}
                          stroke={1.5}
                        />
                      </Group>
                    </UnstyledButton>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Settings</Menu.Label>
                    <Menu.Item
                      leftSection={
                        computedColorScheme === 'dark' ? (
                          <IconSun
                            style={{ width: rem(16), height: rem(16) }}
                            stroke={1.5}
                          />
                        ) : (
                          <IconMoon
                            style={{ width: rem(16), height: rem(16) }}
                            stroke={1.5}
                          />
                        )
                      }
                      onClick={() =>
                        setColorScheme(
                          computedColorScheme === 'light' ? 'dark' : 'light',
                        )
                      }
                    >
                      {computedColorScheme === 'dark'
                        ? 'Switch to light mode'
                        : 'Switch to dark mode'}
                    </Menu.Item>
                    <Link to={'./settings'}>
                      <Menu.Item
                        leftSection={
                          <IconSettings
                            style={{ width: rem(16), height: rem(16) }}
                            stroke={1.5}
                          />
                        }
                      >
                        Account settings
                      </Menu.Item>
                    </Link>
                    <Menu.Item
                      leftSection={
                        <IconLogout
                          style={{ width: rem(16), height: rem(16) }}
                          stroke={1.5}
                        />
                      }
                      onClick={logoutClicked}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
                <ActionIcon
                  visibleFrom='xs'
                  onClick={() =>
                    setColorScheme(
                      computedColorScheme === 'light' ? 'dark' : 'light',
                    )
                  }
                  variant='default'
                  size='xl'
                  aria-label='Toggle color scheme'
                >
                  <IconSun
                    className={cx(classes.icon, classes.light)}
                    stroke={1.5}
                  />
                  <IconMoon
                    className={cx(classes.icon, classes.dark)}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Group>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar py='md' px={4}>
        <UnstyledButton
          onClick={toggle}
          component={Link}
          to={'./'}
          className={classes.control}
        >
          Home
        </UnstyledButton>
        <UnstyledButton
          onClick={toggle}
          component={Link}
          to={'./learn'}
          className={classes.control}
        >
          Learn
        </UnstyledButton>
        <UnstyledButton
          onClick={toggle}
          component={Link}
          to={'./movies-and-tv'}
          className={classes.control}
        >
          Browse Movies & TV
        </UnstyledButton>
        <UnstyledButton
          onClick={toggle}
          component={Link}
          to={'./dictionary'}
          className={classes.control}
        >
          Translate
        </UnstyledButton>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
