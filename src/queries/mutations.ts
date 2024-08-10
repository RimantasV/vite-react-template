import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Wordsx, Wordx } from '../types';

type UpdateWordStatus = {
  word: Wordx;
  isLearning: boolean;
  isExcluded: boolean;
  id: number;
};

export const useUpdateWordStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ word, isLearning, isExcluded }: UpdateWordStatus) =>
      updateWordStatus(word, isLearning, isExcluded),

    onSuccess: (_, variables) => {
      const updateNestedState = (
        words: Wordsx,
        id: string,
        isLearning: boolean,
        isExcluded: boolean,
      ) => {
        return words.map((wordList) =>
          wordList.map((word) =>
            word.word_id === id
              ? {
                  ...word,
                  marked_to_learn: isLearning,
                  marked_to_exclude: isExcluded,
                }
              : word,
          ),
        );
      };

      queryClient.setQueryData(
        ['userCreatedListVocabulary', variables.id],
        (oldData: Wordsx) => {
          return updateNestedState(
            oldData,
            variables.word.word_id,
            variables.isLearning,
            variables.isExcluded,
          );
        },
      );
    },
  });
};

const updateWordStatus = async (
  word: Wordx,
  isLearning: boolean,
  isExcluded: boolean,
) => {
  const ENDPOINT = `${import.meta.env.VITE_BASE_URL}/api/words/progress`;
  const payload = {
    word: word.word_id,
    learningLevel: word.learning_level,
    lastAnswerTs: word.last_answer_ts,
    markedToLearn: isLearning,
    markedToExclude: isExcluded,
  };

  const response = await fetch(`${ENDPOINT}`, {
    method: 'POST',
    headers: {
      Accept: 'application.json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  // if (response.ok) {
  return await response.json();
  // return { test: 2 };
  // } else throw new Error((await response.json()).message);
};
