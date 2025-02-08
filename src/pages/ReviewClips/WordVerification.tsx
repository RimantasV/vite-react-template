import { useCallback, useEffect, useState } from 'react';

import { Button, Flex, Pagination, Tooltip } from '@mantine/core';

import { useLanguageStore } from '../../store';

type Props = {
  setWordId: (wordId: string) => void;
};

export default function WordVerification({ setWordId }: Props) {
  const { selectedLanguage } = useLanguageStore();

  const [wordVerificationStatus, setWordVerificationStatus] = useState<
    {
      word_id: string;
      occurencies_open_subtitles: number;
      verified_occurrencies: number;
    }[]
  >([]);
  const [activePage, setPage] = useState(1);

  const getBackgroundColor = (verifiedCount: number) => {
    if (verifiedCount == 0) {
      return `rgb(${200}, 100, ${100})`;
    }

    if (verifiedCount >= 10) {
      return `rgb(${0}, 255, ${0})`;
    }
    return `rgb(${240}, 255, ${240})`;
  };

  const fetchWordVerificationStatus = useCallback(async () => {
    const url = `${
      import.meta.env.VITE_BASE_URL
    }/api/words/verification?lang=${selectedLanguage?.language_id}`;

    // if (wordId) {
    //   console.log({ wordId });
    //   url += `&wordId=${wordId}`;
    // }

    const response = await fetch(url);

    const data: {
      word_id: string;
      occurencies_open_subtitles: number;
      verified_occurrencies: number;
    }[] = await response.json();

    setWordVerificationStatus(data);
  }, [selectedLanguage?.language_id]);

  useEffect(() => {
    fetchWordVerificationStatus();
  }, [fetchWordVerificationStatus]);

  return (
    <>
      <Flex justify='center'>
        <Pagination
          value={activePage}
          onChange={setPage}
          siblings={5}
          total={Math.ceil((wordVerificationStatus.length || 0) / 50)}
          mx='auto'
          my='lg'
        />
      </Flex>
      <Flex wrap='wrap' gap='md'>
        {wordVerificationStatus
          .slice(50 * (activePage - 1), 50 * activePage)
          .map((item) => (
            <Tooltip
              key={item.word_id}
              label={`${item.word_id} -  ${item.occurencies_open_subtitles} - ${item.verified_occurrencies}`}
            >
              <Button
                onClick={() => {
                  setWordId(item.word_id);
                }}
                className='w-6 h-6 cursor-pointer'
                style={{
                  // width: 16,
                  // height: 16,
                  padding: 2,
                  color: 'black',
                  backgroundColor: getBackgroundColor(
                    item.verified_occurrencies,
                  ),
                }}
              >
                {item.word_id}
              </Button>
            </Tooltip>
          ))}
      </Flex>
    </>
  );
}
