// // // // import React, { useEffect, useState } from 'react';
// // // // import {
// // // //   Card,
// // // //   Container,
// // // //   Paper,
// // // //   Progress,
// // // //   SimpleGrid,
// // // //   Text,
// // // //   Title,
// // // // } from '@mantine/core';
// // // // interface MatchingPair {
// // // //   id: number;
// // // //   question: string;
// // // //   answer: string;
// // // // }
// // // // const matchingPairs: MatchingPair[] = [
// // // //   { id: 1, question: 'Capital of France', answer: 'Paris' },
// // // //   { id: 2, question: 'Largest planet', answer: 'Jupiter' },
// // // //   { id: 3, question: 'Fastest land animal', answer: 'Cheetah' },
// // // //   { id: 4, question: 'Largest ocean', answer: 'Pacific' },
// // // //   // Add more pairs as needed
// // // // ];
// // // // const MatchingPairsQuiz: React.FC<{ onComplete: () => void }> = ({
// // // //   onComplete,
// // // // }) => {
// // // //   const [pairs, setPairs] = useState<MatchingPair[]>([]);
// // // //   const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
// // // //   const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
// // // //   const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
// // // //   const [score, setScore] = useState(0);
// // // //   useEffect(() => {
// // // //     const shuffledPairs = [...matchingPairs].sort(() => Math.random() - 0.5);
// // // //     setPairs(shuffledPairs);
// // // //   }, []);
// // // //   useEffect(() => {
// // // //     if (selectedQuestion !== null && selectedAnswer !== null) {
// // // //       const questionPair = pairs.find((pair) => pair.id === selectedQuestion);
// // // //       const answerPair = pairs.find((pair) => pair.id === selectedAnswer);
// // // //       if (questionPair && answerPair && questionPair.id === answerPair.id) {
// // // //         setMatchedPairs([...matchedPairs, questionPair.id]);
// // // //         setScore(score + 1);
// // // //         new Audio('/path/to/correct-sound.mp3').play();
// // // //       } else {
// // // //         new Audio('/path/to/incorrect-sound.mp3').play();
// // // //       }
// // // //       setTimeout(() => {
// // // //         setSelectedQuestion(null);
// // // //         setSelectedAnswer(null);
// // // //       }, 1000);
// // // //     }
// // // //   }, [selectedQuestion, selectedAnswer, pairs, matchedPairs, score]);
// // // //   useEffect(() => {
// // // //     if (matchedPairs.length === pairs.length && pairs.length > 0) {
// // // //       setTimeout(() => {
// // // //         onComplete();
// // // //       }, 1500);
// // // //     }
// // // //   }, [matchedPairs, onComplete, pairs]);
// // // //   const handleQuestionClick = (id: number) => {
// // // //     if (!matchedPairs.includes(id) && selectedAnswer === null) {
// // // //       setSelectedQuestion(id);
// // // //     }
// // // //   };
// // // //   const handleAnswerClick = (id: number) => {
// // // //     if (!matchedPairs.includes(id) && selectedQuestion !== null) {
// // // //       setSelectedAnswer(id);
// // // //     }
// // // //   };
// // // //   const renderCard = (content: string, isQuestion: boolean, id: number) => (
// // // //     <Card
// // // //       shadow='sm'
// // // //       padding='lg'
// // // //       style={{
// // // //         cursor: matchedPairs.includes(id) ? 'default' : 'pointer',
// // // //         backgroundColor: matchedPairs.includes(id)
// // // //           ? '#e6ffe6'
// // // //           : isQuestion && selectedQuestion === id
// // // //             ? '#fff0b3'
// // // //             : !isQuestion && selectedAnswer === id
// // // //               ? '#fff0b3'
// // // //               : 'white',
// // // //       }}
// // // //       onClick={() =>
// // // //         isQuestion ? handleQuestionClick(id) : handleAnswerClick(id)
// // // //       }
// // // //     >
// // // //       <Text ta='center'>{content}</Text>
// // // //     </Card>
// // // //   );
// // // //   return (
// // // //     <Container size='lg'>
// // // //       <Paper shadow='xs' p='md' mt='xl'>
// // // //         <Title order={2} mb='md'>
// // // //           Matching Pairs Quiz
// // // //         </Title>
// // // //         <Progress value={(matchedPairs.length / pairs.length) * 100} mb='md' />
// // // //         <Text mb='md'>
// // // //           Score: {score}/{pairs.length}
// // // //         </Text>
// // // //         <SimpleGrid cols={2} spacing='lg'>
// // // //           <div>
// // // //             <Text fw={700} mb='sm'>
// // // //               Questions
// // // //             </Text>
// // // //             {pairs.map((pair) => renderCard(pair.question, true, pair.id))}
// // // //           </div>
// // // //           <div>
// // // //             <Text fw={700} mb='sm'>
// // // //               Answers
// // // //             </Text>
// // // //             {pairs.map((pair) => renderCard(pair.answer, false, pair.id))}
// // // //           </div>
// // // //         </SimpleGrid>
// // // //       </Paper>
// // // //     </Container>
// // // //   );
// // // // };
// // // // export default MatchingPairsQuiz;
// // // // import { useHowler } from '@mantine/hooks';
// // // import React, { useEffect, useState } from 'react';
// // // import { Card, Grid, Text } from '@mantine/core';
// // // interface PairItem {
// // //   id: number;
// // //   content: string;
// // // }
// // // const leftItems: PairItem[] = [
// // //   { id: 1, content: 'Apple' },
// // //   { id: 2, content: 'Dog' },
// // //   { id: 3, content: 'Sun' },
// // //   { id: 4, content: 'Book' },
// // // ];
// // // const rightItems: PairItem[] = [
// // //   { id: 1, content: 'Fruit' },
// // //   { id: 2, content: 'Pet' },
// // //   { id: 3, content: 'Star' },
// // //   { id: 4, content: 'Reading' },
// // // ];
// // // type Props = {
// // //   onComplete: () => void;
// // // };
// // // const MatchingPairsGame: React.FC<Props> = () => {
// // //   const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
// // //   const [selectedRight, setSelectedRight] = useState<number | null>(null);
// // //   const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
// // //   const [score, setScore] = useState(0);
// // //   //   const correctSound = useHowler({ src: ['/sounds/correct.mp3'] });
// // //   //   const incorrectSound = useHowler({ src: ['/sounds/incorrect.mp3'] });
// // //   useEffect(() => {
// // //     if (selectedLeft !== null && selectedRight !== null) {
// // //       if (selectedLeft === selectedRight) {
// // //         setMatchedPairs([...matchedPairs, selectedLeft]);
// // //         setScore(score + 1);
// // //         // correctSound.play();
// // //       } else {
// // //         // incorrectSound.play();
// // //       }
// // //       setTimeout(() => {
// // //         setSelectedLeft(null);
// // //         setSelectedRight(null);
// // //       }, 1000);
// // //     }
// // //   }, [matchedPairs, score, selectedLeft, selectedRight]);
// // //   const handleLeftClick = (id: number) => {
// // //     if (!matchedPairs.includes(id) && selectedLeft === null) {
// // //       setSelectedLeft(id);
// // //     }
// // //   };
// // //   const handleRightClick = (id: number) => {
// // //     if (!matchedPairs.includes(id) && selectedRight === null) {
// // //       setSelectedRight(id);
// // //     }
// // //   };
// // //   const isMatched = (id: number) => matchedPairs.includes(id);
// // //   return (
// // //     <div style={{ padding: '20px' }}>
// // //       <Text size='xl' fw={700} ta='center' mb='lg'>
// // //         Matching Pairs Game
// // //       </Text>
// // //       <Grid>
// // //         <Grid.Col span={6}>
// // //           {leftItems.map((item) => (
// // //             <Card
// // //               key={item.id}
// // //               shadow='sm'
// // //               padding='lg'
// // //               radius='md'
// // //               withBorder
// // //               mb='sm'
// // //               style={{
// // //                 cursor: isMatched(item.id) ? 'default' : 'pointer',
// // //                 opacity: isMatched(item.id) ? 0.5 : 1,
// // //                 backgroundColor: selectedLeft === item.id ? '#e6f7ff' : 'white',
// // //               }}
// // //               onClick={() => handleLeftClick(item.id)}
// // //             >
// // //               <Text fw={500}>{item.content}</Text>
// // //             </Card>
// // //           ))}
// // //         </Grid.Col>
// // //         <Grid.Col span={6}>
// // //           {rightItems.map((item) => (
// // //             <Card
// // //               key={item.id}
// // //               shadow='sm'
// // //               padding='lg'
// // //               radius='md'
// // //               withBorder
// // //               mb='sm'
// // //               style={{
// // //                 cursor: isMatched(item.id) ? 'default' : 'pointer',
// // //                 opacity: isMatched(item.id) ? 0.5 : 1,
// // //                 backgroundColor:
// // //                   selectedRight === item.id ? '#e6f7ff' : 'white',
// // //               }}
// // //               onClick={() => handleRightClick(item.id)}
// // //             >
// // //               <Text fw={500}>{item.content}</Text>
// // //             </Card>
// // //           ))}
// // //         </Grid.Col>
// // //       </Grid>
// // //       <Text size='lg' fw={700} ta='center' mt='lg'>
// // //         Score: {score} / 4
// // //       </Text>
// // //       {score === 4 && (
// // //         <Text size='xl' color='green' fw={700} ta='center' mt='md'>
// // //           Congratulations! You've matched all pairs!
// // //         </Text>
// // //       )}
// // //     </div>
// // //   );
// // // };
// // // export default MatchingPairsGame;
// // // import { useHowler } from '@mantine/hooks';
// // import React, { useCallback, useEffect, useState } from 'react';
// // import { Card, Grid, Text } from '@mantine/core';
// // interface PairItem {
// //   id: number;
// //   content: string;
// // }
// // const leftItems: PairItem[] = [
// //   { id: 1, content: 'Apple' },
// //   { id: 2, content: 'Dog' },
// //   { id: 3, content: 'Sun' },
// //   { id: 4, content: 'Book' },
// // ];
// // const rightItems: PairItem[] = [
// //   { id: 1, content: 'Fruit' },
// //   { id: 2, content: 'Pet' },
// //   { id: 3, content: 'Star' },
// //   { id: 4, content: 'Reading' },
// // ];
// // const MatchingPairsGame: React.FC = () => {
// //   const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
// //   const [selectedRight, setSelectedRight] = useState<number | null>(null);
// //   const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
// //   const [score, setScore] = useState(0);
// //   //   const correctSound = useHowler({ src: ['/sounds/correct.mp3'] });
// //   //   const incorrectSound = useHowler({ src: ['/sounds/incorrect.mp3'] });
// //   const checkMatch = useCallback(() => {
// //     if (selectedLeft !== null && selectedRight !== null) {
// //       if (selectedLeft === selectedRight) {
// //         setMatchedPairs((prev) => [...prev, selectedLeft]);
// //         setScore((prev) => prev + 1);
// //         // correctSound.play();
// //       } else {
// //         // incorrectSound.play();
// //       }
// //       //   setTimeout(() => {
// //       setSelectedLeft(null);
// //       setSelectedRight(null);
// //       //   }, 1000);
// //     }
// //   }, [selectedLeft, selectedRight]);
// //   useEffect(() => {
// //     checkMatch();
// //   }, [checkMatch]);
// //   const handleLeftClick = (id: number) => {
// //     if (!matchedPairs.includes(id) && selectedLeft === null) {
// //       setSelectedLeft(id);
// //     }
// //   };
// //   const handleRightClick = (id: number) => {
// //     if (!matchedPairs.includes(id) && selectedRight === null) {
// //       setSelectedRight(id);
// //     }
// //   };
// //   const isMatched = (id: number) => matchedPairs.includes(id);
// //   return (
// //     <div style={{ padding: '20px' }}>
// //       <Text size='xl' fw={700} ta='center' mb='lg'>
// //         Matching Pairs Game
// //       </Text>
// //       <Grid>
// //         <Grid.Col span={6}>
// //           {leftItems.map((item) => (
// //             <Card
// //               key={item.id}
// //               shadow='sm'
// //               padding='lg'
// //               radius='md'
// //               withBorder
// //               mb='sm'
// //               style={{
// //                 cursor: isMatched(item.id) ? 'default' : 'pointer',
// //                 opacity: isMatched(item.id) ? 0.5 : 1,
// //                 backgroundColor: selectedLeft === item.id ? '#e6f7ff' : 'white',
// //               }}
// //               onClick={() => handleLeftClick(item.id)}
// //             >
// //               <Text fw={500}>{item.content}</Text>
// //             </Card>
// //           ))}
// //         </Grid.Col>
// //         <Grid.Col span={6}>
// //           {rightItems.map((item) => (
// //             <Card
// //               key={item.id}
// //               shadow='sm'
// //               padding='lg'
// //               radius='md'
// //               withBorder
// //               mb='sm'
// //               style={{
// //                 cursor: isMatched(item.id) ? 'default' : 'pointer',
// //                 opacity: isMatched(item.id) ? 0.5 : 1,
// //                 backgroundColor:
// //                   selectedRight === item.id ? '#e6f7ff' : 'white',
// //               }}
// //               onClick={() => handleRightClick(item.id)}
// //             >
// //               <Text fw={500}>{item.content}</Text>
// //             </Card>
// //           ))}
// //         </Grid.Col>
// //       </Grid>
// //       <Text size='lg' fw={700} ta='center' mt='lg'>
// //         Score: {score} / 4
// //       </Text>
// //       {score === 4 && (
// //         <Text size='xl' color='green' fw={700} ta='center' mt='md'>
// //           Congratulations! You've matched all pairs!
// //         </Text>
// //       )}
// //     </div>
// //   );
// // };
// // export default MatchingPairsGame;
// import React, { useState } from 'react';
// import { Card, Grid, Text } from '@mantine/core';
// // import { useHowler } from '@mantine/hooks';
// interface PairItem {
//   id: number;
//   content: string;
// }
// const leftItems: PairItem[] = [
//   { id: 1, content: 'Apple' },
//   { id: 2, content: 'Dog' },
//   { id: 3, content: 'Sun' },
//   { id: 4, content: 'Book' },
// ];
// const rightItems: PairItem[] = [
//   { id: 1, content: 'Fruit' },
//   { id: 2, content: 'Pet' },
//   { id: 3, content: 'Star' },
//   { id: 4, content: 'Reading' },
// ];
// const MatchingPairsGame: React.FC = () => {
//   const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
//   const [selectedRight, setSelectedRight] = useState<number | null>(null);
//   const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
//   const [score, setScore] = useState(0);
//   //   const correctSound = useHowler({ src: ['/sounds/correct.mp3'] });
//   //   const incorrectSound = useHowler({ src: ['/sounds/incorrect.mp3'] });
//   const handleClick = (side: 'left' | 'right', id: number) => {
//     if (matchedPairs.includes(id)) return;
//     if (side === 'left') {
//       setSelectedLeft(id);
//     } else {
//       setSelectedRight(id);
//     }
//     if (
//       (side === 'left' && selectedRight !== null) ||
//       (side === 'right' && selectedLeft !== null)
//     ) {
//       const leftId = side === 'left' ? id : selectedLeft;
//       const rightId = side === 'right' ? id : selectedRight;
//       if (leftId === rightId) {
//         setMatchedPairs((prev) => [...prev, leftId!]);
//         setScore((prev) => prev + 1);
//         // correctSound.play();
//       } else {
//         // incorrectSound.play();
//       }
//       // Reset selections after a short delay
//       setTimeout(() => {
//         setSelectedLeft(null);
//         setSelectedRight(null);
//       }, 1000);
//     }
//   };
//   const isMatched = (id: number) => matchedPairs.includes(id);
//   return (
//     <div style={{ padding: '20px' }}>
//       <Text size='xl' fw={700} ta='center' mb='lg'>
//         Matching Pairs Game
//       </Text>
//       <Grid>
//         <Grid.Col span={6}>
//           {leftItems.map((item) => (
//             <Card
//               key={item.id}
//               shadow='sm'
//               padding='lg'
//               radius='md'
//               withBorder
//               mb='sm'
//               style={{
//                 cursor: isMatched(item.id) ? 'default' : 'pointer',
//                 opacity: isMatched(item.id) ? 0.5 : 1,
//                 backgroundColor: selectedLeft === item.id ? '#e6f7ff' : 'white',
//               }}
//               onClick={() => handleClick('left', item.id)}
//             >
//               <Text fw={500}>{item.content}</Text>
//             </Card>
//           ))}
//         </Grid.Col>
//         <Grid.Col span={6}>
//           {rightItems.map((item) => (
//             <Card
//               key={item.id}
//               shadow='sm'
//               padding='lg'
//               radius='md'
//               withBorder
//               mb='sm'
//               style={{
//                 cursor: isMatched(item.id) ? 'default' : 'pointer',
//                 opacity: isMatched(item.id) ? 0.5 : 1,
//                 backgroundColor:
//                   selectedRight === item.id ? '#e6f7ff' : 'white',
//               }}
//               onClick={() => handleClick('right', item.id)}
//             >
//               <Text fw={500}>{item.content}</Text>
//             </Card>
//           ))}
//         </Grid.Col>
//       </Grid>
//       <Text size='lg' fw={700} ta='center' mt='lg'>
//         Score: {score} / 4
//       </Text>
//       {score === 4 && (
//         <Text size='xl' color='green' fw={700} ta='center' mt='md'>
//           Congratulations! You've matched all pairs!
//         </Text>
//       )}
//     </div>
//   );
// };
// export default MatchingPairsGame;
import React, { useCallback, useEffect, useState } from 'react';

