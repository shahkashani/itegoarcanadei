import {
  BREAKPOINT_SMALL,
  ImgWithLoaded,
  LeftShardIcon,
  MaskIcon,
  MultiNarrative,
  RightShardIcon,
  ScalableContainer,
  WithFade,
  blurInput,
  useAudioPlayer,
  useInterval,
  useTimeout,
  LanguageContext,
  useLanguage,
  GodSettings,
} from '@itegoarcanadei/client-shared';
import {
  INVENTORY_LEFT_SHARD,
  INVENTORY_LOG,
  INVENTORY_MESSAGE,
  INVENTORY_RIGHT_SHARD,
  SETTINGS_CAN_SEE_PORTAL,
  SETTINGS_OPEN_ON_STORE,
  SETTINGS_ROOM_COLOR,
  SETTINGS_START_HOUR,
  SETTINGS_TICK,
  SETTINGS_TRAVEL_FREELY,
  SETTINGS_UNAVAILABLE,
} from '../../components/types';
import styled, { css, keyframes } from 'styled-components';
import { useEffect, useMemo, useState } from 'react';

import AnalogClock from 'analog-clock-react';
import { ElOtro } from '../../icons/ElOtro';
import { Log } from '../../components/Log';
import { LogIcon } from '../../icons/LogIcon';
import { Mask } from '../../components/Mask';
import { PencilIcon } from '../../icons/Pencil';
import { PortalIcon } from '../../icons/PortalIcon';
import { Theme } from '../../components/Theme';
import { getTime } from '../../utils/getTime';

const BIG_CLOCK_SIZE = 250;
const VOLUME_SMALL_CLOCK = 0.03;
const VOLUME_LARGE_CLOCK = 0.1;

const ENDPOINT_SAY = '/say';
const ENDPOINT_SAY_STORYKEEPER = '/say/storykeeper';
const ENDPOINT_LOG = '/log';
const ENDPOINT_LOG_STORYKEEPER = '/log/storykeeper';

const FLASH_IN_SPEED = 1000;
const FLASH_OUT_PAUSE = 2000;
const FLASH_OUT_SPEED = 3000;
const DELAY_BEFORE_FUSE = 2000;

const options = {
  useCustomTime: true,
  width: '130px',
  border: true,
  baseColor: 'rgba(255, 255, 255, 0)',
  centerColor: 'transparent',
  centerBorderColor: 'transparent',
  handColors: {
    second: 'transparent',
    minute: 'var(--light-accent)',
    hour: 'var(--dark-accent)',
  },
};

const bigOptions = {
  useCustomTime: true,
  width: `${BIG_CLOCK_SIZE}px`,
  border: true,
  borderColor: 'var(--lightest-accent-50)',
  baseColor: 'transparent',
  centerColor: 'transparent',
  centerBorderColor: 'transparent',
  handColors: {
    second: 'var(--light-accent)',
    minute: 'var(--light-accent)',
    hour: 'var(--dark-accent)',
  },
};

const LETTER_STAGGERING_MS = 350;
const TOTAL_ANIMATION_MS = 3000;

const StyledNarrative = styled(MultiNarrative)`
  font-family: 'Sinapius';
  color: var(--dark-accent);

  ${({ $isEnglish }) =>
    $isEnglish &&
    css`
      font-size: 2rem;
      font-family: 'Storykeeper';
    `}
`;

const StoreImage = styled(ImgWithLoaded)`
  width: 100%;
`;

const pulsate = keyframes`
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 0.2;
  }
`;

const upsmoke = keyframes`
  0% {
    top: 100%;
  }
  100% {
    top: -50px;
  }
`;

const downsmoke = keyframes`
  0% {
    top: 0;
  }
  15% {
    transform: none;
  }
  100% {
    top: 110%;
    transform: scale(0);
  }
`;

const upjiggle = keyframes`
  0% {
    filter: none;
    opacity: 0;
    transform: scale(0.4);
  }
  25% {
    margin-left: 20px;
    opacity: 1;
    filter: none;
  }
  50% {
    transform: scale(1);
  }
  100% {
    opacity: 0;
    filter: blur(20px);
    transform: scale(2);
  }
`;

