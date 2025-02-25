import { useCallback, useEffect, useState } from 'react';

import { Container } from '@mantine/core';

import { useLanguageStore } from '../../store';
import LyricsRow from './LyricsRow';

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
  console.log(songs);
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

  const handleTextHtmlChange = useCallback(
    (index: number, value: string) => {
      console.log(index, value);
      const updatedLyrics = [...songs!.lyrics_html];
      updatedLyrics[index].text_html = value;
      console.log(songs);
      console.log({ ...songs!, lyrics_html: updatedLyrics });
      setSongs({ ...songs!, lyrics_html: updatedLyrics });
    },
    [songs],
  );

  const handleDeeplTranslate = async (sentence: string, index: number) => {
    const deeplUrl = `https://api-free.deepl.com/v2/translate?auth_key=${
      import.meta.env.VITE_DEEPL_API_KEY
    }&text=${sentence}&source_lang=${selectedLanguage?.language_id.toUpperCase()}&target_lang=EN`;

    const response = await fetch(deeplUrl);

    const data: { translations: { text: string }[] } = await response.json();

    const updatedLyrics = [...songs!.lyrics_html];
    updatedLyrics[index].text_en = data.translations[0].text;
    setSongs({ ...songs!, lyrics_html: updatedLyrics });
  };

  return (
    <Container size='lg'>
      <h2>
        {songs?.title} by {songs?.artist}
      </h2>
      {songs?.lyrics_html.map((line, index) => (
        <LyricsRow
          key={index}
          lyricsRow={line}
          index={index}
          handleTextEnChange={handleTextEnChange}
          handleTextHtmlChange={handleTextHtmlChange}
          handleDeeplTranslate={handleDeeplTranslate}
        />
        // <Fieldset key={index} legend='Lyrics row' variant='filled'>
        //   <Flex mb='md' align='center'>
        //     <Box
        //       w={10}
        //       h={10}
        //       bg={checkHTML(line.text_html) ? 'green' : 'red'}
        //       style={{ borderRadius: '50%' }}
        //     ></Box>
        //     <Text
        //       ml='md'
        //       className='xxx'
        //       dangerouslySetInnerHTML={{ __html: line.text_html }}
        //     ></Text>
        //   </Flex>

        //   <Textarea
        //     mb='md'
        //     rows={7}
        //     label='HTML'
        //     value={line.text_html}
        //     onChange={(e) => handleTextHtmlChange(index, e.target.value)}
        //     // onSelect={(e) => {
        //     //   const target = e.target as HTMLTextAreaElement;
        //     //   setTextAreaSelectionStart(target.selectionStart);
        //     //   setTextAreaSelectionEnd(target.selectionEnd);
        //     //   console.log(
        //     //     sentenceHtml.slice(target.selectionStart, target.selectionEnd),
        //     //   );
        //     // }}
        //   />

        //   <Flex p='xs' display='flex' mb='md' justify='center'>
        //     {line.text_html
        //       .split(/(<span class=".+?" data-word-id=".+?">.+?<\/span>)/g)
        //       .map((el, i) => (
        //         <SelectbleAttribute
        //           key={i}
        //           index={i}
        //           word={el}
        //           updateWord={updateWord}
        //         />
        //       ))}
        //   </Flex>

        //   <Flex align='end'>
        //     <TextInput
        //       flex={1}
        //       // mb='md'
        //       label='Translation'
        //       value={line.text_en}
        //       onChange={(e) => handleTextEnChange(index, e.target.value)}
        //       mr={'md'}
        //     />
        //     <Button onClick={() => handleDeeplTranslate(line.text, index)}>
        //       Translate with Deepl
        //     </Button>
        //   </Flex>
        // </Fieldset>
      ))}
      <button onClick={() => {}}>Save</button>
      {/* {songs?.lyrics_html.map((lyric) => {
        return (
          <div>
            <p dangerouslySetInnerHTML={{ __html: lyric.text_html }}></p>
            <p>{lyric.text_en}</p>
          </div>
        );
      })} */}
    </Container>
  );
}
