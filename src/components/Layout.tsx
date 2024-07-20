import { Container } from '@mantine/core';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props): React.ReactNode {
  return (
    <Container
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      size='lg'
      bg='white'
      p='xl'
    >
      {children}
    </Container>
  );
}
