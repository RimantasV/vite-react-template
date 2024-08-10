import React from 'react';
import { Link } from 'react-router-dom';

import { Accordion, Button, Card, Group, Text } from '@mantine/core';
import { IconBook, IconCheck, IconMovie } from '@tabler/icons-react';

import { SegmentTitleArray } from '../../pages/MoviesAndTV/MoviesAndTV';

import classes from './ListCard.module.css';

type Props = {
  isFollowing: boolean;
  linkToList: string;
  linkToSubtitles: string;
  // mediaItemId: string;
  segmentTitleArray: SegmentTitleArray[];
  name: string;
};

export function ListCardSeries({
  isFollowing,
  linkToList,
  linkToSubtitles,
  segmentTitleArray,
  name,
}: Props) {
  return (
    <Card
      withBorder
      radius='md'
      p='md'
      className={classes.card}
      flex={1}
      miw={300}
      maw={400}
    >
      <Group>
        <Text fz='h3' fw={500} lineClamp={1}>
          {name}
        </Text>
        {isFollowing && <IconCheck />}
      </Group>
      <>
        <Accordion radius='md'>
          <Accordion.Item key={name} value={name}>
            <Accordion.Control
            // icon={item.emoji}
            >
              Expand to select episode
            </Accordion.Control>
            <Accordion.Panel>
              {segmentTitleArray.map((el) => (
                <React.Fragment key={el.media_item_id}>
                  <p>{el.segment_title}</p>
                  <Group mt='xs'>
                    <Button
                      size='xs'
                      to={linkToSubtitles}
                      component={Link}
                      radius='md'
                      style={{ flex: 1 }}
                    >
                      <Group>
                        {/* <IconMovie /> */}
                        Subtitles
                      </Group>
                    </Button>
                    <Button
                      size='xs'
                      component={Link}
                      // state={{ listName: name, mediaItemId }}
                      to={linkToList}
                      variant='outline'
                      radius='md'
                      style={{ flex: 1 }}
                    >
                      <Group>
                        {/* <IconBook /> */}
                        Vocabulary
                      </Group>
                    </Button>
                  </Group>
                </React.Fragment>
              ))}
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </>
    </Card>
  );
}
