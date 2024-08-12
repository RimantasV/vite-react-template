export type Book = { chapter: string; body: string[] }[];

export type EnglishTranslation = {
  forms: [
    {
      form: string;
      tags: string[];
    },
  ];
  translation: [
    {
      glosses: string;
      tags?: string[];
    },
  ];
};

export type DictionaryRecord = {
  word_id: string;
  info: EnglishTranslation;
};

export type Words = {
  word_id: string;
  chapters: string[];
  frequency: number;
  info: { tags: string[]; glosses: string }[];
  learning_level: number;
  last_answer_ts: Date;
  marked_to_learn: boolean;
  marked_to_exclude: boolean;
  nextReviewDate: string | null;
}[][];

export type Wordx = {
  word_id: string;
  chapters: string[];
  frequency: number;
  info: { tags: string[]; glosses: string }[];
  learning_level: number;
  last_answer_ts: Date;
  marked_to_learn: boolean;
  marked_to_exclude: boolean;
  nextReviewDate: string | null;
};

export type WordObjectx = Record<string, Wordx[]>;

export type Wordsx = Wordx[][];

export type Data = {
  list_id: number;
  word_id: string;
  info: { tags: string[]; glosses: string }[];
  learning_level: number;
  last_answer_ts: Date;
  marked_to_learn: boolean;
  marked_to_exclude: boolean;
  nextReviewDate: string | null;
}[];

export type DataMovies = {
  word_id: string;
  chapters: string[];
  frequency: number;
  info: { tags: string[]; glosses: string }[];
  learning_level: number;
  last_answer_ts: Date;
  marked_to_learn: boolean;
  marked_to_exclude: boolean;
  nextReviewDate: string | null;
}[];

export type Word = {
  word: string;
  chapters?: string[];
  frequency?: number;
  info?: { tags: string[]; glosses: string }[];
  learning_level: number;
  last_answer_ts: Date;
  marked_to_learn: boolean;
  marked_to_exclude: boolean;
};

type Details = {
  imdbLink: string;
  netflixLink: string;
  countryOfOrigin: string[];
  genres: string[];
  originalTitle: string;
  year: string;
  englishTitle: string;
  imageLink: string;
};

export type Resource = {
  media_item_id: string;
  media_type: string;
  title: string;
  segment_title: string;
  details: Details;
  is_following: boolean;
};

export type UserCreatedList = {
  custom_item_id: number;
  title: string;
};

export enum QUIZ_STEPS {
  SETTINGS = 'settings',
  PROGRESS = 'progress',
  SUMMARY = 'summary',
}

export enum TRANSLATION_STATUS {
  HIDDEN = 'hidden',
  VISIBLE = 'visible',
}

export type SentenceObj = {
  chapter_or_episode: string;
  created_at: Date;
  id: number;
  key: string;
  resource: string;
  sentence: string;
  sentence_en_literal: string;
  sentence_en_semantic: string;
  sentence_html: string;
  word_ids: string[];
};

export type SentencesRespose = {
  id: number;
  sentence_id: string;
  media_item_id: string;
  sentence_original: string;
  sentence_html: string;
  sentence_en_semantic: string;
  sentence_en_literal: string;
  sentence_index: number;
  sentence_timestamps: {
    endTime: string;
    startTime: string;
  };
  word_ids: string[];
  is_verified: boolean;
  created_at: Date;
  sentence_start_time: string;
  sentence_end_time: string;
}[];

export enum Languages {
  es = 'es',
  de = 'de',
}
