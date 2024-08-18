import { Wordx, WordxMultiple } from '../../types';

export function transformToMultipleChoice(
  wordsData: Wordx[][],
): WordxMultiple[][] {
  return wordsData.map((question) => {
    const otherAnswers = wordsData
      .filter((q) => q[0].word_id !== question[0].word_id)
      .map((q) => q[0].word_id);

    // Shuffle the otherAnswers array to get random incorrect options
    const shuffledAnswers = shuffleArray(otherAnswers);

    // Take the first 3 incorrect answers
    const incorrectOptions = shuffledAnswers.slice(0, 3);

    // Combine correct answer with incorrect options
    const options = shuffleArray([question[0].word_id, ...incorrectOptions]);

    // return {
    //   id: question.id,
    //   question: question.question,
    //   options,
    //   correctAnswer: question.answer,
    // };

    return [
      {
        info: question[0].info,
        last_answer_ts: question[0].last_answer_ts,
        learning_level: question[0].learning_level,
        marked_to_exclude: question[0].marked_to_exclude,
        marked_to_learn: question[0].marked_to_learn,
        nextReviewDate: question[0].nextReviewDate,
        word_id: question[0].word_id,
        chapters: question[0].chapters,
        frequency: question[0].frequency,
        options,
      },
    ];
  });
}

// Utility function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array: string[]): string[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Example usage
export const quizQuestions = [
  {
    id: 1,
    question: 'What is the capital of France?',
    answer: 'Paris',
  },
  {
    id: 2,
    question: 'Which planet is known as the Red Planet?',
    answer: 'Mars',
  },
  {
    id: 3,
    question: 'What is the largest ocean on Earth?',
    answer: 'Pacific Ocean',
  },
  {
    id: 4,
    question: 'Who wrote "Romeo and Juliet"?',
    answer: 'William Shakespeare',
  },
];
