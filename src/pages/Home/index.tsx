import axios from 'axios';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import { getApiDomain } from '../../config';
import './Home.css';
import SuccessView from './SuccessView';

import { useEffect, useState } from 'react';

export default function Home() {
  const sessionContext = useSessionContext();
  const [email, setEmail] = useState('');

  async function callAPIClicked() {
    const response = await axios.get(getApiDomain() + '/get-user-info');
    setEmail(response.data.email);
  }

  useEffect(() => {
    //@ts-expect-error xxx
    if (sessionContext?.userId) {
      callAPIClicked();
    }
    //@ts-expect-error xxx
  }, [sessionContext?.userId]);

  if (sessionContext.loading === true) {
    return null;
  }

  return (
    <div className='fill' id='home-container'>
      <SuccessView email={email} userId={sessionContext.userId} />
    </div>
  );
}
