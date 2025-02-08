import { Link } from 'react-router-dom';

import { List, ListItem, Title } from '@mantine/core';

import { Layout } from '../../components';

export default function Home() {
  return (
    <Layout>
      <Title mb='md'>Homepage</Title>
      <List>
        <ListItem>
          <Link to={'admin'}>Admin</Link>
        </ListItem>
        <ListItem>
          <Link to={'test'}>Test</Link>
        </ListItem>
      </List>
    </Layout>
  );
}
