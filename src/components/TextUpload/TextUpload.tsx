import React, { useCallback, useEffect, useState } from 'react';
import { Sheet } from 'react-modal-sheet';

import {
  Box,
  Button,
  Flex,
  Group,
  Paper,
  Text,
  TextInput,
} from '@mantine/core';

import { default as dictionaryIndexSingleImport } from '../../assets/dictionaries/dictionaryIndexSingle.json';
import { default as dictionaryIndexSingleImportSv } from '../../assets/dictionaries/dictionaryIndexSingleSv.json';
import { useLanguageStore } from '../../store';
import { Languages } from '../../types';
import { ImportTranslationRow } from '../ImportTranslationRow';
// import { DictionaryRecord, Languages } from '../../types';
import { TextToSpeech } from '../TextToSpeech';
import { SheetContent } from './SheetContent';

type TextData = {
  id: string;
  content: string;
};

type WordToTranslate = {
  source: string;
  translation: string[];
};

const TextUploadComponent: React.FC = () => {
  const { selectedLanguage } = useLanguageStore();

  const [text, setText] = useState<string>('');
  const [savedTexts, setSavedTexts] = useState<TextData[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  // const [translatedWords, setTranslatedWords] = useState<
  //   { word: string; translation: [{ glosses: string; tags: string[] }] }[]
  // >([]);

  const [wordsToTranslate, setWordsToTranslate] = useState<WordToTranslate[]>(
    [],
  );

  console.log(selectedLanguage?.language_id);

  const dictionaryIndexSingle =
    selectedLanguage?.language_id === Languages.ES
      ? (dictionaryIndexSingleImport as Record<string, string[]>)
      : (dictionaryIndexSingleImportSv as Record<string, string[]>);

  console.log(dictionaryIndexSingle['casa']);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleTextSubmit = async () => {
    if (text.trim()) {
      const newText: TextData = {
        id: Date.now().toString(),
        content: text.trim(),
      };
      setSavedTexts([...savedTexts, newText]);
      setText('');
      console.log('Text saved:', newText);
    }
  };

  const handleWordClick = (word: string) => {
    setSelectedWord(word);
    setIsSheetOpen(true);
  };

  // const fetchSearchDictionary = useCallback(
  //   async (lang: Languages, searchTerm: string) => {
  //     const ENDPOINT = `${
  //       import.meta.env.VITE_BASE_URL
  //     }/api/dictionary/search/${searchTerm}?lang=${lang}`;

  //     const response = await fetch(ENDPOINT);
  //     if (response.ok) {
  //       const data: DictionaryRecord[] = await response.json();
  //       const x = data
  //         .filter(
  //           (el) =>
  //             searchTerm === getStringBeforeDash(el.word_id).toLowerCase(),
  //         )
  //         .sort(
  //           (a, b) =>
  //             a.word_id.split('-')[0].length - b.word_id.split('-')[0].length,
  //         );
  //       if (x.length > 0) {
  //         const y = { word: x[0].word_id, translation: x[0].info.translation };
  //         setTranslatedWords((prevState) => [...prevState, y]);
  //       }
  //     } //else throw new Error((await response.json()).message);
  //   },
  //   [],
  // );

  const extractWords = useCallback(
    (text: string): string[] => {
      const regexSpanish = /[a-záéíóúüñ]+/gi;
      const regexSwedish = /[a-zåäö]+/gi;
      const regexGeneral = /[a-z]+/gi;

      let regex;
      switch (selectedLanguage?.language_id) {
        case 'es':
          regex = regexSpanish;
          break;
        case 'sv':
          regex = regexSwedish;
          break;
        default:
          regex = regexGeneral;
      }

      const array = text.toLowerCase().match(regex) || [];
      const uniqueArray = [...new Set(array)];
      // console.log({ length: uniqueArray.length});
      const translated = uniqueArray.map((el) => {
        if (Object.prototype.hasOwnProperty.call(dictionaryIndexSingle, el)) {
          return { source: el, translation: dictionaryIndexSingle[el] };
        } else return { source: el, translation: [] };
      });
      setWordsToTranslate(translated);
      return uniqueArray;
    },
    [dictionaryIndexSingle, selectedLanguage?.language_id],
  );

  // function getStringBeforeDash(input: string): string {
  //   const index = input.indexOf('-');
  //   return index !== -1 ? input.slice(0, index) : input;
  // }

  useEffect(() => {
    if (text) {
      extractWords(text);
    }
  }, [extractWords, text]);

  const renderText = (textData: TextData) => {
    return (
      //   <Flex wrap='wrap' gap='xs'>
      //     {textData.content.split(' ').map((word, index) => (
      //       <Text
      //         key={`${textData.id}-${index}`}
      //         component='span'
      //         onClick={() => handleWordClick(word)}
      //         style={{ cursor: 'pointer' }}
      //       >
      //         {word}
      //       </Text>
      //     ))}
      //   </Flex>
      //   <Flex wrap='wrap' gap='xs'>
      <div>
        {/* {extractSpanishWords(text)
          .map((el) => el.toLowerCase())
          .map((el, i) => (
            <p key={i}>{el}</p>
          ))} */}
        {/* {translatedWords.map((el, i) => (
          <p key={i}>
            {el.word} - {el.translation[0].glosses}
          </p>
        ))} */}
        {wordsToTranslate.map((el, i) => (
          <ImportTranslationRow key={i} wordToTranslate={el} />
        ))}
        {textData.content.split('.').map((sentence, i) => (
          // <Text key={index}>
          <Paper shadow='xs' mb='lg' p='sm'>
            <Group>
              <TextToSpeech autoplay={false} text={sentence} />
              <Flex key={i} wrap='wrap' columnGap='xs'>
                {sentence
                  .trim()
                  .split(' ')
                  .map((word, index) => (
                    <Text
                      fz='lg'
                      key={`${textData.id}-${index}`}
                      component='span'
                      onClick={() => handleWordClick(word)}
                      style={{ cursor: 'pointer' }}
                    >
                      {word}
                      {index === sentence.split(' ').length - 1 ? '.' : ''}
                    </Text>
                  ))}
              </Flex>
            </Group>
          </Paper>
          // </Text>
        ))}
      </div>
      //   </Flex>
    );
  };

  //   <Text
  //   key={`${textData.id}-${index}`}
  //   component='span'
  //   onClick={() => handleWordClick(sentence)}
  //   style={{ cursor: 'pointer' }}
  // >
  //   {word}
  // </Text>

  return (
    <Box>
      <TextInput
        value={text}
        onChange={handleTextChange}
        placeholder='Enter your text here'
      />
      <Button onClick={handleTextSubmit} mt='sm'>
        Save Text
      </Button>

      <Box mt='md'>
        {savedTexts.map((textData) => (
          <Box key={textData.id} mb='sm'>
            {renderText(textData)}
          </Box>
        ))}
      </Box>

      <Sheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <Sheet.Scroller>
              <Box p='md'>
                {/* <Text>
                  Selected word: {selectedWord?.replace(/[\\.,s$]/g, '')}
                  </Text> */}
                <SheetContent
                  word={
                    selectedWord?.replace(/[\\.,:?]/gm, '').endsWith('s')
                      ? selectedWord?.replace(/[\\.,:?]/gm, '').slice(0, -1)
                      : selectedWord?.replace(/[\\.,:?]/gm, '')
                  }
                />
              </Box>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </Box>
  );
};

export default TextUploadComponent;
