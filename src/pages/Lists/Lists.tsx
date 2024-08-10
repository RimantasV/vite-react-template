import { Title } from '@mantine/core';

import { Layout, MyLists } from '../../components';

export default function Lists() {
  return (
    <Layout>
      <Title p='lg' order={1}>
        My Lists
      </Title>
      <MyLists />
    </Layout>
  );
}
