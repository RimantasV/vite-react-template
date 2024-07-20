export function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export const getCountryCode = (el: string[]) => {
  const country = el[0];

  switch (country) {
    case 'Argentina':
      return 'AR';
    case 'Mexico':
      return 'MX';
    case 'Costa-Rica':
      return 'CR';
    case 'Spain':
      return 'ES';

    default:
      return '';
  }
};

//0 - 6 hours
//1 - 1 day
//2 - 3 days
//3 - 7 days
//4 - 3 weeks
//5 - 6 weeks

export const getNextReviewDate = (learningLevel: number, lastReview: Date) => {
  if (learningLevel === 0) {
    return new Date(
      new Date(lastReview).getTime() + 6 * 60 * 60 * 1000
    ).toISOString();
  }

  if (!learningLevel) {
    return null;
  }

  if (learningLevel === 1) {
    return new Date(
      new Date(lastReview).getTime() + 1 * 24 * 60 * 60 * 1000
    ).toISOString();
  }
  if (learningLevel === 2) {
    return new Date(
      new Date(lastReview).getTime() + 3 * 24 * 60 * 60 * 1000
    ).toISOString();
  }
  if (learningLevel === 3) {
    return new Date(
      new Date(lastReview).getTime() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();
  }
  if (learningLevel === 4) {
    return new Date(
      new Date(lastReview).getTime() + 21 * 24 * 60 * 60 * 1000
    ).toISOString();
  }
  if (learningLevel === 5) {
    return new Date(
      new Date(lastReview).getTime() + 42 * 24 * 60 * 60 * 1000
    ).toISOString();
  }
  return null;
};

export const getDisplayDate = (nextReviewDate: string | null) => {
  if (!nextReviewDate) return '-';

  // date1 - date2 / 36e5

  if (new Date(nextReviewDate).getTime() - new Date().getTime() < 0) {
    return `now`;
  }

  if ((new Date(nextReviewDate).getTime() - new Date().getTime()) / 36e5 < 1) {
    return ` < 1 hour`;
  }

  if ((new Date(nextReviewDate).getTime() - new Date().getTime()) / 36e5 < 24) {
    return `${Math.floor(
      (new Date(nextReviewDate).getTime() - new Date().getTime()) / 36e5
    )} hours`;
  }

  if (
    (new Date(nextReviewDate).getTime() - new Date().getTime()) / 36e5 <
    168
  ) {
    return `${Math.floor(
      (new Date(nextReviewDate).getTime() - new Date().getTime()) / 36e5 / 24
    )} days`;
  }

  return `${Math.floor(
    (new Date(nextReviewDate).getTime() - new Date().getTime()) / 36e5 / 24 / 7
  )} weeks`;
};

interface TimeData {
  endTime: Date;
  startTime: Date;
}

export function calculateTimeDifference(data: TimeData): number {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);

  // Extract time parts
  const startTimeInSeconds =
    start.getHours() * 3600 +
    start.getMinutes() * 60 +
    start.getSeconds() +
    start.getMilliseconds() / 1000;
  const endTimeInSeconds =
    end.getHours() * 3600 +
    end.getMinutes() * 60 +
    end.getSeconds() +
    end.getMilliseconds() / 1000;

  // Calculate the difference
  const differenceInSeconds = endTimeInSeconds - startTimeInSeconds;

  return differenceInSeconds;
}
