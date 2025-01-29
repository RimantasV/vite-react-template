import { Link } from 'react-router-dom';

import { Layout } from '../../components';
import { TextUpload } from '../../components/TextUpload';

export default function Home() {
  return (
    <Layout>
      <div>Homepage</div>
      <Link to={'admin'}>Admin</Link>
      <Link to={'test'}>Test</Link>
      <TextUpload />
    </Layout>
  );
}
