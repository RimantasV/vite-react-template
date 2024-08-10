import { Container } from '@mantine/core';

import styles from './layout.module.scss';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props): React.ReactNode {
  return (
    <Container
      className={styles.container}
      // bg='white'
      size='lg'
    >
      {children}
    </Container>
  );
}
