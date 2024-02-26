import {
  BREAKPOINT_SMALL,
  Dialog,
  FullPageImage,
  MovableSprite,
  StaticSprite,
  encrypt,
  getDialogId,
  getPathCoordinate,
  useAudioPlayer,
  useImageLoaded,
  useWindowSize,
  LanguageContext,
  useLanguage,
  GodSettings,
} from '@itegoarcanadei/client-shared';
import {
  DIALOG_STATE_BOOK,
  DIALOG_STATE_MAP,
  EFFECTS_CORMORANTS,
  INVENTORY_BOOK,
  INVENTORY_MAP,
} from './types';
import { HotKeys, configure } from 'react-hotkeys';
import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';

import { Inventory } from '../../components/Inventory';
import { TranscriptView } from '../../components/Transcript';
import { cover } from 'intrinsic-scale';
import dialog from './dialog.js';
import { getWalkPath } from '../../utils/getWalkPath';

const BOX_SIZE = 150;
const BOX_PADDING = 100;
const MOVE_INCREMENT_X = 8;
const START_X = 0.01;
const RIVER_HEIGHT = 0.23;
const TALK_DIFF = 150;

const CITY_WIDTH = 4901;
const CITY_HEIGHT = 3821;
const YOU_SPRITE = {
  sprite: '/static/you.png',
  width: 300,
  height: 300,
  fps: 10,
  scale: 2,
  stopAtFrame: 2,
};

const THEM_SPRITE = {
  sprite: '/static/them.png',
  width: 85,
  height: 150,
};

const WALK_PATH = getWalkPath();
const DIALOG_LOCAL_STORAGE_KEY = encrypt('dialog');
const INVENTORY_LOCAL_STORAGE_KEY = encrypt('inventory');
const TRANSCRIPT_LOCAL_STORAGE_KEY = encrypt('transcript');

configure({
  ignoreRepeatedEventsWhenKeyHeldDown: false,
  allowCombinationSubmatches: true,
});

const fade = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const StyledHotKeys = styled(HotKeys)`
  *:focus,
  &:focus {
    outline: 0;
  }

  ${({ $isEnglish }) =>
    $isEnglish &&
    css`
      font-family: 'Adrogue';
    `};
`;

const Container = styled.div`
  position: fixed;
  right: 0;
  left: 0;
  height: ${BOX_SIZE}px;
  padding: ${BOX_PADDING}px 0;
  animation: ${fade} 1000ms ease-in-out both;
`;

const keyMap = {
  MOVE_LEFT: ['left'],
  MOVE_RIGHT: ['right'],
};

const encryptState = (state) => {
  const keys = Object.keys(state);
  if (keys.length === 0) {
    return {};
  }
  const result = [];
  for (const key of keys) {
    result[encrypt(key)] = state[key];
  }
  return result;
};

