import { useQuery } from '@tanstack/react-query';
import {
  DataMovies,
  Resource,
  SentenceObj,
  UserCreatedList,
  Wordx,
} from '../types';
import { getNextReviewDate } from '../utils';

const ENDPOINT = `${import.meta.env.VITE_BASE_URL}/api/user-created-lists`;

// const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const fetchUserCreatedLists = async (): Promise<UserCreatedList[]> => {
  // await sleep(5000);
  const response = await fetch(ENDPOINT);
  if (response.ok) {
    return await response.json();
  } else throw new Error((await response.json()).message);
};

export const useUserCreatedListsQuery = () =>
  useQuery({
    queryKey: ['userCreatedLists'],
    queryFn: fetchUserCreatedLists,
  });

const fetchResources = async (): Promise<Resource[]> => {
  const ENDPOINT =
    import.meta.env.VITE_ENVIRONMENT === 'TEST'
      ? '/resources.json'
      : `${import.meta.env.VITE_BASE_URL}/api/resources`;
  const response = await fetch(ENDPOINT);
  if (response.ok) {
    const data: Resource[] = await response.json();
    return data.filter((el) => el.is_following);
  } else throw new Error((await response.json()).message);
};

export const useResourcesQuery = () =>
  useQuery({
    queryKey: ['resources'],
    queryFn: fetchResources,
  });

const fetchUserCreatedListVocabulary = async (key: number) => {
  const ENDPOINT = `${
    import.meta.env.VITE_BASE_URL
  }/api/vocabulary-translation/lists/${key}`;

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
          !Object.prototype.hasOwnProperty.call(obj, item.word.split('-')[0])
        ) {
          // for movie lists where one word can have several parts of speech
          // obj[item.word.split('-')[0]] = [item];
          obj[item.word] = [item];
        } else {
          // for movie lists where one word can have several parts of speech
          // obj[item.word.split('-')[0]] = [...obj[item.word.split('-')[0]], item];
          obj[item.word] = [...obj[item.word.split('-')[0]], item];
        }

        return obj;
      }, {})
    );
  } else throw new Error((await response.json()).message);
};

export const useUserCreatedListVocabularyQuery = (key: number) =>
  useQuery({
    queryKey: ['userCreatedListVocabulary'],
    queryFn: () => fetchUserCreatedListVocabulary(key),
  });

const fetchMovieVocabulary = async (key: string) => {
  const ENDPOINT = `${
    import.meta.env.VITE_BASE_URL
  }/api/vocabulary-translation/movies/${key}`;

  const response = await fetch(ENDPOINT);

  if (response.ok) {
    let data: DataMovies = await response.json();
    data = data.filter((el) => !el.marked_to_exclude);
    data = data.map((el) => ({
      ...el,
      nextReviewDate: getNextReviewDate(el.learning_level, el.last_answer_ts),
    }));

    return Object.values(
      data.reduce(function (obj: { [x: string]: any }, item: { word: string }) {
        if (
          !Object.prototype.hasOwnProperty.call(obj, item.word.split('-')[0])
        ) {
          obj[item.word.split('-')[0]] = [item];
        } else {
          obj[item.word.split('-')[0]] = [
            ...obj[item.word.split('-')[0]],
            item,
          ];
        }

        return obj;
      }, {})
    );
  } else throw new Error((await response.json()).message);
};

export const useMovieVocabularyQuery = (key: string) =>
  useQuery({
    queryKey: ['movieVocabulary'],
    queryFn: () => fetchMovieVocabulary(key),
  });

const fetchSubtitles = async (type: string, key: string) => {
  const ENDPOINT = `${
    import.meta.env.VITE_BASE_URL
  }/api/resource?type=${type}&key=${key}`;

  const response = await fetch(ENDPOINT);
  if (response.ok) {
    const data: SentenceObj[] = await response.json();
    data.sort((a, b) => a.id - b.id);
    return data;
  } else throw new Error((await response.json()).message);
};

export const useSubtitlesQuery = (type: string, key: string) =>
  useQuery({
    queryKey: ['subtitles'],
    queryFn: () => fetchSubtitles(type, key),
  });

const toggleFollow = async (
  resource: string,
  key: string,
  chapter_or_episode: string,
  setFollowing: any
) => {
  const ENDPOINT = `${import.meta.env.VITE_BASE_URL}/api/lists`;

  const payload = {
    resource,
    key,
    chapter_or_episode,
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
    setFollowing((prevState: any) => !prevState);
  } else throw new Error((await response.json()).message);
};

export const usetoggleFollowQuery = (
  resource: string,
  key: string,
  chapter_or_episode: string,
  setFollowing: any
) =>
  useQuery({
    queryKey: ['toggleFollow'],
    queryFn: () =>
      toggleFollow(resource, key, chapter_or_episode, setFollowing),
    enabled: false,
  });

const fetchResourceStatus = async (id: string) => {
  const ENDPOINT = `${import.meta.env.VITE_BASE_URL}/api/resources/${id}`;
  const response = await fetch(ENDPOINT);
  if (response.ok) {
    const data = await response.json();
    return data[0].is_following;
  } else throw new Error((await response.json()).message);
};

export const useResourceStatusQuery = (id: string) =>
  useQuery({
    queryKey: ['resourceStatus'],
    queryFn: () => fetchResourceStatus(id),
  });
