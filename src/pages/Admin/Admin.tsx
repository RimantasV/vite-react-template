import { Link } from 'react-router-dom';

import { List, ListItem, Title } from '@mantine/core';

import { Layout } from '../../components';

export default function Admin() {
  return (
    <Layout>
      <Title mb='md' order={1}>
        Admin
      </Title>
      <List>
        <ListItem>
          <Link to={'find-lyrics'}>Find Lyrics</Link>
        </ListItem>
        <ListItem>
          <Link to={'review-clips'}>Review Clips</Link>
        </ListItem>
        <ListItem>
          <Link to={'review-songs'}>Review Songs</Link>
        </ListItem>
      </List>
    </Layout>
  );
}
