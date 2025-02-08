import { useCallback, useEffect, useState } from 'react';

import { useLanguageStore } from '../../store';

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

export default function ReviewSongs() {
  const { selectedLanguage } = useLanguageStore();

  const [songs, setSongs] = useState<Song>();

  const fetchSongs = useCallback(async () => {
    const ENDPOINT = `${import.meta.env.VITE_BASE_URL}/api/song?lang=${selectedLanguage?.language_id}`;

    try {
      const response = await fetch(ENDPOINT);
      const data = await response.json();
      setSongs(data[0]);
    } catch (error) {
      console.error(error);
    }
  }, [selectedLanguage?.language_id]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const handleTextEnChange = (index: number, value: string) => {
    const updatedLyrics = [...songs!.lyrics_html];
    updatedLyrics[index].text_en = value;
    setSongs({ ...songs!, lyrics_html: updatedLyrics });
  };

  const handleTextHtmlChange = (index: number, value: string) => {
    const updatedLyrics = [...songs!.lyrics_html];
    updatedLyrics[index].text_html = value;
    setSongs({ ...songs!, lyrics_html: updatedLyrics });
  };

  return (
    <div>
      <h2>
        {songs?.title} by {songs?.artist}
      </h2>
      {songs?.lyrics_html.map((line, index) => (
        <div key={index}>
          <div>
            <label>English Text:</label>
            <input
              type='text'
              value={line.text_en}
              onChange={(e) => handleTextEnChange(index, e.target.value)}
            />
          </div>
          <div>
            <label>HTML Text:</label>
            <input
              type='text'
              value={line.text_html}
              onChange={(e) => handleTextHtmlChange(index, e.target.value)}
            />
          </div>
        </div>
      ))}
      <button onClick={() => {}}>Save</button>
      {songs?.lyrics_html.map((lyric) => {
        return (
          <div>
            <p dangerouslySetInnerHTML={{ __html: lyric.text_html }}></p>
            <p>{lyric.text_en}</p>
          </div>
        );
      })}
    </div>
  );
}
