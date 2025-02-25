import { useCallback, useRef, useState } from 'react';

import WordWithPopover from './WordWithPopover';

const ParentComponent = () => {
  //   const [isAnyPopoverOpen, setIsAnyPopoverOpen] = useState(false);

  //   // Callback function to update the state
  //   const handlePopoverChange = useCallback((isOpen: boolean) => {
  //     setIsAnyPopoverOpen(isOpen);
  //   }, []);

  const popoverOpenRef = useRef(false);

  const handlePopoverChange = (isOpen: boolean) => {
    popoverOpenRef.current = isOpen;
    console.log('Any Popover Open:', popoverOpenRef.current);
  };

  console.log(popoverOpenRef);

  const words = ['Hello', 'world', 'this', 'is', 'a', 'test', 'test'];

  return (
    <div>
      {words.map((word, index) => (
        <WordWithPopover
          key={index}
          word={word}
          onPopoverChange={handlePopoverChange}
        />
      ))}
      {/* <p>Any Popover Open: {popoverOpenRef?.current ? 'Yes' : 'No'}</p> */}
    </div>
  );
};

export default ParentComponent;
