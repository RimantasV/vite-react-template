import { FC, useCallback, useEffect, useState } from 'react';

import { IconSpeakerphone } from '@tabler/icons-react';

import { useLanguageStore } from '../../store';

import styles from './textToSpeech.module.scss';

type Props = {
  text: string;
  autoplay: boolean;
};

const TextToSpeech: FC<Props> = ({ text, autoplay }) => {
  const { selectedLanguage } = useLanguageStore();
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance>();
  const [voice, setVoice] = useState<SpeechSynthesisVoice>();
  const synth = window.speechSynthesis;
  const voices = useCallback(() => synth.getVoices(), [synth]);
  // const [isSpeaking, setIsSpeaking] = useState(false);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setIsSpeaking(synth.speaking);
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [synth.speaking]);

  useEffect(() => {
    const u = new SpeechSynthesisUtterance(text);

    setUtterance(u);
    const voicesArr = voices().filter(
      (el) => el.lang.slice(0, 2) === selectedLanguage?.language_id,
    );
    // console.log(voices());
    // console.log(voicesArr);
    setVoice(voicesArr[voicesArr.length - 1]);

    return () => {
      synth.cancel();
    };
  }, [selectedLanguage?.language_id, synth, text, voices]);

  //   const handleVoiceChange = (event: { target: { value: string } }) => {
  //     const voices = window.speechSynthesis.getVoices();
  //     setVoice(voices.find((v) => v.name === event.target.value));
  //   };

  const handlePlay = useCallback(() => {
    if (synth.speaking) {
      synth.cancel();
    }
    if (utterance) {
      utterance.voice = voice!;
      utterance.pitch = 1; //chipt;
      utterance.rate = 1; //rate;
      utterance.volume = 1; //volume;
      synth.speak(utterance);
    }
  }, [synth, utterance, voice]);

  useEffect(() => {
    if (autoplay) {
      handlePlay();
    }
  }, [autoplay, handlePlay, text]);

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}
    >
      <IconSpeakerphone className={`${styles.icon}`} onClick={handlePlay} />
      {/* <label>
        Voice: */}
      {/* <select
        style={{ width: '50px' }}
        value={voice?.name}
        onChange={handleVoiceChange}
      >
        {window.speechSynthesis
          .getVoices()
          .filter((el) => el.lang.slice(0, 2) === 'es')
          .map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name}
            </option>
          ))}
      </select> */}
      {/* </label> */}
    </div>
  );
};

export default TextToSpeech;
