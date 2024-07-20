import { Link } from 'react-router-dom';
import { Layout } from '../../components';
import { Text, Title } from '@mantine/core';

export default function Settings() {
  return (
    <Layout>
      <Title mb='xl'>Settings</Title>
      <Link to={'vocabulary-level'}>
        <Text fz='h2'>Vocabulary level</Text>
      </Link>
    </Layout>
  );
}
