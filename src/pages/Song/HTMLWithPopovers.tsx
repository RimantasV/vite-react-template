import React from 'react';

import { Button, Popover } from '@mantine/core';
// import { useDisclosure } from '@mantine/hooks';
import { IconCircleChevronRight } from '@tabler/icons-react';

import styles from './song.module.scss';

interface HTMLWithPopoversProps {
  handleLyricsClick: (
    target: Element,
    // e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    sub: {
      startMs: number;
      durMs: number;
      text: string;
      text_html: string;
    },
  ) => void;
  sub: { startMs: number; durMs: number; text: string; text_html: string };
  onPopoverChange: (isOpen: boolean) => void;
  subtitleRefs: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  activeSubtitle: any;
  rowIndex: number;
}

const HTMLWithPopovers = ({
  sub,
  handleLyricsClick,
  onPopoverChange,
  subtitleRefs,
  activeSubtitle,
  rowIndex,
}: HTMLWithPopoversProps) => {
  // const [opened, { open, close }] = useDisclosure(false);

  // Function to parse HTML string and create React elements
  const createElements = (sub: {
    startMs: number;
    durMs: number;
    text: string;
    text_html: string;
  }) => {
    // Create a temporary DOM element
    const div = document.createElement('div');
    div.innerHTML = sub.text_html!;
    // console.log({ active: activeSubtitle?.startMs });
    // console.log({ sub: sub?.startMs });
    // console.log('render');
    // console.log(ref);
    // Convert the HTML collection to an array
    return Array.from(div.childNodes).map((node, index) => {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        (node as Element).tagName.toLowerCase() === 'span'
      ) {
        const className = (node as Element).className;
        const dataWordId = (node as Element).getAttribute('data-word-id');

        return (
          <Popover
            // width={300}
            trapFocus
            position='top'
            // withArrow
            shadow='md'
            // opened={opened}
            onOpen={() => onPopoverChange(true)}
            onClose={() => onPopoverChange(false)}
            zIndex={301}
          >
            <Popover.Target>
              <span
                // onClick={opened ? close : open}
                dangerouslySetInnerHTML={{
                  __html: (node as Element).outerHTML,
                }}
              />
            </Popover.Target>
            <Popover.Dropdown p='xs' pb={0} pt={0}>
              {/* <Stack> */}
              {node.textContent}
              <Button
                onClick={() => handleLyricsClick(node as Element, sub)}
                variant='transparent'
                rightSection={<IconCircleChevronRight size={16} />}
              >
                See more
              </Button>
              {/* </Stack> */}
            </Popover.Dropdown>
          </Popover>
          //   <Popover key={index}>
          //     <PopoverTrigger asChild>
          //       <span
          //         className={`${className} cursor-pointer hover:bg-gray-100`}
          //         data-word-id={dataWordId}
          //       >
          //         {node.textContent}
          //       </span>
          //     </PopoverTrigger>
          //     <PopoverContent className='w-64'>
          //       <div className='space-y-2'>
          //         <h4 className='font-medium'>Word Info</h4>
          //         <p className='text-sm text-gray-500'>Word ID: {dataWordId}</p>
          //         {/* Add more content to the popover as needed */}
          //       </div>
          //     </PopoverContent>
          //   </Popover>
        );
      }
      // For text nodes (spaces between spans)
      return node.textContent;
    });
  };

  return (
    <div
      className={`p-4 ${styles.subtitle} ${activeSubtitle?.startMs == sub?.startMs ? styles.active : ''}`}
      ref={(el) => {
        console.log(el?.textContent);
        return (subtitleRefs.current[rowIndex] = el);
      }} // Attach ref to each subtitle
    >
      {createElements(sub)}
    </div>
  );
};
const MemoizedHTMLWithPopovers = React.memo(HTMLWithPopovers);
export default MemoizedHTMLWithPopovers;
