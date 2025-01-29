import { useState } from 'react';
// Icons for read aloud and favorite
import { FaArrowRight, FaHeart, FaRegHeart, FaVolumeUp } from 'react-icons/fa';

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

  const currentWord = wordsData[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextWord = () => {
    if (currentIndex < wordsData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false); // Reset flip state for the next word
    }
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

  const progress = ((currentIndex + 1) / wordsData.length) * 100;

  return (
    <div className='app'>
      <h1>Language Learning App</h1>
      <div className='progress-bar'>
        <div className='progress' style={{ width: `${progress}%` }}></div>
      </div>
      <div className='content-container'>
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
      </div>

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

      <button
        className='next-button'
        onClick={handleNextWord}
        disabled={currentIndex === wordsData.length - 1}
      >
        <FaArrowRight /> Next Word
      </button>
    </div>
  );
}

export default App;
