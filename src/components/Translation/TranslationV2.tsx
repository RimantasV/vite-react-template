import { FC } from 'react';

type Props = {
  translation: string;
  isExpanded: boolean;
};

const Translation: FC<Props> = ({ translation, isExpanded }) => {
  function removeTextInBrackets(input: string): string {
    // Regular expression to match text within brackets at the end of the string
    const regex = /\s*\([^)]*\)\s*$/;

    // Replace the matched text with an empty string
    return input.replace(regex, '');
  }

  const translationToRender = isExpanded
    ? translation
    : removeTextInBrackets(translation);

  return <li>{translationToRender}</li>;
};

export default Translation;
