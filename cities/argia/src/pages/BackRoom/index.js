import {
  BREAKPOINT_MEDIUM,
  FullPageImage,
  useAudioPlayer,
} from '@itegoarcanadei/client-shared';
import {
  INVENTORY_LOG,
  INVENTORY_MESSAGE,
  SETTINGS_CONFIDENTIAL,
  SETTINGS_MUSIC,
  SETTINGS_PHOTO_GONE,
  SETTINGS_PRESENT,
} from '../../components/types';
import styled, { css } from 'styled-components';
import { useEffect, useMemo, useState } from 'react';

import { Log } from '../../components/Log';

const MessageInput = styled.input`
  padding: 10px 20px;
  font-size: 1.5rem;
  letter-spacing: 1px;
  border: 0;
  border-radius: 25px;
  box-sizing: border-box;
  transition: background-color 1000ms;

  background: rgba(19, 9, 2, 0.8);
  color: #c8b7ab;

  &::placeholder {
    color: #5f4939;
  }

  &:focus {
    outline: none;
    background: rgba(19, 9, 2);
  }

  &:read-only {
    opacity: 0.5;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Settings = styled.div`
  position: absolute;
  top: 50px;
  left: 50px;
  padding: 20px;
  background: var(--lightest-accent);
  color: var(--dark-accent);
  border-radius: 10px;
  min-width: 200px;
`;

const Row = styled.label`
  display: flex;
  gap: 5px;

  ${({ $padded }) =>
    $padded &&
    css`
      margin-top: 10px;
    `};
`;

const Panels = styled.div`
  display: flex;
  gap: 20px;
  width: 90%;
  box-sizing: border-box;

  @media (max-width: ${BREAKPOINT_MEDIUM}px) {
    width: 100%;
    flex-direction: column;
  }
`;

const PanelContainer = styled.div`
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
`;

const Form = styled.form`
  margin-top: 20px;
`;

const Visitors = styled.div`
  display: flex;
  font-size: 1.5rem;
  justify-content: center;
  align-items: center;
  top: 50px;
  right: 50px;
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 100%;
  background: var(--dark-accent);
  color: var(--lighter-accent);
`;

const MessageInputWrapper = styled.div`
  padding: 2px;
  border: 2px solid transparent;
  border-radius: 27px;

  ${({ $isActive }) =>
    $isActive &&
    css`
      border-color: var(--lightest-accent);
    `}
`;

const ToggleButton = styled.button`
  float: right;
