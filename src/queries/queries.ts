import { SetStateAction } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
  DataMovies,
  Languages,
  Resource,
  SentenceObj,
  UserCreatedList,
  Wordx,
} from '../types';
import { getNextReviewDate } from '../utils';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const fetchUserCreatedLists = async (
  lang: Languages,
): Promise<UserCreatedList[]> => {
  // await sleep(5000);
  const ENDPOINT = `${
    import.meta.env.VITE_BASE_URL
  }/api/user-created-lists?lang=${lang}`;
  const response = await fetch(ENDPOINT);
  if (response.ok) {
    return await response.json();
  } else throw new Error((await response.json()).message);
};

export const useUserCreatedListsQuery = (lang: Languages) =>
  useQuery({
    queryKey: ['userCreatedLists'],
    queryFn: () => fetchUserCreatedLists(lang),
  });

const fetchResources = async (lang: Languages): Promise<Resource[]> => {
  const ENDPOINT =
    import.meta.env.VITE_ENVIRONMENT === 'TEST'
      ? '/resources.json'
      : `${import.meta.env.VITE_BASE_URL}/api/resources?lang=${lang}`;
  const response = await fetch(ENDPOINT);
  if (response.ok) {
    const data: Resource[] = await response.json();
    return data.filter((el) => el.is_following);
  } else throw new Error((await response.json()).message);
};

export const useResourcesQuery = (lang: Languages) =>
  useQuery({
    queryKey: ['resources'],
    queryFn: () => fetchResources(lang),
  });

const fetchUserCreatedListVocabulary = async (lang: Languages, id: number) => {
  const ENDPOINT = `${
    import.meta.env.VITE_BASE_URL
  }/api/vocabulary-translation/lists/${id}?lang=${lang}`;
  await sleep(2000);
  const response = await fetch(ENDPOINT);

  if (response.ok) {
    let data: Wordx[] = await response.json();
    data = data.filter((el) => !el.marked_to_exclude);

    data = data.map((el) => ({
      ...el,
      nextReviewDate: getNextReviewDate(el.learning_level, el.last_answer_ts),
    }));

    return Object.values(
      data.reduce(function (obj: { [x: string]: Wordx[] }, item: Wordx) {
        if (
          !Object.prototype.hasOwnProperty.call(obj, item.word_id.split('-')[0])
        ) {
          // for movie lists where one word can have several parts of speech
          // obj[item.word_id.split('-')[0]] = [item];
          obj[item.word_id] = [item];
        } else {
          // for movie lists where one word can have several parts of speech
          // obj[item.word_id.split('-')[0]] = [...obj[item.word_id.split('-')[0]], item];
          obj[item.word_id] = [...obj[item.word_id.split('-')[0]], item];
        }

        return obj;
      }, {}),
    );
  } else throw new Error((await response.json()).message);
};

export const useUserCreatedListVocabularyQuery = (
  lang: Languages,
  id: number,
) =>
  useQuery({
    queryKey: ['userCreatedListVocabulary', id],
    queryFn: () => fetchUserCreatedListVocabulary(lang, id),
  });

const fetchMovieVocabulary = async (
  // resource: string,
  // key: string,
  // chapter_or_episode: string
  lang: Languages,
  mediaItemId: string,
) => {
  const ENDPOINT = `${
    import.meta.env.VITE_BASE_URL
  }/api/vocabulary-translation/movies/?lang=${lang}&media-item-id=${mediaItemId}`;

  const response = await fetch(ENDPOINT);

  if (response.ok) {
    let data: DataMovies = await response.json();
    data = data.filter((el) => !el.marked_to_exclude);
    data = data.map((el) => ({
      ...el,
      nextReviewDate: getNextReviewDate(el.learning_level, el.last_answer_ts),
    }));

    return Object.values(
      data.reduce(function (obj: { [x: string]: Wordx[] }, item: Wordx) {
        if (
          !Object.prototype.hasOwnProperty.call(obj, item.word_id.split('-')[0])
        ) {
          obj[item.word_id.split('-')[0]] = [item];
        } else {
          obj[item.word_id.split('-')[0]] = [
            ...obj[item.word_id.split('-')[0]],
            item,
          ];
        }

        return obj;
      }, {}),
    );
  } else throw new Error((await response.json()).message);
};

export const useMovieVocabularyQuery = (
  // resource: string,
  // key: string,
  // chapter_or_episode: string
  lang: Languages,
  mediaItemId: string,
) =>
  useQuery({
    queryKey: ['movieVocabulary'],
    queryFn: () => fetchMovieVocabulary(lang, mediaItemId),
  });

const fetchSubtitles = async (lang: Languages, mediaItemId: string) => {
  const ENDPOINT = `${
    import.meta.env.VITE_BASE_URL
  }/api/resource?lang=${lang}&media-item-id=${mediaItemId}`;

  const response = await fetch(ENDPOINT);
  if (response.ok) {
    const data: SentenceObj[] = await response.json();
    data.sort((a, b) => a.id - b.id);
    return data;
  } else throw new Error((await response.json()).message);
};

export const useSubtitlesQuery = (lang: Languages, mediaItemId: string) =>
  useQuery({
    queryKey: ['subtitles'],
    queryFn: () => fetchSubtitles(lang, mediaItemId),
  });

const toggleFollow = async (
  lang: Languages,
  mediaItemId: string,
  setFollowing: (arg0: (prevState: boolean) => boolean) => void,
) => {
  const ENDPOINT = `${import.meta.env.VITE_BASE_URL}/api/lists?lang=${lang}`;

  const payload = {
    mediaItemId,
  };

  const response = await fetch(`${ENDPOINT}`, {
    method: 'POST',
    headers: {
      Accept: 'application.json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    setFollowing((prevState: boolean) => !prevState);
  } else throw new Error((await response.json()).message);
};

export const useToggleFollowQuery = (
  lang: Languages,
  mediaItemId: string,
  setFollowing: {
    (value: SetStateAction<boolean>): void;
    (value: SetStateAction<boolean>): void;
    (arg0: (prevState: boolean) => boolean): void;
  },
) =>
  useQuery({
    queryKey: ['toggleFollow'],
    queryFn: () => toggleFollow(lang, mediaItemId, setFollowing),
    enabled: false,
  });

const fetchResourceStatus = async (lang: Languages, id: string) => {
  const ENDPOINT = `${
    import.meta.env.VITE_BASE_URL
  }/api/resources/${id}?lang=${lang}`;
  const response = await fetch(ENDPOINT);
  if (response.ok) {
    const data = await response.json();
    return data[0].is_following;
  } else throw new Error((await response.json()).message);
};

export const useResourceStatusQuery = (lang: Languages, id: string) =>
  useQuery({
    queryKey: ['resourceStatus'],
    queryFn: () => fetchResourceStatus(lang, id),
  });