import { Card, Container, Grid, Text } from '@mantine/core';

import Correct from '../../assets/sounds/correct1.wav';
import Wrong from '../../assets/sounds/wrong1.wav';
import { Wordx } from '../../types';
import { shuffleArray } from '../../utils';

// import GameCard from './Card';
// import { Howl } from 'howler';
interface CardProps {
  id: string;
  text: string;
  selected: boolean;
  onClick: (id: string) => void;
}

const GameCard: React.FC<CardProps> = ({ id, text, selected, onClick }) => {
  return (
    <Card
      shadow='sm'
      padding='lg'
      style={{
        backgroundColor: selected ? '#b2f5ea' : '#ffffff',
        cursor: 'pointer',
        marginBottom: '10px',
      }}
      onClick={() => onClick(id)}
    >
      <Text ta='center'>{text}</Text>
    </Card>
  );
};

// interface CardData {
//   id: number;
//   text: string;
// }

type Props = {
  onComplete: () => void;
  wordsData: Wordx[][];
};

const App: React.FC<Props> = ({ onComplete, wordsData }) => {
  //   const [leftCards] = useState<CardData[]>([
  //     { id: 1, text: 'Apple' },
  //     { id: 2, text: 'Banana' },
  //     { id: 3, text: 'Cherry' },
  //     { id: 4, text: 'Date' },
  //   ]);

  //   const [rightCards] = useState<CardData[]>([
  //     { id: 5, text: 'Banana' },
  //     { id: 6, text: 'Apple' },
  //     { id: 7, text: 'Date' },
  //     { id: 8, text: 'Cherry' },
  //   ]);

  const leftCards = wordsData;
  //   const rightCards = shuffleArray(wordsData);

  const [rightCards, setRightCards] = useState<Wordx[][]>();

  useEffect(() => {
    if (wordsData) {
      setRightCards(shuffleArray(wordsData));
    }
  }, [wordsData]);

  console.log(leftCards, rightCards);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matches, setMatches] = useState<{ [key: string]: string }>({});

  //   const correctSound = new Howl({ src: ['/sounds/correct.mp3'] });
  //   const incorrectSound = new Howl({ src: ['/sounds/incorrect.mp3'] });

  const handleLeftClick = (id: string) => {
    setSelectedLeft(id);
  };

  const handleRightClick = (id: string) => {
    setSelectedRight(id);
  };

  const checkMatch = useCallback(() => {
    if (selectedLeft !== null && selectedRight !== null) {
      const leftCard = leftCards.find(
        (card) => card[0].word_id === selectedLeft,
      );
      const rightCard = rightCards?.find(
        (card) => card[0].word_id === selectedRight,
      );

      if (
        leftCard &&
        rightCard &&
        leftCard[0].word_id === rightCard[0].word_id
      ) {
        setMatches({ ...matches, [selectedLeft]: selectedRight });
        const correctAudio = new Audio(Correct);
        correctAudio.play();
      } else {
        const incorrectAudio = new Audio(Wrong);
        incorrectAudio.play();
      }
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  }, [leftCards, matches, rightCards, selectedLeft, selectedRight]);

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      checkMatch();
    }
  }, [checkMatch, selectedLeft, selectedRight]);

  useEffect(() => {
    if (Object.keys(matches).length === leftCards.length) {
      onComplete();
    }
  }, [leftCards.length, matches, onComplete]);

  return (
    <Container>
      <Grid>
        <Grid.Col span={6}>
          {leftCards.map((card) => (
            <GameCard
              key={card[0].word_id}
              id={card[0].word_id}
              text={card[0].word_id.split('-')[0]}
              selected={
                selectedLeft === card[0].word_id ||
                matches[card[0].word_id] !== undefined
              }
              onClick={handleLeftClick}
            />
          ))}
        </Grid.Col>
        <Grid.Col span={6}>
          {rightCards?.map((card) => (
            <GameCard
              key={card[0].word_id}
              id={card[0].word_id}
              text={card[0].info[0].glosses}
              selected={
                selectedRight === card[0].word_id ||
                Object.values(matches).includes(card[0].word_id)
              }
              onClick={handleRightClick}
            />
          ))}
        </Grid.Col>
      </Grid>
      {/* <Button
        onClick={checkMatch}
        disabled={selectedLeft === null || selectedRight === null}
      >
        Check Match
      </Button> */}
    </Container>
  );
};

export default App;
