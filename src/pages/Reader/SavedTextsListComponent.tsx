import { SavedText } from './Reader';

type Props = {
  savedTexts: SavedText[];
  onSelectText: (savedText: SavedText) => void;
};

const SavedTextsListComponent = ({ savedTexts, onSelectText }: Props) => {
  return (
    <div>
      <h2>Saved Texts</h2>
      <ul>
        {savedTexts.map((savedText) => (
          <li key={savedText.id} onClick={() => onSelectText(savedText)}>
            {savedText.text.substring(0, 50)}...
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedTextsListComponent;
