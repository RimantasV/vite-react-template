import { useEffect, useState } from 'react';

const useKeyPressClass = (keyToWatch: string, activeClassName = 'active') => {
  const [isKeyDown, setIsKeyDown] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: { code: string }) => {
      if (event.code === keyToWatch) {
        setIsKeyDown(true);
      }
    };

    const handleKeyUp = (event: { code: string }) => {
      console.log(event.code);
      if (event.code === keyToWatch) {
        setIsKeyDown(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keyToWatch]);

  const getClassName = (baseClassName = '') => {
    return `${baseClassName} ${isKeyDown ? activeClassName : ''}`.trim();
  };

  return getClassName;
};

export default useKeyPressClass;
