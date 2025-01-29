import { useState } from 'react';
// Icons for read aloud and favorite
import { FaHeart, FaRegHeart, FaVolumeUp } from 'react-icons/fa';

import './test.css';

// Sample data
const wordData = {
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
};

function App() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
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

  return (
    <div className='app'>
      <h1>Language Learning App</h1>
      <div className='content-container'>
        <div
          className={`flip-card ${isFlipped ? 'flipped' : ''}`}
          onClick={handleFlip}
        >
          <div className='flip-card-inner'>
            <div className='flip-card-front'>
              <h2>{wordData.word}</h2>
            </div>
            <div className='flip-card-back'>
              <h2>{wordData.translation}</h2>
            </div>
          </div>
        </div>

        <div className='video-container'>
          <iframe
            title='example-usage'
            src={wordData.videoUrl}
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className='sentences-list'>
        <h3>Example Sentences</h3>
        {wordData.sentences.map((sentence, index) => (
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
    </div>
  );
}

export default App;
