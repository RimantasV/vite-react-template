import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Fieldset,
  Flex,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';

import { checkHTML } from '../../utils';
import SelectbleAttribute from '../ReviewClips/SelectableAttribute';

type Props = {
  handleTextEnChange: (index: number, value: string) => void;
  handleTextHtmlChange: (index: number, value: string) => void;
  handleDeeplTranslate: (sentence: string, index: number) => Promise<void>;
  lyricsRow: {
    text: string;
    durMs: number;
    startMs: number;
    text_en: string;
    text_html: string;
  };
  index: number;
};

export default function LyricsRow({
  lyricsRow,
  index,
  handleTextEnChange,
  handleTextHtmlChange,
  handleDeeplTranslate,
}: Props) {
  //   const [sentenceHtml, setSentenceHtml] = useState(lyricsRow.text_html);
  const [words, setWords] = useState(
    lyricsRow.text_html.split(
      /(<span class=".+?" data-word-id=".+?">.+?<\/span>)/g,
    ),
  );

  const [textAreaSelectionStart, setTextAreaSelectionStart] = useState(0);
  const [textAreaSelectionEnd, setTextAreaSelectionEnd] = useState(0);

  useEffect(() => {
    setWords(
      lyricsRow.text_html.split(
        /(<span class=".+?" data-word-id=".+?">.+?<\/span>)/g,
      ),
    );
  }, [lyricsRow.text_html]);

  useEffect(() => {
    handleTextHtmlChange(index, words.join(''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, words]);

  const updateWord = (index: number, value: string) => {
    const newValue = [
      ...words.slice(0, index),
      value,
      ...words.slice(index + 1),
    ];
    setWords(newValue);
  };

  const handleWrapWord = () => {
    const word = lyricsRow.text_html.slice(
      textAreaSelectionStart,
      textAreaSelectionEnd,
    );
    const newWord = `<span class="clickable" data-word-id="${word}-xxx">${word}</span>`;
    const newSentenceHtml =
      lyricsRow.text_html.slice(0, textAreaSelectionStart) +
      newWord +
      lyricsRow.text_html.slice(textAreaSelectionEnd);
    handleTextHtmlChange(index, newSentenceHtml);
    // setWords(newSentenceHtml.split(/(<span class=".+?" data-word-id=".+?">.+?<\/span>)/g));
  };

  return (
    <Fieldset legend='Lyrics row' variant='filled'>
      <Flex mb='md' align='center'>
        <Box
          w={10}
          h={10}
          bg={checkHTML(lyricsRow.text_html) ? 'green' : 'red'}
          style={{ borderRadius: '50%' }}
        ></Box>
        <Text
          ml='md'
          className='xxx'
          dangerouslySetInnerHTML={{ __html: lyricsRow.text_html }}
        ></Text>
      </Flex>

      <Textarea
        mb='md'
        rows={7}
        label='HTML'
        value={lyricsRow.text_html}
        onChange={(e) => handleTextHtmlChange(index, e.target.value)}
        onSelect={(e) => {
          const target = e.target as HTMLTextAreaElement;
          setTextAreaSelectionStart(target.selectionStart);
          setTextAreaSelectionEnd(target.selectionEnd);
          console.log(
            lyricsRow.text_html.slice(
              target.selectionStart,
              target.selectionEnd,
            ),
          );
        }}
      />
      {textAreaSelectionStart !== textAreaSelectionEnd &&
        (textAreaSelectionStart || textAreaSelectionEnd) && (
          <Button onClick={handleWrapWord}>Wrap Selected Text into span</Button>
        )}
      <Flex p='xs' display='flex' mb='md' justify='center'>
        {words.map((el, i) => (
          <SelectbleAttribute
            key={i}
            index={i}
            word={el}
            updateWord={updateWord}
          />
        ))}
      </Flex>

      <Flex align='end'>
        <TextInput
          flex={1}
          // mb='md'
          label='Translation'
          value={lyricsRow.text_en}
          onChange={(e) => handleTextEnChange(index, e.target.value)}
          mr={'md'}
        />
        <Button onClick={() => handleDeeplTranslate(lyricsRow.text, index)}>
          Translate with Deepl
        </Button>
      </Flex>
    </Fieldset>
  );
}
