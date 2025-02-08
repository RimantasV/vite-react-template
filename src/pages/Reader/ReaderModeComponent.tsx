import { SetStateAction, useState } from 'react';

type ReaderModeComponentProps = {
  text: string;
  onBack: () => void;
};

const ReaderModeComponent = ({ text, onBack }: ReaderModeComponentProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');

  // Split text into sentences
  const sentences = text.split(/(?<=[.!?])\s+/);

  // Handle word click
  const handleWordClick = (
    word: SetStateAction<string>,
    sentence: SetStateAction<string>,
  ) => {
    setModalTitle(word);
    setModalBody(sentence);
    setModalOpen(true);
  };

  // Render text with clickable words
  const renderTextWithClickableWords = () => {
    return sentences.map((sentence, sentenceIndex) => {
      const words = sentence.split(' ');
      return (
        <pre>
          <span key={sentenceIndex}>
            {words.map((word, wordIndex) => (
              <span
                key={wordIndex}
                style={{ cursor: 'pointer', marginRight: '4px' }}
                onClick={() => handleWordClick(word, sentence)}
              >
                {word}
              </span>
            ))}
          </span>
        </pre>
      );
    });
  };

  return (
    <div>
      <h2>Reader Mode</h2>
      <button onClick={onBack}>Back to List</button>
      <div>{renderTextWithClickableWords()}</div>

      {/* Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
          }}
        >
          <h3>{modalTitle}</h3>
          <p>{modalBody}</p>
          <button onClick={() => setModalOpen(false)}>Close</button>
        </div>
      )}

      {/* Overlay for modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
        />
      )}
    </div>
  );
};

export default ReaderModeComponent;
