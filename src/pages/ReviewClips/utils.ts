export function getWordIdsFromSentence(sentence: string): string[] {
  const regex = /data-word-id="(.*?)"/gm;
  const matches = [...sentence.matchAll(regex)];
  return [
    ...new Set<string>(matches.map((match) => match[1].split('_')).flat()),
  ];
}
