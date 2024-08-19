import React, { useState } from 'react';
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

import { TextToSpeech } from '../TextToSpeech';
import { SheetContent } from './SheetContent';

interface TextData {
  id: string;
  content: string;
}

const TextUploadComponent: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [savedTexts, setSavedTexts] = useState<TextData[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

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
      textData.content.split('.').map((sentence, i) => (
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
      ))
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
