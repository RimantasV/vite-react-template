import { FC } from 'react';

import { Translation } from '../Translation';

import styles from '../SheetContent/sheetContent.module.scss';

type Props = {
  excluded: boolean;
  el: string;
  words?: [
    {
      glosses: string;
      tags?: string[];
    },
  ];
  isExpanded: boolean;
};

const WordTranslation: FC<Props> = ({ el, words, isExpanded, excluded }) => {
  return (
    <div key={el}>
      <div className={`${styles.header} ${excluded ? styles.excluded : ''}`}>
        <h1>{el?.split('-').slice(0, -1)}</h1>
        <p className='subheader'>{`(${el?.split('-').slice(-1)})`}</p>
      </div>
      <ol>
        {words &&
          words.length > 0 &&
          words
            .slice(0, isExpanded ? undefined : 2)
            .map((translation, i) => (
              <Translation
                key={i}
                translation={translation.glosses}
                isExpanded={isExpanded}
              />
            ))}
      </ol>
    </div>
  );
};

export default WordTranslation;
