import React from 'react';

import { Popover, Text } from '@mantine/core';

const WordWithPopover = ({ word, onPopoverChange }) => {
  console.log('render');
  return (
    <Popover
      position='top'
      withArrow
      onOpen={() => onPopoverChange(true)}
      onClose={() => onPopoverChange(false)}
    >
      <Popover.Target>
        <Text span style={{ margin: '0 4px', cursor: 'pointer' }}>
          {word}
        </Text>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size='sm'>Popover content for {word}</Text>
      </Popover.Dropdown>
    </Popover>
  );
};

const MemoizedWordWithPopover = React.memo(WordWithPopover);
export default MemoizedWordWithPopover;
