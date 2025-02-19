import { useCallback, useEffect, useRef, useState } from 'react';
import YouTube, { YouTubePlayer, YouTubeProps } from 'react-youtube';

import { ActionIcon, Box, Checkbox, Flex, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconPlayerPause,
  IconPlayerPlay,
  IconReload,
} from '@tabler/icons-react';

import { Layout, SheetContent } from '../../components';
import { useLanguageStore } from '../../store';
import { DictionaryRecord } from '../../types';
import HTMLWithPopovers from './HTMLWithPopovers';
import testData from './testData.json';

import styles from './song.module.scss';

declare global {
  interface Window {
    YT: {
      loading: 1;
      loaded: 1;
      PlayerState: {
        UNSTARTED: -1;
        ENDED: 0;
        PLAYING: 1;
        PAUSED: 2;
        BUFFERING: 3;
        CUED: 5;
      };
    };
  }
}

// type Lyrics = {
//   text: string;
//   time: { total: number; minutes: number; seconds: number; hundredths: number };
// }[];

type Lyrics = {
  startMs: number;
  durMs: number;
  text: string;
  text_html: string;
}[];

type Song = {
  artist: string;
  title: string;
  youtube_video_id: string;
  lyrics_html: {
    text: string;
    durMs: number;
    startMs: number;
    text_en: string;
    text_html: string;
  }[];
};

const testDataTyped = testData as Song[];

