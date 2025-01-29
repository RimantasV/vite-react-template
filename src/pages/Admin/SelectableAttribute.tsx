type Props = {
  word: string;
  index: number;
  updateWord: (index: number, value: string) => void;
};

export default function SelectbleAttribute({ word, updateWord, index }: Props) {
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(word, 'text/xml');
  const options = htmlDoc
    .querySelector('span')
    ?.getAttribute('data-word-id')
    ?.split('_');

  const value = htmlDoc.querySelector('span')?.textContent;

  const handleOnChange = (e: React.MouseEvent<HTMLInputElement>) => {
    const element = e.target as HTMLParagraphElement;
    const newWord = `<span class="clickable" data-word-id="${element.textContent}">${value}</span>`;
    updateWord(index, newWord);
  };

  return (
    <div style={{ border: '1px dotted red', padding: '5px' }}>
      {options ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <p style={{ marginTop: 0, marginBottom: 12 }}>{value}</p>
          <div>
            {options?.map((option_) => (
              <p
                style={{
                  cursor: 'pointer',
                  marginTop: 0,
                  marginBottom: 5,
                  fontSize: 10,
                }}
                onClick={handleOnChange}
                key={option_}
              >
                {option_}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <div>{value ?? word}</div>
      )}
    </div>
  );
}
