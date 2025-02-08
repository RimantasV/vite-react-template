import { useState } from 'react';

import { SavedText } from './Reader';

type Props = {
  onSave: (savedText: SavedText) => void;
};

const TextInputComponent = ({ onSave }: Props) => {
  const [text, setText] = useState('');

  const handleSave = () => {
    if (text.trim()) {
      const id = Date.now().toString();
      const savedText = { id, text };
      onSave(savedText);
      setText('');
    }
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Write or paste your text here...'
      />
      <button onClick={handleSave}>Save Text</button>
    </div>
  );
};

export default TextInputComponent;
