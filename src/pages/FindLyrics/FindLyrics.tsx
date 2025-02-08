import {
  ChangeEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import YouTubePlayer from 'react-player/youtube';
import YouTube, { YouTubeProps } from 'react-youtube';

import {
  Box,
  Button,
  Container,
  Flex,
  NumberInput,
  Stack,
  TextInput,
} from '@mantine/core';

import { useLanguageStore } from '../../store';

import styles from './findLyrics.module.scss';

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
}[];

export default function FindLyrics() {
  const { selectedLanguage } = useLanguageStore();
  const [youtubeVideoId, SetYoutubeVideoId] = useState('');
  const [lyrics, setLyrics] = useState<Lyrics>([
    {
      startMs: 580,
      durMs: 5280,
      text: 'Man vaknar varje morgon med en hemskhet i sitt bröst',
    },
    {
      startMs: 5860,
      durMs: 5240,
      text: 'Kan inte äta, dricker kaffe, åker buss till jobbet',
    },
    {
      startMs: 11100,
      durMs: 5440,
      text: 'Där är långa, trista timmar, meningslösa klyschor',
    },
    {
      startMs: 16540,
      durMs: 5760,
      text: 'Ingen öppnar sig',
    },
    {
      startMs: 22300,
      durMs: 5270,
      text: 'Man stirrar bara tomt och pratar strunt och skrattar till',
    },
    {
      startMs: 27570,
      durMs: 5910,
      text: 'Men man vänjer sig',
    },
    {
      startMs: 33480,
      durMs: 5600,
      text: 'Man vänjer sig',
    },
    {
      startMs: 39080,
      durMs: 4930,
      text: 'Och jobbet som man gör, det har man ingenting för',
    },
    {
      startMs: 44010,
      durMs: 5130,
      text: 'Det är nån annan som drar nytta av det, ingen aning vem',
    },
    {
      startMs: 49140,
      durMs: 6440,
      text: 'Man bara flyttar sina papper, drar i sina spakar',
    },
    {
      startMs: 55580,
      durMs: 4880,
      text: 'Hämtar sina pengar, det känns dumt och idiotiskt',
    },
    {
      startMs: 60460,
      durMs: 5910,
      text: 'Men man vänjer sig',
    },
    {
      startMs: 66370,
      durMs: 4840,
      text: 'Man vänjer sig',
    },
    {
      startMs: 71210,
      durMs: 5640,
      text: 'När man kommer hem på kvällen har man glömt att stänga fönstret',
    },
    {
      startMs: 76850,
      durMs: 5270,
      text: 'Det är sot och smuts på fönsterkarmen, avgaser i rummet',
    },
    {
      startMs: 82120,
      durMs: 5650,
      text: 'Man har glömt att köpa mat',
    },
    {
      startMs: 87770,
      durMs: 5350,
      text: 'Fast inte har man just nån matlust, pressar i sig några mackor',
    },
    {
      startMs: 93120,
      durMs: 5230,
      text: 'Man vänjer sig',
    },
    {
      startMs: 98350,
      durMs: 5940,
      text: 'Man får vänja sig',
    },
    {
      startMs: 104290,
      durMs: 5140,
      text: 'Man tar magnecyl mot huvudvärken, dåsar framför tv:n',
    },
    {
      startMs: 109430,
      durMs: 5670,
      text: 'Grannen går på toaletten och det brusar i rören',
    },
    {
      startMs: 115100,
      durMs: 5650,
      text: 'Man är trött och går och lägger sig',
    },
    {
      startMs: 120750,
      durMs: 7920,
      text: 'Och grannen grälar med sin fru, trafiken är oändlig, det är omöjligt att sova',
    },
    {
      startMs: 128670,
      durMs: 5040,
      text: 'Men man vänjer sig',
    },
    {
      startMs: 133710,
      durMs: 6270,
      text: 'Man måste vänja sig',
    },
    {
      startMs: 139980,
      durMs: 4590,
      text: 'Lakanen snor sig och blir fuktiga av svett',
    },
    {
      startMs: 144570,
      durMs: 6120,
      text: 'Och nattens timmar är som gummiband i väntan på glömskans sömn',
    },
    {
      startMs: 150690,
      durMs: 4830,
      text: 'Så ringer väckarklockan',
    },
    {
      startMs: 155520,
      durMs: 5890,
      text: 'Herrejävlar, denna pina, man orkar inte tvätta sig',
    },
    {
      startMs: 161410,
      durMs: 5710,
      text: 'Dricker kallnat kaffe från igår',
    },
    {
      startMs: 167120,
      durMs: 4970,
      text: 'Och ute är det kallt och mörkt och ruggigt och dimma',
    },
    {
      startMs: 172090,
      durMs: 5470,
      text: 'Men man vänjer sig',
    },
    {
      startMs: 177560,
      durMs: 5560,
      text: 'Man vänjer sig',
    },
    {
      startMs: 183120,
      durMs: 5320,
      text: 'Så blir det fredag alla fall, man super lite håglöst',
    },
    {
      startMs: 188440,
      durMs: 5220,
      text: 'Och på lördan går man ut i parken, unnar sig en pizza',
    },
    {
      startMs: 193660,
      durMs: 5550,
      text: 'Och på kvällen kommer gråten',
    },
    {
      startMs: 199210,
      durMs: 5710,
      text: 'Det är skönt att våga bli förtvivlad, känna sig verklig',
    },
    {
      startMs: 204920,
      durMs: 5130,
      text: 'Man köper lite porr i en tidningsautomat',
    },
    {
      startMs: 210050,
      durMs: 5450,
      text: 'Och går hem och onanerar, det är outsägligt torftigt',
    },
    {
      startMs: 215500,
      durMs: 4940,
      text: 'Men man vänjer sig',
    },
    {
      startMs: 220440,
      durMs: 6290,
      text: 'Man får lov att vänja sig',
    },
  ]);
  const [trackId, setTrackId] = useState<string>();
  const [delay, setDelay] = useState<number>();
  const [artist, setArtist] = useState<string>();
  const [title, setTitle] = useState<string>();

  const insertSongIntoDatabase = async () => {
    const ENDPOINT = `${import.meta.env.VITE_BASE_URL}/api/song?lang=${selectedLanguage?.language_id}`;

    const payload = {
      artist,
      title,
      youtubeVideoId,
      lyricsOriginal: JSON.stringify(lyrics),
    };

    try {
      await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application.json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLyrics = async () => {
    let url = `https://spotify-scraper.p.rapidapi.com/v1/track/lyrics?trackId=${trackId}&format=json&removeNote=false`;
    if (delay) url += `&delay=${delay}`;

    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '22df3f2d78msh43b040d054544e5p1599ebjsna2a722f8b297',
        'x-rapidapi-host': 'spotify-scraper.p.rapidapi.com',
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setLyrics(result);
    } catch (error) {
      console.error(error);
    }
  };

  const [currentTime, setCurrentTime] = useState(0);
  const [player, setPlayer] = useState<YouTubePlayer>();
  const [activeSubtitle, setActiveSubtitle] = useState<Lyrics[number]>();
  const subtitleRefs = useRef<(HTMLDivElement | null)[]>([]);

  // YouTube player options
  const opts: YouTubeProps['opts'] = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1, // Auto-play the video
    },
  };

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
  }, [currentTime, getActiveSubtitle]);

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
    console.log(event);
    if (event.data === window.YT.PlayerState.PLAYING) {
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
    player?.seekTo(seconds);
  };

  const handleOnChangeYoutubeVideoId = (e: ChangeEvent<HTMLInputElement>) => {
    SetYoutubeVideoId(e.target.value);
  };

  const handleSetTrackId = (e: {
    target: { value: SetStateAction<string | undefined> };
  }) => {
    setTrackId(e.target.value);
  };

  const handleSetDelay = (value: string | number) => {
    if (typeof value === 'string') {
      setDelay(Number(value));
    } else {
      setDelay(value);
    }
  };

  const handleSetArtist = (e: {
    target: { value: SetStateAction<string | undefined> };
  }) => {
    setArtist(e.target.value);
  };

  const handleSetTitle = (e: {
    target: { value: SetStateAction<string | undefined> };
  }) => {
    setTitle(e.target.value);
  };

  return (
    <>
      <div>
        <Container size='lg'>
          <Flex gap={10}>
            <Stack flex={1}>
              <Box>
                <TextInput
                  label='Spotify Track Id'
                  placeholder='trackId'
                  value={trackId}
                  onChange={handleSetTrackId}
                />
                <NumberInput
                  mt='md'
                  label='Delay (ms)'
                  placeholder='delay'
                  value={delay}
                  onChange={(value) => handleSetDelay(value)}
                />
                <Button type='submit' mt='md' onClick={fetchLyrics}>
                  Fetch Lyrics
                </Button>
              </Box>
              <Box mt='md'>
                <TextInput
                  label='Artist'
                  value={artist}
                  onChange={handleSetArtist}
                />
                <TextInput
                  mb='md'
                  label='Title'
                  value={title}
                  onChange={handleSetTitle}
                />
                <Button onClick={insertSongIntoDatabase}>
                  Upload to database
                </Button>
              </Box>
            </Stack>

            <Box>
              <TextInput
                label='Youtube video id'
                value={youtubeVideoId}
                onChange={(e) => handleOnChangeYoutubeVideoId(e)}
                mb='md'
              />
              <YouTube
                videoId={youtubeVideoId}
                opts={opts}
                onReady={onReady}
                onStateChange={onStateChange}
              />
            </Box>
          </Flex>
        </Container>

        <div className={styles.subtitles}>
          {lyrics?.map((sub, index) => (
            <div
              ref={(el) => (subtitleRefs.current[index] = el)} // Attach ref to each subtitle
              className={`${styles.subtitle} ${activeSubtitle === sub ? styles.active : ''}`}
              onClick={() => changeTime(sub.startMs / 1000)}
              key={index}
            >
              {sub.text}
            </div>
          ))}
        </div>
      </div>

      {/* <div>
        {lyrics.map((row) => {
          return (
            //   <div>
            //     {Math.floor((row.time.minutes * 60 + row.time.seconds + 14) / 60) +
            //       ':' +
            //       ((row.time.seconds + 14) % 60)}
            //     {' - '}
            //     {row.text}
            //   </div>
            <div>
              {Math.floor(row.startMs / 1000)} - {row.text}
            </div>
          );
        })}
      </div> */}
    </>
  );
}
