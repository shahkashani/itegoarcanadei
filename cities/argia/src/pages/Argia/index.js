import {
  BREAKPOINT_SMALL,
  FadeImage,
  ScalableContainer,
  WithFade,
  useAudioPlayer,
  LanguageContext,
  useLanguage,
  GodSettings,
} from '@itegoarcanadei/client-shared';
import {
  INVENTORY_LOG,
  INVENTORY_MESSAGE,
  SETTINGS_CONFIDENTIAL,
  SETTINGS_MUSIC,
  SETTINGS_PHOTO_GONE,
  SETTINGS_PRESENT,
} from '../../components/types';
import styled, { css, keyframes } from 'styled-components';
import { useEffect, useMemo, useState } from 'react';

import { Log } from '../../components/Log';
import { SpriteAnimator } from 'react-sprite-animator';

const PAPERS = 4;

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Sprite = styled(FadeImage)`
  position: absolute;
  width: 366px;
  height: 1293px;
  z-index: 2;
  top: 1010px;
  left: 1205px;
`;

const Controls = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const MessageInput = styled.textarea`
  margin-bottom: 20px;
  resize: none;
  background: transparent;
  border: 0;
  color: #342003;
  box-sizing: border-box;
  width: 350px;
  height: 160px;
  font-size: 3rem;
  opacity: 0.8;

  &::placeholder {
    color: #333;
  }

  &:focus {
    outline: none;
  }

  &:read-only {
    opacity: 0.5;
  }

  ${({ $paper }) =>
    $paper &&
    css`
      font-weight: ${$paper * 100};
    `}
`;

const fade = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

const glow = keyframes`
  0% {
    filter: drop-shadow(0 0 25px #feb956);
  }

  100% {
    filter: none;
  }
`;

const StyledPaperWrapper = styled.div`
  animation: ${glow} 10000ms ease-out;
  position: absolute;
  z-index: 2;
`;