const downjiggle = keyframes`
  0% {
    filter: blur(10px);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  25% {
    margin-left: 20px;
    opacity: 1;
    filter: none;
  }
  100% {
    opacity: 0;
    filter: none;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  text-align: center;
`;

const Message = styled.div`
  font-size: 100px;
  line-height: 0;
  position: absolute;
  top: -20px;
  left: 1420px;
  width: 100px;
  height: 350px;
`;

const Letter = styled.span`
  position: absolute;
  top: 0;
  animation: ${upsmoke} ${TOTAL_ANIMATION_MS - 500}ms both ease-out,
    ${upjiggle} ${TOTAL_ANIMATION_MS}ms both ease-out;
  text-align: center;
  display: block;
  width: 30px;
  left: 0;
  color: var(--dark-accent);

  ${({ $isColor }) =>
    $isColor &&
    css`
      font-family: 'Storykeeper';
      font-size: 80px;
    `}
`;

const SendLetter = styled.span`
  position: absolute;
  top: 0;
  animation: ${downsmoke} ${TOTAL_ANIMATION_MS - 500}ms both ease-out,
    ${downjiggle} ${TOTAL_ANIMATION_MS}ms both;
  text-align: center;
  display: block;
  width: 30px;
  left: 0;
  color: var(--lightest-accent);
  text-shadow: 2px 2px 5px black;
`;

export const MessageInput = styled.input`
  padding: 10px 20px;
  font-size: 1.5rem;
  letter-spacing: 1px;
  background: var(--lightest-accent-70);
  border: 0;
  border-radius: 25px;
  transition: background-color 800ms ease-out;
  color: var(--dark-accent);
  border: 2px solid var(--dark-accent);
  box-sizing: border-box;

  &::placeholder {
    color: var(--light-accent);
  }

  &:focus {
    outline: none;
    background: var(--lightest-accent-90);
  }
`;

const StyledStore = styled.div`
  transition: opacity 2000ms;
  ${({ $isLoaded }) =>
    !$isLoaded &&
    css`
      opacity: 0;
    `}
`;

const Clock = styled.div`
  position: absolute;
  z-index: 2;
  left: 2360px;
  top: 1143px;
  transform: rotateY(65deg);

  [type='second'],
  [type='minute'],
  [type='hour'] {
    min-height: 3.5%;
  }
`;

const BigClock = styled(WithFade)`
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -${BIG_CLOCK_SIZE / 2}px;
  margin-top: -${BIG_CLOCK_SIZE / 2}px;
`;

const Inventory = styled.div`
  position: absolute;
  right: 40px;
  bottom: 40px;
  display: flex;
  gap: 15px;
  flex-direction: column;
  z-index: 3;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    bottom: 20px;
    right: 20px;
  }
`;

const MaskContainer = styled(Mask)`
  position: absolute;
  z-index: 2;
`;

const InventoryButton = styled(WithFade)`
  background: var(--lighter-accent);
  color: var(--dark-accent);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  border-radius: 100%;
  width: 80px;
  height: 80px;
  box-sizing: border-box;
  padding: 10px;
  position: relative;
  user-select: none;

  &:after {
    content: '';
    transition: opacity 1000ms ease-out;
    border-radius: 100%;
    border: 3px solid currentColor;
    position: absolute;
    left: -3px;
    top: -3px;
    right: -3px;
    bottom: -3px;
    opacity: ${({ $isActive }) => ($isActive ? 1 : 0)};
  }

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    width: 60px;
    height: 60px;
  }
`;

const MessageContainer = styled(WithFade)`
  position: absolute;
  width: 300px;
  height: 100px;
  margin-left: -150px;
  margin-top: -50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0;
  top: 50%;
  left: 50%;
`;

const LogContainer = styled(WithFade)`
  position: absolute;
  height: 200px;
  max-width: 80vw;
  min-width: 400px;
  z-index: 1;

  left: 40px;
  bottom: 40px;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    bottom: 20px;
    left: 20px;
  }
`;

const Flash = styled(WithFade)`
  position: absolute;
  z-index: 5;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #e4e2dd;
`;

