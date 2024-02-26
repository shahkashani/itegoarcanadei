import { AudioPlayer } from '../utils/audioPlayer';
import { useState } from 'react';

const audioPlayer = new AudioPlayer();

export function useAudioPlayer() {
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);

  const initializeAudio = async () => {
    if (isAudioInitialized) {
      return;
    }
    if (!audioPlayer.hasContext()) {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      if (!context.createGain) {
        context.createGain = context.createGainNode;
      }
      await context.resume();
      audioPlayer.setContext(context);
      setIsAudioInitialized(true);
    } else {
      setIsAudioInitialized(true);
    }
  };

  const playAudio = async (audioFile, options) => {
    await initializeAudio();
    return audioPlayer.play(audioFile, options);
  };

  const loadAudio = async (audioFile) => {
    await initializeAudio();
    return audioPlayer.load(audioFile);
  };

  return { isAudioInitialized, playAudio, loadAudio, initializeAudio };
}