const StyledPaper = styled.img`
  animation: ${fade} 1000ms ease-in-out;
  transition: filter 1000ms;
  border-radius: 100%;
  padding: 10px;
  width: 50px;
  cursor: pointer;
  ${({ $isRead, $isHorcicky }) =>
    $isRead
      ? css`
          filter: brightness(0.4);
        `
      : $isHorcicky
      ? css`
          filter: brightness(0.75) drop-shadow(0 0 35px #ffd291);
        `
      : css`
          filter: brightness(0.4);
        `}
`;

const StyledMessage = styled.div`
  position: absolute;
  z-index: 4;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const StyledMessageText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  max-height: 200px;
  overflow-y: auto;
  color: #342003;
  white-space: pre-wrap;
  font-family: Seeker;
  font-size: 3rem;
  opacity: 0.8;
  user-select: none;
  overflow-x: hidden;

  ${({ $paper }) =>
    $paper &&
    css`
      font-weight: ${$paper * 100};
    `}

  ${({ $isHorcicky }) =>
    $isHorcicky &&
    css`
      font-weight: normal;
      font-size: 1.6rem;
      font-family: Sinapius;
      line-height: 2;
    `}

    ${({ $isHorcicky, $isEnglish }) =>
    $isHorcicky &&
    $isEnglish &&
    css`
      font-family: 'Argia';
    `}
`;

const StyledMessageNumber = styled.div`
  color: #342003;
  position: absolute;
  right: 120px;
  text-align: right;
  top: 55px;
  opacity: 0.5;
  font-size: 1.2rem;
  user-select: none;
  font-family: Seeker;
`;

const StyledMessageSender = styled.div`
  position: absolute;
  z-index: 3;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Orb = styled.div`
  position: absolute;
  cursor: pointer;
  border-radius: 100%;
  top: 1430px;
  left: 2230px;
  width: 370px;
  height: 360px;
`;

const Frame = styled.div`
  position: absolute;
  cursor: pointer;
  top: 760px;
  left: 2250px;
  width: 370px;
  height: 460px;
  transform: rotate(-3deg);

  ${({ $isPhotoGone }) =>
    $isPhotoGone &&
    css`
      left: 475px;
      top: 680px;
      width: 630px;
      height: 520px;
      transform: none;
    `}
`;

const Button = styled.button`
  background: #9e8b30;
  color: #342003;
  border: none;
  padding: 8px 14px;
  cursor: pointer;
  transition: opacity 500ms;

  &:disabled {
    opacity: 0.5;
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  color: #342003;
  input {
    margin-right: 5px;
  }
`;

const CrumbledPaper = ({ message, number, onRead }) => {
  return (
    <StyledPaperWrapper
      style={{ top: message.coordinates.y, left: message.coordinates.x }}
    >
      <StyledPaper
        title={`Crumpled note no. ${number}`}
        onClick={(e) => {
          e.stopPropagation();
          onRead({ ...message, number });
        }}
        src={`/paper-no-${message.paper}.webp`}
        $isRead={message.isRead}
        $isHorcicky={message.who !== 'You'}
      />
    </StyledPaperWrapper>
  );
};

const MessageView = ({ message, isEnglish, onClose }) => {
  const [isEnded, setIsEnded] = useState(false);
  const { playAudio } = useAudioPlayer();

  useEffect(() => {
    if (message.file && isEnded) {
      playAudio(message.file, { volume: 0.05 });
    }
  }, [message.file, isEnded]);

  return (
    <StyledMessage
      onClick={(e) => {
        onClose?.();
        e.stopPropagation();
      }}
    >
      <SpriteAnimator
        sprite="/message.webp"
        width={1280}
        height={676}
        shouldAnimate={true}
        fps={8}
        scale={2}
        direction="vertical"
        stopLastFrame={true}
        onEnd={() => setIsEnded(true)}
      />
      <WithFade isVisible={isEnded}>
        <StyledMessageNumber>#{message.number}</StyledMessageNumber>
        <StyledMessageText
          $isEnglish={isEnglish}
          $isHorcicky={message.who !== 'You'}
          $paper={message.who === 'You' ? message.paper : null}
        >
          {message.text}
        </StyledMessageText>
      </WithFade>
    </StyledMessage>
  );
};

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogContainer = styled(WithFade)`
  position: absolute;
  height: 200px;
  max-width: 80vw;
  min-width: 500px;
  z-index: 1;

  left: 40px;
  bottom: 40px;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    bottom: 20px;
    left: 20px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  border: none;
  top: -10px;
  right: -35px;
  cursor: pointer;
  background: none;
  opacity: 0.5;
  color: #342003;
  transition: opacity 500ms;
  &:hover {
    opacity: 1;
  }
`;

const SendMessageView = ({
  onSend,
  onClose,
  canSendConfidentialMessages = false,
}) => {
  const [text, setText] = useState('');
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isConfidential, setIsConfidential] = useState(false);
  const paper = useMemo(() => 1 + Math.round(Math.random() * (PAPERS - 1)), []);

  return (
    <StyledMessageSender onClick={(e) => e.stopPropagation()}>
      <SpriteAnimator
        sprite="/reply.webp"
        width={1280}
        height={676}
        shouldAnimate={shouldAnimate}
        fps={12}
        scale={2}
        onLoad={() => setIsLoaded(true)}
        direction="vertical"
        onEnd={() => onClose?.()}
        stopLastFrame={true}
      />
      {!isClosing && (
        <WithFade isVisible={isLoaded}>
          <Controls>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsClosing(true);
                onSend(text, isConfidential, paper);
                setText('');
                setIsLoaded(false);
                setShouldAnimate(true);
              }}
            >
              <MessageInput
                $paper={paper}
                value={text}
                autoFocus={true}
                onInput={(e) => setText(e.target.value)}
              />
              <Footer>
                <Button disabled={text.trim().length === 0}>Write</Button>
                <WithFade isVisible={canSendConfidentialMessages}>
                  <Label>
                    <input
                      type="checkbox"
                      value={isConfidential}
                      onChange={(e) => setIsConfidential(e.target.checked)}
                    />
                    Confidential
                  </Label>
                </WithFade>
              </Footer>
            </form>
            <CloseButton
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              X
            </CloseButton>
          </Controls>
        </WithFade>
      )}
    </StyledMessageSender>
  );
};

export const Argia = () => {
  const [isRoomLoaded, setIsRoomLoaded] = useState(false);
  const [isMusic, setIsMusic] = useState(false);
  const [isPresent, setIsPresent] = useState(false);
  const [hasMessageInput, setHasMessageInput] = useState(false);
  const [hasLog, setHasLog] = useState(false);
  const [isShowLog, setIsShowLog] = useState(false);
  const [isPhotoGone, setIsPhotoGone] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showMessage, setShowMessage] = useState(null);
  const [showSendMessage, setShowSendMessage] = useState(false);
  const tsLastVisit = useMemo(() => Date.now(), []);
  const { isAudioInitialized, playAudio, initializeAudio } = useAudioPlayer();
  const [stopAudio, setStopAudio] = useState(null);
  const languageData = useLanguage();
  const { isEnglish } = languageData;

  const [canSendConfidentialMessages, setCanSendConfidentialMessages] =
    useState(false);

  const sendMessage = async (text, isConfidential, paper) => {
    await fetch('/say', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        paper,
        isConfidential,
      }),
    });
  };

  const markRead = async (id) => {
    await fetch(`/read/${id}`, {
      method: 'POST',
    });
  };

  const updateLog = async () => {
    const response = await fetch('/log');
    const messages = await response.json();
    setMessages(messages);
  };

  const updateInventory = async () => {
    const response = await fetch('/inventory');
    if (!response.ok) {
      return;
    }
    const json = await response.json();
    setIsPresent(!!json[SETTINGS_PRESENT]);
    setIsMusic(!!json[SETTINGS_MUSIC]);
    setHasMessageInput(!!json[INVENTORY_MESSAGE]);
    setHasLog(!!json[INVENTORY_LOG]);
    setCanSendConfidentialMessages(!!json[SETTINGS_CONFIDENTIAL]);
    setIsPhotoGone(!!json[SETTINGS_PHOTO_GONE]);
  };

  useEffect(() => {
    updateInventory();
    updateLog();
  }, []);

  useEffect(() => {
    const socket = io();
    socket.on('argia-message', (message) => {
      setMessages((m) => [...m, message]);
    });
    socket.on('argia-update', () => {
      updateInventory();
    });
    socket.on('argia-delete', () => {
      updateLog();
    });
    socket.on('argia-read', () => {
      updateLog();
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    async () => {
      if (!isAudioInitialized) {
        return;
      }
      if (!isMusic && stopAudio) {
        stopAudio.fn.fade(5);
        setStopAudio(null);
      }
      if (isMusic && !stopAudio) {
        setStopAudio({
          fn: await playAudio('/horcicky.mp3', {
            loop: true,
            volume: 0.1,
          }),
        });
      }
    };
  }, [isAudioInitialized, isMusic, stopAudio]);

  const crumple = () => {
    if (isAudioInitialized) {
      playAudio('/crumple.mp3', { volume: 0.005 });
    }
  };

  return (
    <LanguageContext.Provider value={languageData}>
      <GodSettings
        city="Argia"
        triggerSettings={{ background: '#221918', fill: '#d4b064' }}
      />
      <Wrapper
        onClick={() => {
          setShowMessage(null);
          setShowSendMessage(false);
          initializeAudio();
        }}
      >
        <ScalableContainer
          width={3818}
          height={2545}
          isCenter={true}
          isCover={false}
        >
          <FadeImage
            src={isPhotoGone ? '/argia.webp' : '/argia.jpg'}
            width="100%"
            dimTo={1}
            onComplete={() => setIsRoomLoaded(true)}
          />

          {hasMessageInput && (
            <Orb
              onClick={(e) => {
                e.stopPropagation();
                initializeAudio();
                setShowMessage(null);
                setShowSendMessage(true);
              }}
            />
          )}

          {hasLog && messages.length > 0 && (
            <Frame
              $isPhotoGone={isPhotoGone}
              onClick={(e) => {
                e.stopPropagation();
                initializeAudio();
                setIsShowLog(!isShowLog);
              }}
            />
          )}

          {isRoomLoaded && (
            <>
              <Sprite src="/horcicky.webp" dimTo={isPresent ? 1 : 0.3} />
              {messages.map((message, i) => (
                <CrumbledPaper
                  key={message.id}
                  message={message}
                  number={i + 1}
                  onRead={(read) => {
                    initializeAudio();
                    if (!showMessage) {
                      crumple();
                    }
                    setShowSendMessage(false);
                    setShowMessage(read);
                    if (read.who !== 'You' && !read.isRead) {
                      markRead(read.id);
                    }
                  }}
                />
              ))}
            </>
          )}
        </ScalableContainer>
        <WithFade
          isVisible={showSendMessage}
          fadeDuration={showSendMessage ? 2000 : 200}
        >
          <SendMessageView
            canSendConfidentialMessages={canSendConfidentialMessages}
            onClose={() => setShowSendMessage(false)}
            onSend={(text, isConfidential, paper) => {
              sendMessage(text, isConfidential, paper);
              crumple();
            }}
          />
        </WithFade>
        {showMessage && (
          <MessageView
            isEnglish={isEnglish}
            message={showMessage}
            onClose={() => setShowMessage(null)}
          />
        )}
        <LogContainer isVisible={isShowLog}>
          <Log messages={messages} tsLastVisit={tsLastVisit} />
        </LogContainer>
      </Wrapper>
    </LanguageContext.Provider>
  );
};
