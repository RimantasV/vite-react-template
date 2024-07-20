import { Button, Group } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import ReactPlayer from 'react-player/file';
import { SentencesRespose } from '../../types';
import { calculateTimeDifference } from '../../utils';

type Props = {
  examples: SentencesRespose;
};

export default function Video({ examples }: Props) {
  // console.log(examples);

  // const [videoId, setVideoId] = useState<number>();
  const [playIndex, setPlayIndex] = useState<number>(0);
  const [videoIds, setVideoIds] = useState<number[]>([]);
  const [ids, setIds] = useState<number[]>();

  useEffect(() => {
    setIds(
      examples
        .filter(
          (el) =>
            // el.key === 'iLoveYouStupid' &&
            el.timestamps && calculateTimeDifference(el.timestamps) > 2
        )
        .map((el) => el.id)
        .slice(0, 10)
    );
  }, [examples]);

  // const ids =

  // const idToCheck = ids[0];
  //
  // console.log(ids);
  // console.log(videoIds);
  // console.log(idToCheck);

  // ids.forEach((id) => checkIfVideoExists(id));

  useEffect(() => {
    // console.log('effect');
    // console.log(ids?.length);
    if (ids?.length) {
      for (let i = 0; i < (ids?.length || 0); i++) {
        checkIfVideoExists(ids[i]);
      }
    }
  }, [ids?.length]);

  const checkIfVideoExists = useCallback(async (id: number) => {
    if (id) {
      const ENDPOINT = `https://movie-tongue.b-cdn.net/file_${id}.mp4`;
      // console.log({ ENDPOINT });
      const response = await fetch(ENDPOINT, {
        method: 'HEAD',
      });
      if (response.ok) {
        // setVideoId(idToCheck);
        setVideoIds((prevState) => {
          if (prevState.includes(id)) {
            return prevState;
          } else return [...prevState, id];
        });
      } else {
        console.log('HTTP error:', response.status, response.statusText);
      }
    }
  }, []);

  const previousVideo = () => {
    setPlayIndex((prevState) => prevState - 1);
  };

  const nextVideo = () => {
    setPlayIndex((prevState) => prevState + 1);
  };

  // useEffect(() => {
  //   if (idToCheck) {
  //     checkIfVideoExists();
  //   }
  // }, [idToCheck]);

  return (
    <>
      {videoIds.length && (
        <>
          <div
            style={{
              outline: '1px solid black',
              width: '100%',
              display: 'flex',
              position: 'relative',
            }}
          >
            <ReactPlayer
              style={{ position: 'relative' }}
              url={`https://movie-tongue.b-cdn.net/file_${videoIds[playIndex]}.mp4`}
              // url={`https://movie-tongue.b-cdn.net/file_4127.webm`}
              // url={
              //   'https://movie-tongue.b-cdn.net/test/Gangs%20of%20Galicia_S01E01_Episode%201.mp4'
              // }
              // url={
              //   'https://movie-tongue.b-cdn.net/test/Berlin_S01E01_The%20Energy%20of%20Love.mp4'
              // }
              controls
              width={'100%'}
              height={'450px'}
              // muted
              // playing
              // loop
              // config={{
              //   attributes: {
              //     controlsList: 'nofullscreen nodownload',
              //   },
              // }}
            ></ReactPlayer>
            <div
              style={{
                position: 'absolute',
                color: 'yellow',
                bottom: '55px',
                left: '50%',
                transform: 'translate(-50%)',
                backgroundColor: 'black',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <p style={{ marginBottom: '10px' }}>
                {
                  examples.filter(
                    (el) => el.id === videoIds[playIndex]
                    // el.key === 'iLoveYouStupid' &&
                    // el.timestamps &&
                    // calculateTimeDifference(el.timestamps) > 2
                  )[0].sentence
                }
              </p>
              <p style={{ color: 'white', fontSize: '14px' }}>
                {
                  examples.filter(
                    (el) => el.id === videoIds[playIndex]
                    // el.key === 'iLoveYouStupid' &&
                    // el.timestamps &&
                    // calculateTimeDifference(el.timestamps) > 2
                  )[0].sentence_en_semantic
                }
              </p>
            </div>
          </div>
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
        </>
      )}
    </>
  );
}