const DigitalClock = styled(WithFade)`
  margin-top: 10px;
  background: var(--dark-accent);
  color: var(--lighter-accent);
  display: inline-block;
  padding: 5px 10px;
  border-radius: 4px;
  user-select: none;
`;

const NothingHappened = styled(WithFade)`
  text-shadow: 2px 2px 1px var(--dark-accent);
  z-index: 3;
  color: var(--lightest-accent);
  display: inline-block;
  padding: 5px 10px;
  user-select: none;
  position: absolute;
  bottom: 20px;
  left: 50%;
  font-size: 2rem;
  transform: translateX(-50%);
  font-family: 'Sinapius';

  ${({ $isEnglish }) =>
    $isEnglish &&
    css`
      font-family: 'Leonia';
    `}
`;

const Portal = styled(WithFade)`
  position: absolute;
  cursor: pointer;
  top: 833px;
  left: 1218px;
  width: 191px;
  height: 565px;

  ${({ $isColor }) =>
    $isColor &&
    css`
      top: 837px;
    `}

  svg {
    animation: ${pulsate} 2000ms infinite;
  }
`;

export const Letters = ({ message, isColor, onDone }) => {
  const { text, who } = message;
  const timeout = useMemo(
    () => text.length * LETTER_STAGGERING_MS + TOTAL_ANIMATION_MS - 1000,
    [text]
  );

  if (timeout) {
    useTimeout(() => {
      onDone?.();
    }, timeout);
  }

  if (who === 'You') {
    return <SendLetters text={text} />;
  } else {
    return <SmokeLetters isColor={isColor} text={text} />;
  }
};

export const SmokeLetters = ({ isColor, text }) => {
  return (
    <Message>
      {text.split('').map((letter, i) => (
        <Letter
          $isColor={isColor}
          key={i}
          style={{ animationDelay: `${i * LETTER_STAGGERING_MS}ms` }}
        >
          {letter}
        </Letter>
      ))}
    </Message>
  );
};

export const SendLetters = ({ text }) => {
  return (
    <Message>
      {text.split('').map((letter, i) => (
        <SendLetter
          key={i}
          style={{
            animationDelay: `${i * LETTER_STAGGERING_MS}ms`,
          }}
        >
          {letter}
        </SendLetter>
      ))}
    </Message>
  );
};

