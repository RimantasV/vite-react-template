import { ActionIcon, Flex, Paper, Select, Text, Tooltip } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

type Props = {
  wordToTranslate: {
    source: string;
    translation: string[];
  };
};

const ImportTranslationRow: React.FC<Props> = ({ wordToTranslate }) => {
  return (
    <>
      <Paper withBorder p='sm'>
        <Flex align='center'>
          <Paper flex={1}>
            <Text fw={700}>{wordToTranslate.source}</Text>
          </Paper>
          {wordToTranslate.translation.length === 0 && (
            <Paper flex={1}>
              <Text>-</Text>
            </Paper>
          )}
          {wordToTranslate.translation.length === 1 && (
            <Paper flex={1}>
              <Text>{wordToTranslate.translation[0]}</Text>
            </Paper>
          )}
          {wordToTranslate.translation.length > 1 && (
            <Paper flex={1}>
              <Select
                placeholder='Choose a translation'
                data={wordToTranslate.translation}
                allowDeselect={false}
              />
            </Paper>
          )}
          <Flex flex={1} gap='lg' justify='center'>
            <Tooltip label='Delete word from list'>
              <ActionIcon
                onClick={() => {}}
                variant='subtle'
                color='red'
                size='lg'
                radius='xl'
                aria-label='Delete word from list'
              >
                <IconTrash
                  style={{ width: '70%', height: '70%' }}
                  stroke={1.5}
                />
              </ActionIcon>
            </Tooltip>
          </Flex>
        </Flex>
      </Paper>
    </>
  );
};

export default ImportTranslationRow;
