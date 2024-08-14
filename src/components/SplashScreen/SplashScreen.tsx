import { useEffect } from 'react';

import Session from 'supertokens-auth-react/recipe/session';

import { useUserSettingsQuery } from '../../queries';

type Props = {
  setSplashScreenState: React.Dispatch<React.SetStateAction<boolean>>;
};

const SplashScreen = ({ setSplashScreenState }: Props) => {
  const sessionContext = Session.useSessionContext();
  const {
    data,
    // isLoading,
    // isError,
    error,
    refetch,
  } = useUserSettingsQuery();

  useEffect(() => {
    if (data || error) {
      setSplashScreenState(false);
    }
  }, [data, error, setSplashScreenState]);

  if (sessionContext.loading) {
    return null;
  }

  // if (isError) {
  //   return <div>Error loading user settings: {error.message}</div>;
  // }

  if (sessionContext.doesSessionExist) {
    refetch();
  } else {
    // setTimeout(() => {
    setSplashScreenState(false);
    // }, 2000);
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <h1>Loading...</h1>
    </div>
  );
};

export default SplashScreen;
