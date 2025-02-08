import { Link } from 'react-router-dom';

import { List, ListItem, Title } from '@mantine/core';

import { Layout } from '../../components';

export default function Music() {
  return (
    <Layout>
      <Title mb='md' order={1}>
        Select a song
      </Title>
      <List>
        <ListItem>
          <Link to={'song'}>Juanes - La camisa Negra</Link>
        </ListItem>
      </List>
    </Layout>
  );
}
