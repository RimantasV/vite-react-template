import { useCallback, useEffect, useState } from 'react';
import { Sheet } from 'react-modal-sheet';

import {
  Box,
  Button,
  ComboboxItem,
  Container,
  Fieldset,
  Flex,
  Select,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';

import { SentenceRow, SheetContent, Video } from '../../components';
import { useLanguageStore } from '../../store';
import { DictionaryRecord, SentenceObj } from '../../types';
import { checkHTML } from '../../utils';
import SelectbleAttribute from './SelectableAttribute';

type Props = {
  acceptSentence: (
    sentenceId: string,
    reasonId: number | null,
    sentenceHtml: string,
    sentenceEnSemantic: string,
    sentenceEnLiteral: string,
  ) => Promise<void>;
  rejectSentence: (sentenceId: string, reasonId: number) => Promise<void>;
  sentence: SentenceObj;
};

export default function Sentence({
  acceptSentence,
  rejectSentence,
  sentence,
}: Props) {
  const { selectedLanguage } = useLanguageStore();
  const [value, setValue] = useState<ComboboxItem>({
    value: '1',
    label: 'N/a',
  });
  const [sentenceHtml, setSentenceHtml] = useState(sentence.sentence_html);
  const [words, setWords] = useState(
    sentenceHtml.split(/(<span class=".+?" data-word-id=".+?">.+?<\/span>)/g),
  );
  const [translationHuman, setTranslationHuman] = useState(
    sentence.sentence_en_semantic,
  );
  const [translationMachine, setTranslationMachine] = useState(
    sentence.sentence_en_literal,
  );

  const [isOpen, setOpen] = useState(false);
  const [activeWords, setActiveWords] = useState<string[]>();
  const [activeForm, setActiveForm] = useState<string>();
  const [isExpanded, setIsExpanded] = useState(false);
  const [dictionaryRecord, setDictionaryRecord] = useState<DictionaryRecord[]>(
    [],
  );
  const [textAreaSelectionStart, setTextAreaSelectionStart] = useState(0);
  const [textAreaSelectionEnd, setTextAreaSelectionEnd] = useState(0);

  useEffect(() => {
    setWords(
      sentenceHtml.split(/(<span class=".+?" data-word-id=".+?">.+?<\/span>)/g),
    );
  }, [sentenceHtml]);

  useEffect(() => {
    setSentenceHtml(words.join(''));
  }, [words]);

  const handleDeeplTranslate = async (sentence: string) => {
    const deeplUrl = `https://api-free.deepl.com/v2/translate?auth_key=${
      import.meta.env.VITE_DEEPL_API_KEY
    }&text=${sentence}&source_lang=${selectedLanguage?.language_id.toUpperCase()}&target_lang=EN`;

    const response = await fetch(deeplUrl);

    const data: { translations: { text: string }[] } = await response.json();

    setTranslationMachine(data.translations[0].text);
  };

  const updateWord = (index: number, value: string) => {
    const newValue = [
      ...words.slice(0, index),
      value,
      ...words.slice(index + 1),
    ];
    setWords(newValue);
  };

  const handleReset = () => {
    setSentenceHtml(sentence.sentence_html);
    setWords(
      sentence.sentence_html.split(
        /(<span class=".+?" data-word-id=".+?">.+?<\/span>)/g,
      ),
    );
    setTranslationHuman(sentence.sentence_en_semantic);
    setTranslationMachine(sentence.sentence_en_literal);
  };

  const handleAccept = () => {
    acceptSentence(
      sentence.sentence_id,
      null,
      words.join(''),
      translationHuman,
      translationMachine,
    );
  };

  const handleReject = () => {
    rejectSentence(sentence.sentence_id, +value.value);
  };

  const handleOnChangeTranslationHuman = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTranslationHuman(e.target.value);
  };

  const handleOnChangeTranslationMachine = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTranslationMachine(e.target.value);
  };

  const handleOnChangeHtml = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSentenceHtml(e.target.value);
  };

  const handleWrapWord = () => {
    const word = sentenceHtml.slice(
      textAreaSelectionStart,
      textAreaSelectionEnd,
    );
    const newWord = `<span class="clickable" data-word-id="${word}-xxx">${word}</span>`;
    const newSentenceHtml =
      sentenceHtml.slice(0, textAreaSelectionStart) +
      newWord +
      sentenceHtml.slice(textAreaSelectionEnd);
    setSentenceHtml(newSentenceHtml);
    // setWords(newSentenceHtml.split(/(<span class=".+?" data-word-id=".+?">.+?<\/span>)/g));
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

  const handleWordClick: React.MouseEventHandler<HTMLParagraphElement> = (
    e,
  ) => {
    const target = e.target as HTMLParagraphElement;

    if (!target.classList.contains('clickable')) return;

    let wordId = target.dataset.wordId;
    console.log(wordId);
    let wordIdArray: string[] = [];
    if (wordId) {
      wordId = wordId.replace('prep_phrase', 'prep***phrase');
      wordIdArray = wordId?.split('_');
      wordIdArray = [...wordIdArray.map((el) => el.replace('***', '_'))];
    }

    if (wordId) {
      setActiveForm(target.textContent!);
      setActiveWords(wordIdArray);
      setOpen(true);
      fetchEng(wordIdArray);
    }
  };

  console.log(sentence.sentence_id);

  return (
    <>
      <Title mb='md' ta='center'>
        {sentence.title}
      </Title>
      <Flex justify='center'>
        <Box mb='md' miw={'50%'} maw={600}>
          <Video examples={[sentence]} />
        </Box>
      </Flex>
      <Box mb='md'>
        <SentenceRow handleWordClick={handleWordClick} sentenceObj={sentence} />
      </Box>

      <Fieldset legend='Personal information' variant='filled'>
        <Text mb='md'>
          {sentence.sentence_start_time} - {sentence.sentence_end_time}
        </Text>
        <Flex mb='md' align='center'>
          <Box
            w={10}
            h={10}
            bg={checkHTML(sentenceHtml) ? 'green' : 'red'}
            style={{ borderRadius: '50%' }}
          ></Box>
          <Text
            ml='md'
            className='xxx'
            dangerouslySetInnerHTML={{ __html: sentenceHtml }}
          ></Text>
        </Flex>

        <Textarea
          mb='md'
          rows={5}
          label='HTML'
          value={sentenceHtml}
          onChange={handleOnChangeHtml}
          onSelect={(e) => {
            const target = e.target as HTMLTextAreaElement;
            setTextAreaSelectionStart(target.selectionStart);
            setTextAreaSelectionEnd(target.selectionEnd);
            console.log(
              sentenceHtml.slice(target.selectionStart, target.selectionEnd),
            );
          }}
        />
        {textAreaSelectionStart !== textAreaSelectionEnd &&
          (textAreaSelectionStart || textAreaSelectionEnd) && (
            <Button onClick={handleWrapWord}>
              Wrap Selected Text into span
            </Button>
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

        <TextInput
          mb='md'
          label='Translation (human)'
          value={translationHuman}
          onChange={handleOnChangeTranslationHuman}
        />

        <Flex align={'center'}>
          <Button
            mr={'md'}
            onClick={() => handleDeeplTranslate(sentence.sentence_original)}
          >
            Translate with Deepl
          </Button>

          <TextInput
            flex={1}
            mb='md'
            label='Translation (machine)'
            value={translationMachine}
            onChange={handleOnChangeTranslationMachine}
          />
        </Flex>

        <Button mb='md' variant='light' onClick={handleReset}>
          Reset
        </Button>
      </Fieldset>

      <Container my='md'>
        <Flex justify='center'>
          <Flex p='xs' w={600} gap='lg' justify='space-between' align='center'>
            <Button onClick={handleAccept}>Accept</Button>
            <Flex align='center' justify='center'>
              <Button
                onClick={handleReject}
                mr='md'
                variant='filled'
                color='red'
              >
                Reject
              </Button>
              <Select
                placeholder='Select a reason for rejection'
                value={value ? value.value : null}
                onChange={(_value, option) => setValue(option)}
                data={[
                  { value: '1', label: 'N/a' },
                  { value: '2', label: 'Too short' },
                  { value: '3', label: 'Too long' },
                  { value: '4', label: 'Need to revise vocabulary' },
                ]}
              />
            </Flex>
          </Flex>
        </Flex>
      </Container>
      <Sheet
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        detent='content-height'
        onCloseEnd={() => {
          setIsExpanded(false);
        }}
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <SheetContent
              activeWords={activeWords}
              activeForm={activeForm!}
              dictionaryRecord={dictionaryRecord}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
              setOpen={setOpen}
            />
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop
          onTap={() => {
            setOpen(false);
          }}
        />
      </Sheet>
    </>
  );
}
