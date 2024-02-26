import {
  FadeOut,
  FullPageImage,
  useAudioPlayer,
  LanguageContext,
  useLanguage,
  GodSettings,
} from '@itegoarcanadei/client-shared';
import styled, { css, keyframes } from 'styled-components';
import { useEffect, useState } from 'react';

import { HotKeys } from 'react-hotkeys';
import { Seed } from '../../components/Seed';

const PASSWORD_MAX_LENGTH = 20;
const PAGE_FADE = 1500;

const keyMap = {
  PLAY_A: ['a', 'A', '1'],
  PLAY_B: ['b', 'B', '2'],
  PLAY_C: ['c', 'C', '3'],
  PLAY_D: ['d', 'D', '4'],
  PLAY_E: ['e', 'E', '5'],
};

const timers = {};

const fade = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const Form = styled.form`
  position: relative;
  z-index: 1;
`;

const PlaySong = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 50px;
  animation: ${fade} 3s 3s ease-in-out both;

  button {
    background: #1a1613;
    border: none;
    border-radius: 5px;
    outline: none;
    cursor: pointer;
    padding: 8px 10px;
    color: #ccb390;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 40px;
  text-align: center;

  *:focus {
    outline: 0;
  }

  @media (max-width: 720px) {
    padding: 20px;
  }

  @media (max-width: 200px) {
    padding: 0;
  }

  ${({ $isEnglish }) =>
    $isEnglish &&
    css`
      font-family: 'Adrogue';
    `};
`;

const drift = keyframes`
  0% {
    opacity: 0.5;
    transform: translateY(1vh);
  }

  30% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateY(-20vh);
  }
`;

const getImageCss = (image, width, height) => css`
  content: '';
  display: block;
  padding-bottom: ${`${(height / width) * 100}%`};
  background: url(${image}) no-repeat;
  background-size: 100% 100%;
`;

const Deus = styled.div`
  width: 400px;
  position: relative;
  margin: 0 auto;

  @media (max-width: 720px) {
    width: 100%;
    max-width: 400px;
    min-width: 100px;
  }
`;

const Machina = styled.div`
  width: 45%;
  margin: 0 auto;
  transition: filter 1000ms ease-in-out;
  animation: ${fade} 8.5s 1s both;

  &:after {
    ${getImageCss('/machina.png', 800, 1408)}
  }

  filter: ${({ $isLit }) => ($isLit ? 'sepia(0)' : 'sepia(0.8)')};
`;

const Key = styled.button`
  padding: 0;
  margin: 0;
  background: none;
  border: 0;
  position: absolute;
  transition: all 1000ms ease-in-out;
  filter: ${({ $isLit }) => ($isLit ? 'sepia(0)' : 'sepia(0.8)')};
  animation: ${fade} 3s 2s backwards;
  animation-delay: ${({ $delay }) => `${$delay}s`};

  &:not(:disabled) {
    cursor: pointer;
  }
`;

const A = styled(Key)`
  top: 30%;
  left: 20%;
  width: 12%;

  &:after {
    ${getImageCss('/a.png', 150, 166)}
  }
`;

const B = styled(Key)`
  top: 55%;
  left: 5%;
  width: 15%;

  &:after {
    ${getImageCss('/b.png', 200, 273)}
  }
`;

const C = styled(Key)`
  top: 105%;
  left: 40%;
  width: 10%;

  &:after {
    ${getImageCss('/c.png', 130, 112)}
  }
`;

const D = styled(Key)`
  top: 60%;
  left: 80%;
  width: 13%;

  &:after {
    ${getImageCss('/d.png', 160, 179)}
  }
`;

const E = styled(Key)`
  top: 30%;
  left: 70%;
  width: 10%;

  &:after {
    ${getImageCss('/e.png', 110, 94)}
  }
`;

const Notes = styled.div`
  position: absolute;
  left: 30%;
  bottom: 82%;
  width: 38%;
  height: 100%;
  display: flex;
  justify-content: center;
  clip-path: polygon(
    50% 0%,
    100% 0,
    100% 70%,
    79% 90%,
    49% 91%,
    19% 90%,
    0% 70%,
    0 0
  );
  overflow: hidden;
`;

const Note = styled.div`
  position: absolute;
  color: white;
  bottom: 0;
  animation: ${drift} 3.5s cubic-bezier(0.16, 1, 0.3, 1) both;
