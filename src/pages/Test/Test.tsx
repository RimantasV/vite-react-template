import { useEffect, useState } from 'react';
// Icons for read aloud and favorite
import {
  FaArrowRight,
  FaCheck,
  FaHeart,
  FaRegHeart,
  FaVolumeUp,
} from 'react-icons/fa';

import './test.css';

// Sample data
const wordsData = [
  {
    word: 'Hello',
    translation: 'Hola',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Replace with your video URL
    sentences: [
      {
        text: 'Hello, how are you?',
        translation: 'Hola, ¿cómo estás?',
      },
      {
        text: 'Hello, nice to meet you.',
        translation: 'Hola, encantado de conocerte.',
      },
      {
        text: 'Hello, my name is John.',
        translation: 'Hola, mi nombre es John.',
      },
    ],
  },
  {
    word: 'Goodbye',
    translation: 'Adiós',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Replace with your video URL
    sentences: [
      {
        text: 'Goodbye, see you later!',
        translation: 'Adiós, ¡hasta luego!',
      },
      {
        text: 'Goodbye, have a nice day.',
        translation: 'Adiós, que tengas un buen día.',
      },
    ],
  },
  {
    word: 'Thank you',
    translation: 'Gracias',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Replace with your video URL
    sentences: [
      {
        text: 'Thank you for your help.',
        translation: 'Gracias por tu ayuda.',
      },
      {
        text: 'Thank you very much!',
        translation: '¡Muchas gracias!',
      },
    ],
  },
];

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [learningProgress, setLearningProgress] = useState(() => {
    // Load progress from localStorage or initialize
    const savedProgress =
      JSON.parse(localStorage.getItem('learningProgress')) || {};
    return savedProgress;
  });
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [quizOptions, setQuizOptions] = useState([]);
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const currentWord = wordsData[currentIndex];

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('learningProgress', JSON.stringify(learningProgress));
  }, [learningProgress]);

  // Generate quiz options when the word changes
  useEffect(() => {
    if (
      learningProgress[currentWord.word]?.seen &&
      !learningProgress[currentWord.word]?.quizCompleted
    ) {
      generateQuizOptions();
    }
  }, [currentWord.word, learningProgress]);

  const generateQuizOptions = () => {
    const correctTranslation = currentWord.translation;
    const otherTranslations = wordsData
      .filter((word) => word.translation !== correctTranslation)
      .map((word) => word.translation)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3); // Pick 3 random incorrect translations

    const options = [...otherTranslations, correctTranslation].sort(
      () => Math.random() - 0.5,
    );
    setQuizOptions(options);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextWord = () => {
    // Mark the current word as seen when transitioning to the next word
    if (!learningProgress[currentWord.word]?.seen) {
      setLearningProgress((prev) => ({
        ...prev,
        [currentWord.word]: { ...prev[currentWord.word], seen: true },
      }));
    }

    if (currentIndex < wordsData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setUserInput('');
      setShowCorrectAnswer(false);
      setSelectedQuizOption(null);
      setIsQuizCompleted(false);
    }
  };

  const handleFinishLesson = () => {
    // Mark the last word as seen
    if (!learningProgress[currentWord.word]?.seen) {
      setLearningProgress((prev) => ({
        ...prev,
        [currentWord.word]: { ...prev[currentWord.word], seen: true },
      }));
    }

    // Show the congratulations screen
    setIsLessonCompleted(true);
  };

  const handleReadAloud = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const handleToggleFavorite = (sentence) => {
    if (favorites.includes(sentence)) {
      setFavorites(favorites.filter((fav) => fav !== sentence));
    } else {
      setFavorites([...favorites, sentence]);
    }
  };

  const handleTypingTask = () => {
    if (
      userInput.trim().toLowerCase() === currentWord.translation.toLowerCase()
    ) {
      // Correct answer
      setLearningProgress((prev) => ({
        ...prev,
        [currentWord.word]: {
          ...prev[currentWord.word],
          typingCompleted: true,
        },
      }));
      setShowCorrectAnswer(false);

      // Move to the next word or finish the lesson
      if (currentIndex === wordsData.length - 1) {
        handleFinishLesson();
      } else {
        handleNextWord();
      }
    } else {
      // Incorrect answer
      setShowCorrectAnswer(true);
    }
  };

  const handleQuizOptionClick = (option) => {
    setSelectedQuizOption(option);
    if (option === currentWord.translation) {
      // Correct answer
      setLearningProgress((prev) => ({
        ...prev,
        [currentWord.word]: { ...prev[currentWord.word], quizCompleted: true },
      }));
      setIsQuizCompleted(true);
    }
  };

  // Check if the current word has been seen before
  const isWordSeen = learningProgress[currentWord.word]?.seen;
  const isTypingCompleted = learningProgress[currentWord.word]?.typingCompleted;
  const isQuizCompletedForWord =
    learningProgress[currentWord.word]?.quizCompleted;

  const progress = ((currentIndex + 1) / wordsData.length) * 100;

  if (isLessonCompleted) {
    return (
      <div className='congratulations-screen'>
        <h1>🎉 Congratulations! 🎉</h1>
        <p>You've completed the lesson!</p>
        <button
          className='restart-button'
          onClick={() => {
            setCurrentIndex(0);
            setIsFlipped(false);
            setUserInput('');
            setShowCorrectAnswer(false);
            setIsLessonCompleted(false);
          }}
        >
          Restart Lesson
        </button>
      </div>
    );
  }

  return (
    <div className='app'>
      <h1>Language Learning App</h1>
      <div className='progress-bar'>
        <div className='progress' style={{ width: `${progress}%` }}></div>
      </div>
      <div className='content-container'>
        {isWordSeen && !isTypingCompleted && !isQuizCompletedForWord ? (
          <div className='quiz-task'>
            <h2>What is the correct translation of "{currentWord.word}"?</h2>
            <div className='quiz-options'>
              {quizOptions.map((option, index) => (
                <button
                  key={index}
                  className={`quiz-option ${
                    selectedQuizOption === option
                      ? option === currentWord.translation
                        ? 'correct'
                        : 'incorrect'
                      : ''
                  }`}
                  onClick={() => handleQuizOptionClick(option)}
                  disabled={isQuizCompleted}
                >
                  {option}
                </button>
              ))}
            </div>
            {isQuizCompleted && <p className='quiz-feedback'>Correct! 🎉</p>}
          </div>
        ) : isWordSeen && !isTypingCompleted ? (
          <div className='typing-task'>
            <h2>What is the translation of "{currentWord.word}"?</h2>
            <input
              type='text'
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder='Type the translation...'
            />
            <button onClick={handleTypingTask}>Submit</button>
            {showCorrectAnswer && (
              <p className='correct-answer'>
                Correct answer: {currentWord.translation}
              </p>
            )}
          </div>
        ) : (
          <>
            <div
              className={`flip-card ${isFlipped ? 'flipped' : ''}`}
              onClick={handleFlip}
            >
              <div className='flip-card-inner'>
                <div className='flip-card-front'>
                  <h2>{currentWord.word}</h2>
                </div>
                <div className='flip-card-back'>
                  <h2>{currentWord.translation}</h2>
                </div>
              </div>
            </div>

            <div className='video-container'>
              <iframe
                title='example-usage'
                src={currentWord.videoUrl}
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              ></iframe>
            </div>
          </>
        )}
      </div>

      {!isWordSeen || isTypingCompleted || isQuizCompletedForWord ? (
        <div className='sentences-list'>
          <h3>Example Sentences</h3>
          {currentWord.sentences.map((sentence, index) => (
            <div key={index} className='sentence-item'>
              <p>
                <strong>{sentence.text}</strong> - {sentence.translation}
              </p>
              <div className='sentence-actions'>
                <button
                  className='icon-button'
                  onClick={() => handleReadAloud(sentence.text)}
                  aria-label='Read aloud'
                >
                  <FaVolumeUp />
                </button>
                <button
                  className='icon-button'
                  onClick={() => handleToggleFavorite(sentence.text)}
                  aria-label='Toggle favorite'
                >
                  {favorites.includes(sentence.text) ? (
                    <FaHeart className='favorite' />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {currentIndex === wordsData.length - 1 ? (
        <button className='finish-button' onClick={handleFinishLesson}>
          <FaCheck /> Finish Lesson
        </button>
      ) : (
        <button className='next-button' onClick={handleNextWord}>
          <FaArrowRight /> Next Word
        </button>
      )}
    </div>
  );
}

export default App;