export const Valdrada = () => {
  const [x, setX] = useState(START_X);
  const [inventoryLocalStorage] = useLocalStorage(
    INVENTORY_LOCAL_STORAGE_KEY,
    []
  );
  const [dialogLocalStorage] = useLocalStorage(DIALOG_LOCAL_STORAGE_KEY, {});
  const [transcriptLocalStorage, writeTranscriptLocalStorage] = useLocalStorage(
    TRANSCRIPT_LOCAL_STORAGE_KEY,
    []
  );
  const [dialogState, setDialogState] = useState(dialogLocalStorage);
  const [transcript, setTranscript] = useState(transcriptLocalStorage);
  const [serverState, setServerState] = useState({});
  const [coverResult, setCoverResult] = useState({});
  const [currentPX, setCurrentPX] = useState(START_X);
  const [isTalking, setIsTalking] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCityReady, setIsCityReady] = useState(false);
  const [inventory, setInventory] = useState(inventoryLocalStorage);
  const [isMapDialogClosed, setIsMapDialogClosed] = useState(false);
  const [isBookDialogClosed, setIsBookDialogClosed] = useState(false);
  const [stopSteps, setStopSteps] = useState(null);
  const languageData = useLanguage();
  const { isEnglish } = languageData;

  const { playAudio, initializeAudio, loadAudio, isAudioInitialized } =
    useAudioPlayer();
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [areCharactersLoaded] = useImageLoaded([
    '/static/you.png',
    '/static/them.png',
  ]);

  const youRef = useMemo(() => createRef(), []);
  const themRef = useMemo(() => createRef(), []);

  const getYFn = useMemo(() => getPathCoordinate(WALK_PATH), []);
  const getY = useCallback(
    (x) => {
      if (!coverResult.width || !coverResult.height) {
        return 0;
      }
      const scaleX = CITY_WIDTH / coverResult.width;
      const scaleY = CITY_HEIGHT / coverResult.height;
      const y = getYFn(Math.round((x + BOX_SIZE / 2 - coverResult.x) * scaleX));
      if (!Number.isFinite(y)) {
        return x > 0 ? getYFn(CITY_WIDTH) / scaleY : 0;
      }
      return y / scaleY;
    },
    [getYFn, coverResult]
  );

  const { width, height } = useWindowSize();
  const [riverHeight, setRiverHeight] = useState(undefined);
  const isRendered = useMemo(() => Number.isFinite(riverHeight), [riverHeight]);
  const npcX = useMemo(
    () => (width < BREAKPOINT_SMALL ? width - 120 : width - 200),
    [width]
  );
  const npcY = useMemo(() => getY(npcX), [npcX, getY]);
  const increment = useMemo(() => MOVE_INCREMENT_X / width, [width]);
  const spriteScale = useMemo(
    () => Math.min(1, coverResult.height / 1600),
    [coverResult]
  );
  const youCenterX = useMemo(
    () => currentPX * width + BOX_SIZE / 2,
    [currentPX, width]
  );
  const themCenterX = useMemo(() => npcX + THEM_SPRITE.width / 2, [npcX]);
  const handlers = {
    MOVE_RIGHT: () => {
      setX((x) => Math.min(1, x + increment * 2));
    },
    MOVE_LEFT: () => {
      setX((x) => Math.max(-BOX_SIZE / width, x - increment * 2));
    },
  };
  useEffect(() => {
    const result = cover(width, height, CITY_WIDTH, CITY_HEIGHT);
    const riverBoxHeight = result.height * RIVER_HEIGHT;
    setRiverHeight(riverBoxHeight);
    setCoverResult(result);
  }, [width, height]);

  const updateServerState = async () => {
    const response = await fetch('/state');
    if (!response.ok) {
      return;
    }
    const json = await response.json();
    setServerState((oldState) => ({ ...oldState, ...json }));
  };

  useEffect(() => {
    writeTranscriptLocalStorage(transcript);
  }, [transcript]);

  useEffect(() => {
    (async () => {
      if (!isMoving) {
        if (stopSteps) {
          stopSteps.fn.stop();
          setStopSteps(null);
        }
        return;
      }
      if (stopSteps) {
        return;
      }
      setStopSteps({
        fn: await playAudio('/static/steps.mp3', {
          loop: true,
          volume: 0.3,
        }),
      });
    })();
  }, [isMoving]);

  useEffect(() => {
    writeStorage(DIALOG_LOCAL_STORAGE_KEY, dialogState);
  }, [dialogState]);

  useEffect(() => {
    writeStorage(INVENTORY_LOCAL_STORAGE_KEY, inventory);
  }, [inventory]);

  useEffect(() => {
    if (isMapDialogClosed) {
      setDialogState((oldState) => ({
        ...oldState,
        [encrypt(DIALOG_STATE_MAP)]: true,
      }));
    }
  }, [isMapDialogClosed]);

  useEffect(() => {
    if (isBookDialogClosed) {
      setDialogState((oldState) => ({
        ...oldState,
        [encrypt(DIALOG_STATE_BOOK)]: true,
      }));
    }
  }, [isBookDialogClosed]);

  useEffect(() => {
    if (!isPlayingMusic) {
      return;
    }
    playAudio('/static/valdrada.mp3', {
      loop: true,
      volume: 0.3,
    });
  }, [isPlayingMusic]);

  return (
    <LanguageContext.Provider value={languageData}>
      <StyledHotKeys
        $isEnglish={isEnglish}
        keyMap={keyMap}
        handlers={isTalking ? {} : handlers}
        allowChanges={true}
        onClick={async () => {
          if (!isAudioInitialized) {
            await initializeAudio();
            loadAudio('/static/valdrada.mp3');
            loadAudio('/static/steps.mp3');
          }
        }}
      >
        <FullPageImage
          align="bottom"
          src="/static/city.jpg"
          opacity={1}
          onDone={() => setIsCityReady(true)}
        />
        {isCityReady && areCharactersLoaded && isRendered && (
          <>
            <GodSettings
              triggerSettings={{ background: '#1a1613', fill: '#ccb390' }}
              city="Valdrada"
            />
            <Container
              onClick={async (e) => {
                if (isTalking) {
                  return;
                }
                const currentX = e.pageX - BOX_SIZE / 2;
                const percent = currentX / width;
                const minPercent = -BOX_SIZE / width;
                setX(Math.min(1, Math.max(minPercent, percent)));
              }}
              style={{
                bottom: riverHeight - BOX_PADDING,
              }}
            >
              <MovableSprite
                px={x}
                startPX={x}
                scale={spriteScale}
                increment={increment}
                screenWidth={width}
                ref={youRef}
                getY={getY}
                sprite={YOU_SPRITE}
                isFlipped={isFlipped}
                onPositionChange={(px) => setCurrentPX(px)}
                onFlip={(flip) => setIsFlipped(flip)}
                onIsMoving={(isMoving) => setIsMoving(isMoving)}
                isReflected={true}
              />
              {isRendered && (
                <StaticSprite
                  ref={themRef}
                  x={npcX}
                  y={npcY}
                  sprite={THEM_SPRITE}
                  scale={spriteScale}
                  isFlipped={youCenterX > themCenterX}
                  onClick={async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (!isAudioInitialized) {
                      await initializeAudio();
                    }
                    if (isMoving) {
                      return;
                    }
                    const diff = Math.abs(youCenterX - themCenterX);
                    setIsFlipped(youCenterX > themCenterX);
                    if (diff < TALK_DIFF) {
                      await updateServerState();
                      setIsTalking(true);
                      setIsPlayingMusic(true);
                    }
                  }}
                />
              )}
            </Container>
          </>
        )}
        <Inventory
          items={inventory}
          isDisabled={isTalking}
          state={{
            canSendBook: dialogState[encrypt(EFFECTS_CORMORANTS)] === true,
          }}
          onCloseItem={(item) => {
            if (item === INVENTORY_MAP) {
              setIsMapDialogClosed(true);
            }
            if (item === INVENTORY_BOOK) {
              setIsBookDialogClosed(true);
            }
          }}
        />
        {transcript.length > 0 && <TranscriptView transcript={transcript} />}
        {isTalking && (
          <Dialog
            config={dialog}
            volume={0.5}
            state={{ ...dialogState, ...serverState }}
            onDialogStateChange={(state) =>
              setDialogState((oldState) => ({
                ...oldState,
                ...encryptState(state),
              }))
            }
            onDialogSeen={(config) =>
              setDialogState((oldState) => ({
                ...oldState,
                [getDialogId(config)]: true,
              }))
            }
            onInventory={(items) =>
              setInventory((inventory) => [
                ...inventory,
                ...items.filter((i) => inventory.indexOf(i) === -1),
              ])
            }
            onDone={() => {
              setIsTalking(false);
              setTranscript((t) => [
                ...t,
                {
                  type: 'exit',
                  character: 'you',
                  ts: Date.now(),
                },
              ]);
            }}
            refs={{
              you: youRef,
              them: themRef,
            }}
            onSpoken={({ character, text }) => {
              setTranscript((t) => [
                ...t,
                {
                  character: character,
                  text: text,
                  ts: Date.now(),
                },
              ]);
            }}
          />
        )}
      </StyledHotKeys>
    </LanguageContext.Provider>
  );
};
