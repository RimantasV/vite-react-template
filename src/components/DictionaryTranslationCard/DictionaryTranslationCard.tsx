import RenderFlag from '../../pages/Quiz/RenderFlag';
import { EnglishTranslation } from '../../types';

import styles from './dictionaryTranslationCard.module.scss';

type Props = {
  wordId: string;
  englishTranslation: EnglishTranslation;
};

export default function DictionaryTranslationCard({
  englishTranslation,
  wordId,
}: Props) {
  return (
    <div className={styles.translationsCard}>
      <div className={styles.headerContainer}>
        <h2>{wordId?.split('-')[0]}</h2>
        <p>{wordId?.split('-')[1]}</p>
      </div>
      <div className={styles.languageContainer}>
        <div className={styles.flagContainer}>
          <img
            title={'us'}
            src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg`}
          />
        </div>
        <ol>
          {englishTranslation?.translation?.map((el, i) => {
            console.log({ x: el.tags });
            return (
              <li key={i}>
                <RenderFlag tags={el.tags} />
                {`${el.glosses} `}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