`;

export const Panel = ({
  character,
  logUrl,
  lastMessageTime,
  characterName,
  onMessageSend,
  tsLastVisit,
  isInputActive,
}) => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const getMessages = async () => {
    const result = await fetch(logUrl);
    const json = await result.json();
    setMessages(json);
  };

  useEffect(() => {
    getMessages();
  }, [lastMessageTime]);

  const onDelete = async (id) => {
    await fetch(`/message/${id}`, { method: 'DELETE' });
  };

  const sendMessage = async () => {
    if (!text) {
      return;
    }
    setIsSending(true);
    const result = await fetch('/backroom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        character,
      }),
    });
    setIsSending(false);
    if (result.ok) {
      setText('');
      onMessageSend?.();
    }
  };

  return (
    <PanelContainer>
      <div style={{ height: 300 }}>
        <Log
          canDelete={true}
          onDelete={onDelete}
          tsLastVisit={tsLastVisit}
          youLabel="Them"
          messages={messages}
          hideUnread={false}
        />
      </div>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <MessageInputWrapper $isActive={isInputActive}>
          <MessageInput
            style={{ width: '100%' }}
            readOnly={isSending}
            type="text"
            value={text}
            placeholder={characterName}
            onInput={(e) => setText(e.target.value)}
          />
        </MessageInputWrapper>
      </Form>
    </PanelContainer>
  );
};

export const BackRoom = () => {
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);
  const [isShowMessageButton, setIsShowMessageButton] = useState(false);
  const [isShowLogButton, setIsShowLogButton] = useState(false);
  const [isPresent, setIsPresent] = useState(false);
  const [isMusic, setIsMusic] = useState(false);
  const [isPhotoGone, setIsPhotoGone] = useState(false);
  const [isShowSettings, setIsShowSettings] = useState(true);
  const [canSendConfidentialMessages, setCanSendConfidentialMessages] =
    useState(false);
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const [numVisitors, setNumVisitors] = useState(0);
  const tsLastVisit = useMemo(() => Date.now(), []);
  const { initializeAudio, playAudio } = useAudioPlayer();

  const updateSettings = async () => {
    const response = await fetch('/settings');
    if (!response.ok) {
      return;
    }
    const json = await response.json();
    setIsShowMessageButton(json[INVENTORY_MESSAGE]);
    setIsShowLogButton(json[INVENTORY_LOG]);
    setIsPresent(json[SETTINGS_PRESENT]);
    setIsMusic(json[SETTINGS_MUSIC]);
    setIsPhotoGone(json[SETTINGS_PHOTO_GONE]);
    setCanSendConfidentialMessages(json[SETTINGS_CONFIDENTIAL]);
    setIsSettingsLoaded(true);
  };

  useEffect(() => {
    updateSettings();
    const socket = io();
    socket.on('argia-update', () => {
      updateSettings();
    });
    socket.on('argia-hello', ({ num }) => {
      setNumVisitors(num - 1);
    });
    socket.on('argia-message', (message) => {
      if (message.file) {
        playAudio(message.file, { volume: 0.3 });
      }
      setLastMessageTime(Date.now());
    });
    socket.on('argia-read', () => {
      setLastMessageTime(Date.now());
    });
    socket.on('argia-delete', () => {
      setLastMessageTime(Date.now());
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const updateSetting = async (setting, value) => {
    const method = value === false ? 'DELETE' : 'POST';
    const body =
      typeof value === 'string'
        ? JSON.stringify({
            value,
          })
        : undefined;

    await fetch(`/setting/${setting}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });
  };

  const onMessageSend = () => setLastMessageTime(Date.now());

  const toggleMessageButton = () =>
    updateSetting(INVENTORY_MESSAGE, !isShowMessageButton);

  const toggleLogButton = () => updateSetting(INVENTORY_LOG, !isShowLogButton);

  const toggleIsMusic = () => updateSetting(SETTINGS_MUSIC, !isMusic);

  const toggleIsPresent = () => updateSetting(SETTINGS_PRESENT, !isPresent);

  const toggleIsPhotoGone = () =>
    updateSetting(SETTINGS_PHOTO_GONE, !isPhotoGone);

  const toggleCanSendConfidentialMessages = () =>
    updateSetting(SETTINGS_CONFIDENTIAL, !canSendConfidentialMessages);

  return (
    <Wrapper onClick={() => initializeAudio()}>
      <FullPageImage align="top" src={'/argia.jpg'} opacity={1} />
      <Visitors>{numVisitors}</Visitors>
      {isSettingsLoaded && (
        <Settings>
          <ToggleButton onClick={() => setIsShowSettings(!isShowSettings)}>
            {isShowSettings ? '-' : '+'}
          </ToggleButton>
          {isShowSettings && (
            <>
              <Row>
                <input
                  type="checkbox"
                  onChange={() => toggleIsPresent()}
                  checked={isPresent}
                />
                <div>Is Hořčický present?</div>
              </Row>
              <Row>
                <input
                  type="checkbox"
                  onChange={() => toggleMessageButton()}
                  checked={isShowMessageButton}
                />
                <div>Show message button</div>
              </Row>
              <Row>
                <input
                  type="checkbox"
                  onChange={() => toggleLogButton()}
                  checked={isShowLogButton}
                />
                <div>Show log button</div>
              </Row>
              <Row>
                <input
                  type="checkbox"
                  onChange={() => toggleCanSendConfidentialMessages()}
                  checked={canSendConfidentialMessages}
                />
                <div>Can send confidential messages</div>
              </Row>
              <Row>
                <input
                  type="checkbox"
                  onChange={() => toggleIsMusic()}
                  checked={isMusic}
                />
                <div>Is playing music</div>
              </Row>
              <Row>
                <input
                  type="checkbox"
                  onChange={() => toggleIsPhotoGone()}
                  checked={isPhotoGone}
                />
                <div>Is photo gone?</div>
              </Row>
            </>
          )}
        </Settings>
      )}

      <Panels>
        <Panel
          character="Horicky"
          characterName="Hořčický"
          logUrl="/backroom-log"
          lastMessageTime={lastMessageTime}
          onMessageSend={onMessageSend}
          tsLastVisit={tsLastVisit}
        />
      </Panels>
    </Wrapper>
  );
};
