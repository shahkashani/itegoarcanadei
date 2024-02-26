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
import { HotKeys, configure } from 'react-hotkeys';
import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';

import { Inventory } from '../../components/Inventory';
import { cover } from 'intrinsic-scale';
import dialog from './dialog.js';
import farewell from './farewell.js';
import { getWalkPath } from '../../utils/getWalkPath';

const BOX_SIZE = 150;
const BOX_PADDING = 200;
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
const DIALOG_LOCAL_STORAGE_KEY = encrypt('adardlav-dialog');
const INVENTORY_LOCAL_STORAGE_KEY = encrypt('adardlav-inventory');
const UNLOCKED_LOCAL_STORAGE_KEY = encrypt('adardlav-unlocked');

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

  ${({ $hasLeft }) =>
    $hasLeft &&
    css`
      animation: ${fade} 5000ms ease-in-out reverse both;
    `}
`;

const Container = styled.div`
  position: fixed;
  right: 0;
  left: 0;
  height: ${BOX_SIZE}px;
  padding: ${BOX_PADDING}px 0;
  animation: ${fade} 1000ms ease-in-out both;
`;

const Halo = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.8);
  filter: blur(50px);
  animation: ${fade} 4000ms 800ms ease-out both;
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

export const Adardlav = () => {
  const [x, setX] = useState(START_X);
  const [inventoryLocalStorage] = useLocalStorage(
    INVENTORY_LOCAL_STORAGE_KEY,
    []
  );
  const [dialogLocalStorage] = useLocalStorage(DIALOG_LOCAL_STORAGE_KEY, {});
  const [unlockedLocalstorage, setUnlockedLocalstorage] = useLocalStorage(
    UNLOCKED_LOCAL_STORAGE_KEY,
    false
  );
  const [dialogState, setDialogState] = useState(dialogLocalStorage);
  const [serverState, setServerState] = useState({});
  const [coverResult, setCoverResult] = useState({});
  const [currentPX, setCurrentPX] = useState(START_X);
  const [isTalking, setIsTalking] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCityReady, setIsCityReady] = useState(false);
  const [inventory, setInventory] = useState(inventoryLocalStorage);
  const [canWalk, setCanWalk] = useState(true);
  const [stopSteps, setStopSteps] = useState(null);
  const [stopMusic, setStopMusic] = useState(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isPlayingExit, setIsPlayingExit] = useState(false);
  const [isFadingMusic, setIsFadingMusic] = useState(false);
  const [stopExit, setStopExit] = useState(null);
  const languageData = useLanguage();
  const { isEnglish } = languageData;

  const { playAudio, initializeAudio, loadAudio, isAudioInitialized } =
    useAudioPlayer();
  const [areCharactersLoaded] = useImageLoaded([
    '/static/you.png',
    '/static/them.png',
  ]);

  const [showInventory, setShowInventory] = useState(true);
  const [isExitOpening, setIsExitOpening] = useState(false);
  const [isExitOpen, setIsExitOpen] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [hasLeft, setHasLeft] = useState(false);
  const [breach, setBreach] = useState(null);

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
  const spriteOpacity = useMemo(
    () => (isExitOpening ? 1 : 0.3),
    [isExitOpening]
  );
  const spriteShadowOpacity = useMemo(
    () => (isExitOpening ? 0.3 : 1),
    [isExitOpening]
  );

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
    return json;
  };

  useEffect(() => {
    writeStorage(DIALOG_LOCAL_STORAGE_KEY, dialogState);
  }, [dialogState]);

  useEffect(() => {
    writeStorage(INVENTORY_LOCAL_STORAGE_KEY, inventory);
  }, [inventory]);

  useEffect(() => {
    setCanWalk(!isTalking);
  }, [isTalking]);

  useEffect(() => {
    if (!isExitOpen || !isMoving || isLeaving) {
      return;
    }
    const left = currentPX * width;
    const diff = width - left;

    if (diff < 100 && !isFlipped) {
      setX(1.5);
      setIsLeaving(true);
      setCanWalk(false);
    }

    if (left < 0 && isFlipped) {
      setX(-1.5);
      setIsLeaving(true);
      setCanWalk(false);
    }
  }, [isExitOpen, isFlipped, isMoving, width, currentPX]);

  useEffect(() => {
    if (!isLeaving || hasLeft) {
      return;
    }
    if (currentPX > 1.2 || currentPX < -0.2) {
      setHasLeft(true);
    }
  }, [currentPX, isLeaving, hasLeft]);

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
    async () => {
      if (!isPlayingMusic) {
        if (stopMusic) {
          stopMusic.fn.stop();
          setStopMusic(null);
        }
        return;
      }
      setStopMusic({
        fn: await playAudio('/static/adardlav.mp3', {
          loop: true,
          volume: 0.6,
        }),
      });
    };
  }, [isPlayingMusic]);

  useEffect(() => {
    async () => {
      if (!isPlayingExit) {
        if (stopExit) {
          stopExit.fn.stop();
          setStopExit(null);
        }
        return;
      }
      setStopExit({
        fn: await playAudio('/static/exit.mp3', {
          loop: true,
          volume: 0.05,
        }),
      });
    };
  }, [isPlayingExit]);

  useEffect(() => {
    async () => {
      if (!isPlayingMusic || !isFadingMusic || !stopMusic) {
        return;
      }
      await stopMusic.fn.fade(3);
      setIsPlayingMusic(false);
    };
  }, [isFadingMusic]);

  useEffect(() => {
    if (!hasLeft) {
      return;
    }
    if (stopExit && stopExit.fn) {
      stopExit.fn.fade(10);
    }
    setTimeout(() => {
      document.location.href = breach;
    }, 10000);
  }, [hasLeft, breach]);

  return (
    <LanguageContext.Provider value={languageData}>
      <StyledHotKeys
        $isEnglish={isEnglish}
        keyMap={keyMap}
        $hasLeft={hasLeft}
        handlers={canWalk ? handlers : {}}
        allowChanges={true}
        onClick={async () => {
          if (!isAudioInitialized) {
            await initializeAudio();
            loadAudio('/static/adardlav.mp3');
            loadAudio('/static/steps.mp3');
          }
        }}
      >
        <FullPageImage
          align="bottom"
          src="/static/city.jpg"
          opacity={isExitOpen ? 0 : 1}
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
                if (!canWalk) {
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
                selfOpacity={spriteOpacity}
                shadowOpacity={spriteShadowOpacity}
              />
              {isRendered && (
                <StaticSprite
                  selfOpacity={spriteOpacity}
                  shadowOpacity={spriteShadowOpacity}
                  ref={themRef}
                  x={npcX}
                  y={npcY}
                  sprite={THEM_SPRITE}
                  scale={spriteScale}
                  isFlipped={youCenterX > themCenterX}
                  onClick={async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (isExitOpening) {
                      return;
                    }
                    if (!isAudioInitialized) {
                      await initializeAudio();
                    }
                    if (isMoving) {
                      return;
                    }
                    const diff = Math.abs(youCenterX - themCenterX);
                    setIsFlipped(youCenterX > themCenterX);
                    if (diff < TALK_DIFF) {
                      const state = await updateServerState();
                      const next = state[encrypt('breach')];
                      if (unlockedLocalstorage && next) {
                        setBreach(next);
                        setShowInventory(false);
                        setIsFadingMusic(true);
                        setIsExitOpening(true);
                        setIsPlayingExit(true);
                        setCanWalk(false);
                      } else {
                        setIsTalking(true);
                        setIsPlayingMusic(true);
                      }
                    }
                  }}
                >
                  {isExitOpen && <Halo />}
                </StaticSprite>
              )}
            </Container>
          </>
        )}
        {showInventory && (
          <Inventory
            items={inventory}
            language={languageData.language}
            isDisabled={isTalking}
            onOpenItem={async (item) => {
              if (item) {
                setIsPlayingMusic(true);
              }
            }}
            onUnlocked={async () => {
              const state = await updateServerState();
              setBreach(state[encrypt('breach')]);
              setIsPlayingExit(true);
              setIsFadingMusic(true);
              setCanWalk(false);
              setUnlockedLocalstorage(true);
              setTimeout(() => {
                setShowInventory(false);
                setTimeout(() => {
                  setIsExitOpening(true);
                }, 3000);
              }, 5000);
            }}
          />
        )}
        {isTalking && (
          <Dialog
            volume={0.7}
            flipDialog={true}
            config={dialog}
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
            }}
            refs={{
              you: youRef,
              them: themRef,
            }}
          />
        )}
        {isExitOpening && (
          <Dialog
            config={farewell}
            state={{}}
            onDone={() => {
              setTimeout(() => {
                setCanWalk(true);
                setIsExitOpen(true);
              }, 2000);
            }}
            refs={{
              you: youRef,
              friend: themRef,
            }}
          />
        )}
      </StyledHotKeys>
    </LanguageContext.Provider>
  );
};
