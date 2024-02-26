import { getDialogId } from '../../../utils/getDialogId';

const generateAudio = (character, text, pronunciations) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await fetch('/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          character,
          text,
          pronunciations,
        }),
      });
      if (!result.ok) {
        return reject(result);
      }
      const { file } = await result.json();
      resolve(file);
    } catch (err) {
      reject(err);
    }
  });
};

export const playLine = async (
  config,
  delay,
  onDone,
  playAudioOptions = {},
  isGenerateAudio = true
) => {
  const {
    character,
    text,
    pronunciations,
    additionalAudio,
    additionalAudioVolume,
    playAudio,
  } = config;
  const id = getDialogId(config);

  if (additionalAudio) {
    try {
      const playOptions = additionalAudioVolume
        ? { ...playAudioOptions, volume: additionalAudioVolume }
        : playAudioOptions;
      playAudio(additionalAudio, playOptions);
    } catch (err) {
      // Not important, just fail silently
    }
  }
  try {
    await playAudio(`/dialog/${id}.mp3`, playAudioOptions);
    onDone();
  } catch (err) {
    try {
      if (!isGenerateAudio) {
        return setTimeout(() => onDone(), delay);
      }
      const file = await generateAudio(character, text, pronunciations);
      try {
        await playAudio(file, playAudioOptions);
        onDone();
      } catch (err) {
        return setTimeout(() => onDone(), delay);
      }
    } catch (err) {
      return setTimeout(() => onDone(), delay);
    }
  }
};