`;

export const LoginPage = () => {
  const [password, setPassword] = useState('');
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isFadeOut, setIsFadeOut] = useState(false);
  const [isPlayingA, setIsPlayingA] = useState(false);
  const [isPlayingB, setIsPlayingB] = useState(false);
  const [isPlayingC, setIsPlayingC] = useState(false);
  const [isPlayingD, setIsPlayingD] = useState(false);
  const [isPlayingE, setIsPlayingE] = useState(false);
  const [notes, setNotes] = useState([]);
  const { playAudio } = useAudioPlayer();
  const languageData = useLanguage();
  const { isEnglish } = languageData;

  const playAudioSample = async (key, label, method) => {
    playAudio(`/${key}.mp3`, { volume: 0.5 });
    setPassword((password) => `${password}${key}`.slice(-PASSWORD_MAX_LENGTH));
    clearTimeout(timers[key]);
    timers[key] = setTimeout(() => method(false), 2000);
    method(true);

    const id = `${Date.now()}${Math.random()}`;
    const note = { key: label, id };
    setNotes((notes) => [...notes, note]);
    setTimeout(() => {
      setNotes((notes) => notes.filter((note) => note.id !== id));
    }, 4000);
  };

  const aPlay = () => playAudioSample('a', 'A', setIsPlayingA);
  const bPlay = () => playAudioSample('b', 'B', setIsPlayingB);
  const cPlay = () => playAudioSample('c', 'C', setIsPlayingC);
  const dPlay = () => playAudioSample('d', 'D', setIsPlayingD);
  const ePlay = () => playAudioSample('e', 'E', setIsPlayingE);

  const handlers = {
    PLAY_A: () => aPlay(),
    PLAY_B: () => bPlay(),
    PLAY_C: () => cPlay(),
    PLAY_D: () => dPlay(),
    PLAY_E: () => ePlay(),
  };

  const handlersByNote = {
    a: () => aPlay(),
    b: () => bPlay(),
    c: () => cPlay(),
    d: () => dPlay(),
    e: () => ePlay(),
  };

  const playSong = (song) => {
    const notes = song.toLowerCase().split('');

    let i = 0;
    setIsAutoPlaying(true);
    for (const note of notes) {
      setTimeout(() => {
        handlersByNote[note]();
      }, i * 1000);
      i += 1;
    }
    setTimeout(() => {
      setIsAutoPlaying(false);
    }, i * 1000);
  };

  const onLogin = async () => {
    if (!password) {
      return;
    }
    const result = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password,
      }),
    });
    if (result.ok) {
      setPassword('');
      try {
        const { song } = await result.json();
        setTimeout(async () => {
          setIsPlayingSong(true);
          setInterval(() => {
            setNotes((notes) => [
              ...notes,
              { id: `${Date.now()}${Math.random()}`, isOrange: true },
            ]);
          }, 1000);
          playAudio(song);
          if (isFadeOut) {
            return;
          }
          setTimeout(() => {
            setIsFadeOut(true);
          }, 5500);
        }, 2000);
      } catch (err) {
        setIsFadeOut(true);
      }
    }
  };

  useEffect(() => {
    onLogin();
  }, [password]);

  const touchPlay = (e, method) => {
    e.preventDefault();
    method();
  };

  return (
    <LanguageContext.Provider value={languageData}>
      <Wrapper $isEnglish={isEnglish}>
        <HotKeys keyMap={keyMap} handlers={handlers}>
          <FullPageImage src={'/pages.jpg'} opacity={0.3} />
          <GodSettings
            triggerSettings={{ background: '#1a1613', fill: '#ccb390' }}
            city="Valdrada"
          />
          <Form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Deus>
              <Machina $isLit={isPlayingSong} />
              <A
                onClick={ePlay}
                onTouchEnd={(e) => touchPlay(e, ePlay)}
                $isLit={isPlayingE || isPlayingSong}
                disabled={isPlayingSong || isAutoPlaying}
                $delay={3.5}
              />
              <B
                onClick={dPlay}
                onTouchEnd={(e) => touchPlay(e, dPlay)}
                $isLit={isPlayingD || isPlayingSong}
                disabled={isPlayingSong || isAutoPlaying}
                $delay={3}
              />
              <C
                onClick={cPlay}
                onTouchEnd={(e) => touchPlay(e, cPlay)}
                $isLit={isPlayingC || isPlayingSong}
                disabled={isPlayingSong || isAutoPlaying}
                $delay={2.5}
              />
              <D
                onClick={bPlay}
                onTouchEnd={(e) => touchPlay(e, bPlay)}
                $isLit={isPlayingB || isPlayingSong}
                disabled={isPlayingSong || isAutoPlaying}
                $delay={2}
              />
              <E
                onClick={aPlay}
                onTouchEnd={(e) => touchPlay(e, aPlay)}
                $isLit={isPlayingA || isPlayingSong}
                disabled={isPlayingSong || isAutoPlaying}
                $delay={1.5}
              />
              <Notes>
                {notes.map((note) => (
                  <Note key={note.id}>
                    <Seed isOrange={note.isOrange} />
                  </Note>
                ))}
              </Notes>
            </Deus>
          </Form>
          <PlaySong>
            <button onClick={() => playSong(process.env.PASSWORD)}>
              Enter Adardlav
            </button>
          </PlaySong>
          {isFadeOut && (
            <FadeOut
              duration={PAGE_FADE}
              onComplete={() => {
                document.location.reload();
              }}
            />
          )}
        </HotKeys>
      </Wrapper>
    </LanguageContext.Provider>
  );
};
