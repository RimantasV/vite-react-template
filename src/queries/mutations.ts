import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Languages, UserCreatedList, Wordsx, Wordx } from '../types';

type UpdateWordStatus = {
  word: Wordx;
  isLearning: boolean;
  isExcluded: boolean;
  id: number;
};

const fetchUpdateWordStatus = async (
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

export const useUpdateWordStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ word, isLearning, isExcluded }: UpdateWordStatus) =>
      fetchUpdateWordStatus(word, isLearning, isExcluded),

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

type DeleteWordFromListPayload = {
  lang: Languages;
  wordId: string;
  customItemId: string;
};

const fetchDeleteWordFromList = async (
  lang: Languages,
  wordId: string,
  customItemId: string,
) => {
  const ENDPOINT = `${import.meta.env.VITE_BASE_URL}/api/user-created-list/word?lang=${lang}`;
  const payload = {
    wordId,
    customItemId,
  };

  const response = await fetch(`${ENDPOINT}`, {
    method: 'DELETE',
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

export const useDeleteWordFromListMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lang, wordId, customItemId }: DeleteWordFromListPayload) =>
      fetchDeleteWordFromList(lang, wordId, customItemId),

    onSuccess: (_, variables) => {
      const updateNestedState = (words: Wordsx, wordId: string) => {
        return words.filter((word) =>
          word.every((word) => word.word_id !== wordId),
        );
      };

      queryClient.setQueryData(
        ['userCreatedListVocabulary', parseInt(variables.customItemId)],
        (oldData: Wordsx) => {
          return updateNestedState(oldData, variables.wordId);
        },
      );
    },
  });
};

const fetchDeleteList = async (lang: Languages, customItemId: string) => {
  const ENDPOINT = `${import.meta.env.VITE_BASE_URL}/api/user-created-lists/${customItemId}?lang=${lang}`;

  const response = await fetch(`${ENDPOINT}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application.json',
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    return await response.json();
  } else throw new Error((await response.json()).message);
};

type DeleteListPayload = {
  lang: Languages;
  customItemId: string;
};

export const useDeleteListMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lang, customItemId }: DeleteListPayload) =>
      fetchDeleteList(lang, customItemId),

    onSuccess: (_, variables) => {
      console.log('success');
      console.log(_, variables);

      queryClient.setQueryData(
        ['userCreatedLists'],
        (oldData: UserCreatedList[]) => {
          return oldData.filter(
            (el) => el.custom_item_id !== Number(variables.customItemId),
          );
        },
      );
    },
  });
};