export default function Song() {
  const { selectedLanguage } = useLanguageStore();
  const [opened, { open, close }] = useDisclosure(false);
  // const [popoverOpened, { open: openPopover, close: closePopover }] =
  //   useDisclosure(false);
  const [activeWords, setActiveWords] = useState<string[]>();
  const [activeForm, setActiveForm] = useState<string>();
  const [isExpanded, setIsExpanded] = useState(false);
  const [dictionaryRecord, setDictionaryRecord] = useState<DictionaryRecord[]>(
    [],
  );

  const [lyrics, setLyrics] = useState<Lyrics>();

  const [currentTime, setCurrentTime] = useState(0);
  const [player, setPlayer] = useState<YouTubePlayer>();
  const [activeSubtitle, setActiveSubtitle] = useState<Lyrics[number]>();
  const [activeSubtitleIndex, setActiveSubtitleIndex] = useState<number>();
  const subtitleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [pauseAfterRow, setPauseAfterRow] = useState(false);
  const [playerState, setPlayerState] = useState<number>();
  const [videoId, setVideoId] = useState<string>('');

  const fetchSongs = useCallback(async () => {
    // const ENDPOINT = `${import.meta.env.VITE_BASE_URL}/api/song?lang=${selectedLanguage?.language_id}`;

    try {
      const response = await fetch('/src/pages/Song/testData.json');

      console.log(response);
      const data: Song[] = await response.json();
      setLyrics(data[0]?.lyrics_html);
      setVideoId(data[0].youtube_video_id);
    } catch (error) {
      console.error(error);
    }
  }, [selectedLanguage?.language_id]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  // YouTube player options
  const opts: YouTubeProps['opts'] = {
    height: '360',
    width: '640',
    playerVars: {
      autoplay: 1, // Auto-play the video
      // controls: 0, // Hide video controls
    },
  };

  const fetchDictionaryRecord = useCallback(
    async (id: string) => {
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/dictionary/${id}?lang=${selectedLanguage?.language_id}`,
      );

      const data: DictionaryRecord[] = await response.json();
      if (data[0].word_id) {
        setDictionaryRecord((prevState) => [...prevState, data[0]]);
      }
    },
    [selectedLanguage],
  );

  const fetchEng = (wordIdArray: string[]) => {
    if (wordIdArray && wordIdArray?.length > 0) {
      const filtered = [
        ...new Set(wordIdArray.filter((el) => !el.endsWith('*'))),
      ];

      filtered.forEach((word: string) => {
        fetchDictionaryRecord(word);
      });
    } else {
      setDictionaryRecord([]);
    }
  };

  const getActiveSubtitleIndex = useCallback(() => {
    return lyrics?.findLastIndex(
      (sub) =>
        currentTime >= sub.startMs / 1000 &&
        currentTime < (sub.startMs + sub.durMs) / 1000,
    );
  }, [currentTime, lyrics]);

  // Find the active subtitle based on current time
  const getActiveSubtitle = useCallback(() => {
    return lyrics?.find(
      (sub) =>
        currentTime >= sub.startMs / 1000 &&
        currentTime < (sub.startMs + sub.durMs) / 1000,
    );
  }, [currentTime, lyrics]);

  useEffect(() => {
    setActiveSubtitle(getActiveSubtitle());
    setActiveSubtitleIndex(getActiveSubtitleIndex());
  }, [currentTime, getActiveSubtitle, getActiveSubtitleIndex]);

  // Pause the video at the end of each lyric
  useEffect(() => {
    if (pauseAfterRow && player && activeSubtitle) {
      const endTime = (activeSubtitle.startMs + activeSubtitle.durMs) / 1000;
      if (currentTime >= endTime) {
        player.pauseVideo();
        player.seekTo((activeSubtitle.startMs + activeSubtitle.durMs) / 1000);
      }
    }
  }, [currentTime, player, activeSubtitle, pauseAfterRow]);

  // Scroll the active subtitle into view
  useEffect(() => {
    if (activeSubtitle) {
      const index = lyrics?.indexOf(activeSubtitle);
      const subtitleElement = subtitleRefs.current[index || 0];
      if (subtitleElement) {
        subtitleElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center', // Ensure the subtitle is centered in the viewport
        });
      }
    }
  }, [activeSubtitle, lyrics]);

  // Handle when the YouTube player is ready
  const onReady: YouTubeProps['onReady'] = (event) => {
    setPlayer(event.target);
  };

  // Handle video state changes (e.g., play, pause)
  const onStateChange = (event: { data: number }) => {
    setPlayerState(event.data);
    if (event.data === window.YT?.PlayerState.PLAYING) {
      // Update current time every 100ms
      const interval = setInterval(() => {
        if (player && player.getCurrentTime) {
          setCurrentTime(player.getCurrentTime());
        }
      }, 100);

      // Cleanup interval on unmount or pause
      return () => clearInterval(interval);
    }
  };

  const changeTime = (seconds: number) => {
    console.log(seconds);
    player?.seekTo(seconds);
  };

  const handlePause = () => {
    player?.pauseVideo();
  };

  const handlePlay = () => {
    player?.playVideo();
  };

  const handleSetPauseAfterRow = () => {
    setPauseAfterRow((prev) => !prev);
  };

  const handleRepeat = () => {
    //repeat row that just played
    // if (player && activeSubtitle) {
    //   player.seekTo(activeSubtitle.startMs / 1000);
    // }
    if (lyrics) {
      player.seekTo(lyrics[(activeSubtitleIndex || 0) - 1].startMs / 1000);
      player.playVideo();
    }
  };

  const handleLyricsClick = (
    target: Element,
    // e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    sub: {
      startMs: number;
      durMs?: number;
      text?: string;
      text_html?: string;
    },
  ) => {
    // console.log(e);
    console.log(sub);
    changeTime(sub.startMs / 1000);

    // const target = e.target as HTMLParagraphElement;

    console.log({ target });

    if (!target.classList.contains('clickable')) return;
    target.classList.toggle(styles.highlight);

    const wordId = (target as HTMLElement).dataset.wordId;
    let wordIdArray: string[] = [];
    if (wordId) {
      wordIdArray = wordId?.split('_');
    }

    if (wordId) {
      setActiveForm(target.textContent!);
      setActiveWords(wordIdArray);
      open();
      fetchEng(wordIdArray);
    }
  };

  return (
    <Layout>
      <Flex direction='column' align='center' justify='center' mb='md'>
        <YouTube
          videoId={videoId} // Replace with your YouTube video ID
          opts={opts}
          onReady={onReady}
          onStateChange={onStateChange}
        />

        <Box w={640} className={styles.subtitles}>
          {lyrics?.map((sub, _index) => (
            // <div
            //   dangerouslySetInnerHTML={{ __html: sub.text_html }}
            //   ref={(el) => (subtitleRefs.current[index] = el)} // Attach ref to each subtitle
            //   className={`${styles.subtitle} ${activeSubtitle === sub ? styles.active : ''}`}
            //   onClick={(e) => handleLyricsClick(e, sub)}
            //   key={index}
            // >
            //   {/* {sub.text} */}
            // </div>
            <HTMLWithPopovers handleLyricsClick={handleLyricsClick} sub={sub} />
          ))}
        </Box>
        <Flex w={640} style={{ position: 'relative' }}>
          <ActionIcon
            variant='transparent'
            color='gray'
            size='xl'
            radius='xl'
            aria-label='Settings'
          >
            <IconReload
              onClick={handleRepeat}
              style={{ width: '70%', height: '70%' }}
              stroke={1.5}
            />
          </ActionIcon>
          {/* <Box style={{ flex: 1 }}></Box> */}
          <Flex
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            {/* <ActionIcon
              variant='transparent'
              color='gray'
              size='xl'
              radius='xl'
              aria-label='Settings'
            >
              <IconPlayerTrackPrev
                style={{ width: '70%', height: '70%' }}
                stroke={1.5}
              />
            </ActionIcon> */}
            {playerState === window.YT?.PlayerState.PLAYING ? (
              <ActionIcon
                variant='transparent'
                color='gray'
                size='xl'
                radius='xl'
                aria-label='Settings'
                onClick={handlePause}
              >
                <IconPlayerPause
                  style={{ width: '70%', height: '70%' }}
                  stroke={1.5}
                />
              </ActionIcon>
            ) : (
              <ActionIcon
                variant='transparent'
                color='gray'
                size='xl'
                radius='xl'
                aria-label='Settings'
                onClick={handlePlay}
              >
                <IconPlayerPlay
                  style={{ width: '70%', height: '70%' }}
                  stroke={1.5}
                />
              </ActionIcon>
            )}
            {/* <ActionIcon
              variant='transparent'
              color='gray'
              size='xl'
              radius='xl'
              aria-label='Settings'
            >
              <IconPlayerTrackNext
                style={{ width: '70%', height: '70%' }}
                stroke={1.5}
              />
            </ActionIcon> */}
          </Flex>
        </Flex>
      </Flex>
      <Box w={640} ml='auto' mr={'auto'}>
        <Checkbox
          label='Pause after each row'
          checked={pauseAfterRow}
          onChange={handleSetPauseAfterRow}
        />
      </Box>
      <Modal opened={opened} onClose={close} centered>
        <SheetContent
          activeWords={activeWords}
          activeForm={activeForm!}
          dictionaryRecord={dictionaryRecord}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          setOpen={close}
        />
      </Modal>
    </Layout>
  );
}
