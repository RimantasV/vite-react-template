import React from 'react';
import { Link } from 'react-router-dom';

import { Accordion, Button, Card, Group, Pill, Text } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

import {
  Details,
  SegmentTitleArray,
} from '../../pages/MoviesAndTV/MoviesAndTV';

import classes from './ListCard.module.css';

type Props = {
  isFollowing: boolean;
  // linkToList: string;
  // linkToSubtitles: string;
  // mediaItemId: string;
  segmentTitleArray: SegmentTitleArray[];
  name: string;
  details: Details;
};

export function ListCardSeries({
  isFollowing,
  // linkToList,
  // linkToSubtitles,
  segmentTitleArray,
  name,
  details,
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
        <Text fz='h3' fw={500} lineClamp={1} mb='xs'>
          {name}
        </Text>
        {isFollowing && <IconCheck />}
      </Group>
      <Group>
        {details.genres.map((el, i) => (
          <Pill key={i}>{el}</Pill>
        ))}
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
                      to={`../subtitles?media-item-id=${el.media_item_id}`}
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
                      state={{ listName: name, mediaItemId: el.media_item_id }}
                      to={`../${'movies-and-tv'}/${el.media_item_id}`}
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
