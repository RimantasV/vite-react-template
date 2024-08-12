import { Paper, Select } from '@mantine/core';

// import { ES, US } from 'country-flag-icons/react/3x2';
// import { useState } from 'react';
import { useLanguageStore } from '../../store';
import { Languages } from '../../types';

// import styles from './languageSelect.module.scss';

const countryFlags = {
  es: { value: '🇪🇸', disabled: false },
  fr: { value: '🇫🇷 (coming soon)', disabled: true },
  de: { value: '🇩🇪 (coming soon)', disabled: false },
  se: { value: '🇸🇪 (coming soon)', disabled: true },
};

const LanguageSelect = () => {
  // const [selectedLanguage, setSelectedLanguage] = useState<string>('es');
  const { selectedLanguage, setSelectedLanguage } = useLanguageStore();

  const data = Object.entries(countryFlags).map(([value, label]) => ({
    value: value,
    label: label.value,
    disabled: label.disabled,
  }));

  return (
    <Paper visibleFrom='xs'>
      <Select
        w={75}
        // className={styles.select}
        value={selectedLanguage}
        onChange={(value) => setSelectedLanguage(value as Languages)}
        data={data}
        defaultValue='es'
        allowDeselect={false}
        //   style={(theme) => ({
        //     item: {
        //       '&[data-selected]': {
        //         '&, &:hover': {
        //           backgroundColor:
        //             theme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[1],
        //           color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        //         },
        //       },
        //     },
        //   })}
        //   itemComponent={({ value, label }) => (
        //     <div className='flex items-center'>
        //       <span className='mr-2'>{label}</span>
        //       {value === selectedLanguage && (
        //         <CheckIcon size={12} className='text-blue-500' />
        //       )}
        //     </div>
        //   )}
      />
      {/* <ES title='United States' width={40} /> */}
    </Paper>
  );
};

export default LanguageSelect;
