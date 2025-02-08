import { useCallback, useEffect, useState } from 'react';
import ReactPlayer from 'react-player/file';

import { Button, Group } from '@mantine/core';

// import video from '../../../../../../../rvilc/Videos/FlixiCam StreamOne/clips/es/theMinionsOfMidas/S01E01/'
import { useLanguageStore } from '../../store';
import { SentencesResponse } from '../../types';
import { calculateTimeDifference } from '../../utils';

type Props = {
  examples: SentencesResponse;
};

type VideoDetails = {
  title: string;
  segment_title: string;
  sentence_id: string;
};

export default function Video({ examples }: Props) {
  const { selectedLanguage } = useLanguageStore();
  const [playIndex, setPlayIndex] = useState<number>(0);
  const [videoIds, setVideoIds] = useState<VideoDetails[]>([]);
  const [videoDetails, setVideoDetails] = useState<VideoDetails[]>();
  // console.log(videoDetails);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    // console.log(examples);
    setVideoDetails(
      examples
        .filter(
          (el) =>
            el.video_id &&
            el.sentence_timestamps &&
            calculateTimeDifference(el.sentence_timestamps) > 1.5,
        )
        .map((el) => ({
          title: el.title,
          segment_title: el.segment_title,
          sentence_id: el.sentence_id,
          id: el.id,
        }))

        .slice(0, 10),
    );
  }, [examples]);

  const checkIfVideoExists = useCallback(
    async ({ sentence_id, title, segment_title }: VideoDetails) => {
      // console.log(sentence_id, title, segment_title);
      if (sentence_id) {
        // const ENDPOINT = `../../../../../../../rvilc/Videos/FlixiCam StreamOne/clips/es/theMinionsOfMidas/S01E01/${sentence_id}.mp4`;
        const ENDPOINT =
          `https://movie-tongue.b-cdn.net/clips/${selectedLanguage?.language_id}/${title}` +
          (!segment_title ? '' : `/${segment_title}`) +
          `/${sentence_id}.mp4`;
        const response = await fetch(ENDPOINT, {
          method: 'HEAD',
        });
        if (response.ok) {
          setVideoIds((prevState) => {
            if (prevState.some((el) => el.sentence_id === sentence_id)) {
              return prevState;
            } else return [...prevState, { sentence_id, title, segment_title }];
          });
        } else {
          console.log('HTTP error:', response.status, response.statusText);
        }
      }
    },
    [selectedLanguage],
  );

  useEffect(() => {
    if (videoDetails?.length) {
      for (let i = 0; i < (videoDetails?.length || 0); i++) {
        checkIfVideoExists(videoDetails[i]);
      }
    }
  }, [checkIfVideoExists, videoDetails, videoDetails?.length]);

  const previousVideo = () => {
    setPlayIndex((prevState) => prevState - 1);
  };

  const nextVideo = () => {
    setPlayIndex((prevState) => prevState + 1);
    setPlaying(true);
  };

  return (
    <>
      {videoIds.length ? (
        <>
          <div
            style={{
              // outline: '1px solid red',
              position: 'relative',
              paddingTop: '56.25%',
              // width: '100%',
              // display: 'flex',
              // position: 'relative',
              // backgroundColor: 'black',
            }}
          >
            <ReactPlayer
              // style={{ position: 'relative' }}
              style={{
                // border: '20px solid green',
                position: 'absolute',
                top: '0',
                left: '0',
              }}
              playing={playing}
              url={
                `https://movie-tongue.b-cdn.net/clips/${selectedLanguage?.language_id}/${videoIds[playIndex].title}` + //${videoIds[playIndex].key}` +
                (!videoIds[playIndex].segment_title
                  ? ''
                  : `/${videoIds[playIndex].segment_title}`) +
                `/${videoIds[playIndex].sentence_id}.mp4`
              }
              controls
              width={'100%'}
              height={'100%'}
              playsinline
              config={{
                attributes: {
                  controlsList: 'nofullscreen nodownload',
                },
              }}
            ></ReactPlayer>
          </div>
          <div
            style={{
              // position: 'absolute',
              color: 'yellow',
              // bottom: '55px',
              // left: '50%',
              // transform: 'translate(-50%)',
              backgroundColor: 'black',
              padding: '10px',
              paddingTop: '0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              // width: '100%',
              textAlign: 'center',
              // border: '1px solid red',
            }}
          >
            <p
              style={{ marginBottom: '10px' }}
              dangerouslySetInnerHTML={{
                __html: examples.filter(
                  (el) => el.sentence_id === videoIds[playIndex].sentence_id,
                )[0]?.sentence_html,
              }}
            >
              {/* {
                examples.filter((el) => el.id === videoIds[playIndex].id)[0]
                  .sentence_html
              } */}
            </p>
            <p style={{ color: 'white', fontSize: '14px' }}>
              {
                examples.filter(
                  (el) => el.sentence_id === videoIds[playIndex].sentence_id,
                )[0]?.sentence_en_semantic
              }
            </p>
            <p style={{ color: 'white', fontSize: '14px' }}>
              {
                examples.filter(
                  (el) => el.sentence_id === videoIds[playIndex].sentence_id,
                )[0]?.sentence_en_literal
              }
            </p>
          </div>
          {videoIds.length > 1 && (
            <Group>
              <Button
                disabled={!videoIds.length || playIndex === 0}
                my='md'
                onClick={previousVideo}
              >
                Previous
              </Button>
              <Button
                disabled={!videoIds.length || playIndex === videoIds.length - 1}
                my='md'
                onClick={nextVideo}
              >
                Next
              </Button>
              <div>
                {playIndex + 1} / {videoIds.length}
              </div>
            </Group>
          )}
        </>
      ) : null}
    </>
  );
}
