import { useCallback, useEffect, useState } from 'react';
import YouTubePlayer from 'react-player/youtube';
import YouTube, { YouTubeProps } from 'react-youtube';

import styles from './lyricsFinder.module.scss';

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

type Lyrics = {
  startMs: number;
  durMs: number;
  text: string;
}[];

export default function LyricsFinder() {
  const [lyrics] = useState<Lyrics>([
    {
      startMs: 22610,
      durMs: 1930,
      text: 'Uno por pobre y feo, hombre',
    },
    {
      startMs: 24540,
      durMs: 2510,
      text: 'Pero antojao, ay, ome',
    },
    {
      startMs: 27050,
      durMs: 16470,
      text: '♪',
    },
    {
      startMs: 43520,
      durMs: 2090,
      text: 'Tengo la camisa negra',
    },
    {
      startMs: 45610,
      durMs: 2760,
      text: 'Hoy mi amor está de luto',
    },
    {
      startMs: 48370,
      durMs: 1900,
      text: 'Hoy tengo en el alma una pena',
    },
    {
      startMs: 50270,
      durMs: 3180,
      text: 'Y es por culpa de tu embrujo',
    },
    {
      startMs: 53450,
      durMs: 2160,
      text: 'Hoy sé que tú ya no me quieres',
    },
    {
      startMs: 55610,
      durMs: 2660,
      text: 'Y eso es lo que más me hiere',
    },
    {
      startMs: 58270,
      durMs: 2050,
      text: 'Que tengo la camisa negra',
    },
    {
      startMs: 60320,
      durMs: 2470,
      text: 'Y una pena que me duele',
    },
  ]);

  const [currentTime, setCurrentTime] = useState(0);
  const [player, setPlayer] = useState<YouTubePlayer>();
  const [activeSubtitle, setActiveSubtitle] = useState<Lyrics[number]>();

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
    return lyrics.find(
      (sub) =>
        currentTime >= sub.startMs / 1000 &&
        currentTime < (sub.startMs + sub.durMs) / 1000,
    );
  }, [currentTime, lyrics]);

  useEffect(() => {
    setActiveSubtitle(getActiveSubtitle());
  }, [currentTime, getActiveSubtitle]);

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

  return (
    <>
      <div>
        <YouTube
          videoId='kRt2sRyup6A' // Replace with your YouTube video ID
          opts={opts}
          onReady={onReady}
          onStateChange={onStateChange}
        />

        <div className={styles.subtitles}>
          {lyrics.map((sub, index) => (
            <div
              className={`${styles.subtitle} ${activeSubtitle === sub ? styles.active : ''}`}
              onClick={() => changeTime(sub.startMs / 1000)}
              key={index}
            >
              {sub.text}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
