import { Button, Popover } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCircleChevronRight } from '@tabler/icons-react';

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
}

const HTMLWithPopovers = ({
  sub,
  handleLyricsClick,
}: HTMLWithPopoversProps) => {
  const [opened, { open, close }] = useDisclosure(false);

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
            opened={opened}
          >
            <Popover.Target>
              <span
                onClick={opened ? close : open}
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

  return <div className='p-4'>{createElements(sub)}</div>;
};

export default HTMLWithPopovers;