export const Leonia = () => {
  const [text, setText] = useState('');
  const [message, setMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isShowingMessage, setIsShowingMessage] = useState(false);
  const { isAudioInitialized, playAudio, initializeAudio } = useAudioPlayer();
  const [isShowStore, setIsShowStore] = useState(false);
  const [isFadeIntro, setIsFadeIntro] = useState(false);
  const [isShowIntro, setIsShowIntro] = useState(false);
  const [isShowBigClock, setIsShowBigClock] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);
  const [isShowMessageButton, setIsShowMessageButton] = useState(false);
  const [isShowLogButton, setIsShowLogButton] = useState(false);
  const [isShowLeftShardButton, setIsShowLeftShardButton] = useState(false);
  const [isShowRightShardButton, setIsShowRightShardButton] = useState(false);
  const [isShowLeftShard, setIsShowLeftShard] = useState(false);
  const [isShowRightShard, setIsShowRightShard] = useState(false);
  const [isShowFullMask, setIsShowFullMask] = useState(false);
  const [isShowPortal, setIsShowPortal] = useState(false);
  const [canTravelFreely, setCanTravelFreely] = useState(false);
  const [startHour, setStartHour] = useState(10);
  const [isFuse, setIsFuse] = useState(false);
  const [fuseTimeout, setFusetimeout] = useState(null);
  const [clockOptions, setClockOptions] = useState({});
  const [showDigitalClock, setShowDigitalClock] = useState(false);
  const [isClockTick, setIsClockTick] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [isShowNothingHappened, setIsShowNothingHappened] = useState(false);
  const tsLastVisit = useMemo(() => Date.now(), []);

  const [isShowMessage, setIsShowMessage] = useState(false);
  const [isShowLog, setIsShowLog] = useState(false);
  const [isSkipNextFuse, setIsSkipNextFuse] = useState(false);
  const [log, setLog] = useState([]);

  const [isShowFlash, setIsShowFlash] = useState(false);
  const [isRoomColor, setIsRoomColor] = useState(false);
  const [isRoomColorDone, setIsRoomColorDone] = useState(isRoomColor);
  const [isSending, setIsSending] = useState(false);
  const [stopDialog, setStopDialog] = useState(null);

  const languageData = useLanguage();
  const { isEnglish } = languageData;

  const onPortalClick = async () => {
    const response = await fetch('/apelcir', { method: 'POST' });
    if (!response.ok) {
      return;
    }
    const { portal } = await response.json();
    setIsShowFlash(true);
    setTimeout(() => {
      document.location.href = portal;
    }, FLASH_IN_SPEED);
  };

  const updateInventory = async (isFirst = false) => {
    const response = await fetch('/inventory');
    if (!response.ok) {
      return;
    }
    const json = await response.json();
    const isColor = !!json[SETTINGS_ROOM_COLOR];
    const startHour = json[SETTINGS_START_HOUR];
    const showLogButton = !!json[INVENTORY_LOG];
    setStartHour(startHour);
    setClockOptions(getTime(startHour));
    setIsShowMessageButton(!!json[INVENTORY_MESSAGE]);
    setIsShowLogButton(showLogButton);
    setIsShowLeftShardButton(!!json[INVENTORY_LEFT_SHARD]);
    setIsShowRightShardButton(!!json[INVENTORY_RIGHT_SHARD]);
    setCanTravelFreely(!!json[SETTINGS_TRAVEL_FREELY]);
    setIsRoomColor(isColor);
    if (isFirst) {
      setIsRoomColorDone(isColor);
    }
    if (!showLogButton) {
      setIsShowLog(false);
    }
    setIsShowPortal(!!json[SETTINGS_CAN_SEE_PORTAL]);
    setIsClockTick(!!json[SETTINGS_TICK]);
    setIsUnavailable(!!json[SETTINGS_UNAVAILABLE]);
    setIsSettingsLoaded(true);
    if (isFirst) {
      const isSkipToStore = !!json[SETTINGS_OPEN_ON_STORE];
      setIsShowIntro(!isSkipToStore);
      setIsShowStore(isSkipToStore);
    }
  };

  const updateLog = async () => {
    const response = await fetch(
      isRoomColor ? ENDPOINT_LOG_STORYKEEPER : ENDPOINT_LOG
    );
    if (!response.ok) {
      setLog([]);
      setIsShowLog(false);
      return;
    }
    const messages = await response.json();
    setLog(messages);
    if (messages.length === 0) {
      setIsShowLog(false);
    }
  };

  useEffect(() => {
    if (isShowLog) {
      updateLog();
    }
  }, [isShowLog]);

  useEffect(() => {
    if (isShowLogButton && isShowStore) {
      updateLog();
    }
  }, [isShowLogButton, isShowStore, isRoomColorDone]);

  useEffect(() => {
    if (isRoomColor === isRoomColorDone || !isSettingsLoaded) {
      return;
    }
    setIsShowFlash(true);
    const id = setTimeout(() => {
      if (stopDialog && stopDialog.fn) {
        stopDialog.fn.stop();
        setStopDialog(null);
      }
      setMessage(null);
      setIsShowingMessage(false);
      setIsRoomColorDone(isRoomColor);
      setIsShowFullMask(false);
      setIsShowLeftShard(false);
      setIsShowRightShard(false);
      setIsFuse(false);
      setTimeout(() => {
        setIsShowFlash(false);
      }, FLASH_OUT_PAUSE);
    }, FLASH_IN_SPEED);
    return () => clearTimeout(id);
  }, [isRoomColor]);

  useEffect(() => {
    clearTimeout(fuseTimeout);

    if (!isShowLeftShard || !isShowRightShard) {
      setIsFuse(false);
      return;
    }

    if (isSkipNextFuse) {
      setIsFuse(false);
      setIsSkipNextFuse(false);
      return;
    }

    const id = setTimeout(() => {
      requestAnimationFrame(async () => {
        const result = await fetch('/quliri', { method: 'POST' });
        if (result.ok) {
          setIsFuse(true);
        } else {
          showNothingHappened();
        }
      });
    }, DELAY_BEFORE_FUSE);

    setFusetimeout(id);

    return () => clearTimeout(id);
  }, [isShowLeftShard, isShowRightShard]);

  useEffect(() => {
    const socket = io();
    socket.on('message', (message) => {
      setMessages((m) => [...m, message]);
    });

    socket.on('delete', () => {
      if (isShowLog) {
        updateLog();
      }
    });

    socket.on('update', () => {
      updateInventory();
    });

    socket.on('input', ({ show }) => {
      setIsShowMessage(show);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useInterval(() => {
    if (!isShowStore) {
      return;
    }
    if (isUnavailable) {
      setClockOptions({
        title: '???',
        seconds: Math.round(Math.random() * 59),
        minutes: Math.round(Math.random() * 59),
        hours: Math.round(Math.random() * 23),
      });
    } else {
      setClockOptions(getTime(startHour));
    }
    if (isAudioInitialized && isClockTick) {
      playAudio('/tick.mp3', {
        volume: isShowBigClock ? VOLUME_LARGE_CLOCK : VOLUME_SMALL_CLOCK,
      });
    }
  }, 1000);

  useEffect(() => {
    updateInventory(true);
  }, []);

  const popNextMessage = async () => {
    if (messages.length === 0) {
      if (isShowLog || (isShowLogButton && log.length === 0)) {
        updateLog();
      }
      return;
    }
    const [nextMessage, ...rest] = messages;
    setIsShowingMessage(true);
    setMessage(nextMessage);
    setMessages(rest);
    if (stopDialog && stopDialog.fn) {
      stopDialog.fn.stop();
    }
    if (nextMessage.file && isAudioInitialized) {
      setStopDialog({
        fn: await playAudio(nextMessage.file, { volume: 0.5, stopFn: true }),
      });
    }
  };

  useEffect(() => {
    if (isShowingMessage || messages.length === 0) {
      return;
    }
    popNextMessage();
  }, [messages, isShowingMessage]);

  const sendMessage = async () => {
    if (!text || isSending) {
      return;
    }
    setIsSending(true);
    const result = await fetch(
      isRoomColor ? ENDPOINT_SAY_STORYKEEPER : ENDPOINT_SAY,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
        }),
      }
    );
    setIsSending(false);
    if (result.ok) {
      setText('');
    }
  };

  const showNothingHappened = () => {
    setIsShowNothingHappened(true);
    setTimeout(() => {
      setIsShowNothingHappened(false);
    }, 4000);
  };

  return (
    <LanguageContext.Provider value={languageData}>
      <Wrapper
        onClick={() => {
          initializeAudio();
          setIsShowBigClock(false);
        }}
      >
        <Theme isColor={isRoomColorDone} />
        {isShowStore && (
          <GodSettings
            city="Leonia"
            triggerSettings={{
              fill: 'var(--lighter-accent)',
              background: 'var(--dark-accent)',
            }}
          />
        )}
        {isShowIntro && (
          <StyledNarrative
            hideControls={true}
            $isEnglish={isEnglish}
            useTextShadow={false}
          >
            <div>
              <p>The stars turn</p>
              <p>and a time presents itself.</p>
            </div>
            <div>
              <div
                onClick={() => {
                  setIsFadeIntro(true);
                  setTimeout(() => {
                    setIsShowStore(true);
                  }, 2500);
                }}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <ElOtro height={200} isAnimated={isFadeIntro} />
              </div>
            </div>
          </StyledNarrative>
        )}
        {isShowStore && isSettingsLoaded && (
          <StyledStore $isLoaded={isImageLoaded}>
            <ScalableContainer width={2972} height={2385} isCover={true}>
              {!isRoomColorDone && (
                <StoreImage
                  src="/leonia.webp"
                  onLoaded={() => setIsImageLoaded(true)}
                />
              )}
              {isRoomColorDone && (
                <StoreImage
                  src="/nouvelle-leonie.webp"
                  onLoaded={() => setIsImageLoaded(true)}
                />
              )}
              {message && (
                <Letters
                  isColor={isRoomColorDone}
                  key={JSON.stringify(message)}
                  message={message}
                  onDone={() => {
                    setMessage(null);
                    setIsShowingMessage(false);
                    popNextMessage();
                  }}
                />
              )}
              <Clock
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShowBigClock((v) => !v);
                }}
              >
                <AnalogClock {...{ ...options, ...clockOptions }} />
              </Clock>
              <Portal
                $isColor={isRoomColorDone}
                isVisible={isShowPortal}
                onClick={() => onPortalClick()}
              >
                <PortalIcon
                  width="100%"
                  height="100%"
                  fill="var(--lightest-accent-50)"
                />
              </Portal>
            </ScalableContainer>
            <BigClock
              isVisible={isShowBigClock}
              onMouseOver={() => setShowDigitalClock(true)}
              onMouseOut={() => setShowDigitalClock(false)}
            >
              <AnalogClock {...{ ...bigOptions, ...clockOptions }} />
              <DigitalClock isVisible={showDigitalClock}>
                {clockOptions.title}
              </DigitalClock>
            </BigClock>
            <MessageContainer isVisible={isShowMessage}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  blurInput();
                  sendMessage();
                }}
              >
                <MessageInput
                  type="text"
                  disabled={isSending}
                  value={text}
                  onInput={(e) => setText(e.target.value)}
                />
              </form>
            </MessageContainer>
            <MaskContainer
              isEnglish={isEnglish}
              isShowFuseAnimation={isFuse}
              isShowLeft={isShowLeftShard}
              isShowRight={isShowRightShard}
              isShowFull={isShowFullMask}
              canShatter={canTravelFreely}
              onFuse={async () => {
                await fetch('/fuse', { method: 'POST' });
              }}
              onShatter={async () => {
                await fetch('/fuse', { method: 'DELETE' });
              }}
            />
            <Inventory>
              <InventoryButton
                isVisible={isShowMessageButton}
                $isActive={isShowMessage}
                onClick={() => setIsShowMessage((isShow) => !isShow)}
              >
                <PencilIcon fill="currentColor" height="90%" />
              </InventoryButton>
              <InventoryButton
                isVisible={isShowLogButton && log.length > 0}
                $isActive={isShowLog}
                onClick={() => setIsShowLog((isShow) => !isShow)}
              >
                <LogIcon fill="currentColor" width="100%" />
              </InventoryButton>
              <InventoryButton
                isVisible={
                  isShowLeftShardButton &&
                  isShowRightShardButton &&
                  isRoomColorDone
                }
                $isActive={isShowFullMask}
                onClick={() => setIsShowFullMask((isShow) => !isShow)}
              >
                <MaskIcon fill="currentColor" height="100%" />
              </InventoryButton>
              <InventoryButton
                isVisible={isShowLeftShardButton && !isRoomColorDone}
                $isActive={isShowLeftShard}
                onClick={() => setIsShowLeftShard((isShow) => !isShow)}
              >
                <LeftShardIcon fill="currentColor" height="100%" />
              </InventoryButton>
              <InventoryButton
                isVisible={isShowRightShardButton && !isRoomColorDone}
                $isActive={isShowRightShard}
                onClick={() => setIsShowRightShard((isShow) => !isShow)}
              >
                <RightShardIcon fill="currentColor" height="100%" />
              </InventoryButton>
            </Inventory>
            <LogContainer isVisible={isShowLog}>
              <Log
                isPlayAudio={false}
                messages={log}
                tsLastVisit={tsLastVisit}
                onClick={(message) => {
                  setMessage(null);
                  setIsShowingMessage(false);
                  setMessages([message]);
                  popNextMessage();
                }}
              />
            </LogContainer>
          </StyledStore>
        )}
        <NothingHappened
          $isEnglish={isEnglish}
          isVisible={isShowNothingHappened}
        >
          Hmm. Nothing happened.
        </NothingHappened>
        <Flash
          isVisible={isShowFlash}
          fadeDuration={isShowFlash ? FLASH_IN_SPEED : FLASH_OUT_SPEED}
        />
      </Wrapper>
    </LanguageContext.Provider>
  );
};
