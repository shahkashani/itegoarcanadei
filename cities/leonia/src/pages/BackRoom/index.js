import { BREAKPOINT_MEDIUM, FullPageImage } from '@itegoarcanadei/client-shared';
import {
  INVENTORY_LEFT_SHARD,
  INVENTORY_LOG,
  INVENTORY_MESSAGE,
  INVENTORY_RIGHT_SHARD,
  SETTINGS_CAN_GET_BOOK,
  SETTINGS_CAN_SEE_BOOK,
  SETTINGS_CAN_SEE_PORTAL,
  SETTINGS_END_HOUR,
  SETTINGS_OPEN_ON_STORE,
  SETTINGS_ROOM_COLOR,
  SETTINGS_SHADOWLAND,
  SETTINGS_START_HOUR,
  SETTINGS_TICK,
  SETTINGS_TRAVEL_FREELY,
  SETTINGS_UNAVAILABLE,
} from '../../components/types';
import styled, { css } from 'styled-components';
import { useEffect, useMemo, useState } from 'react';

import { Log } from '../../components/Log';
import { MessageInput } from '../Leonia';
import { Theme } from '../../components/Theme';

const CHARACTER_ADROGUE = 'Adrogué';
const CHARACTER_STORYKEEPER = 'Storykeeper';

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

const Yes = styled.span`
  color: green;
`;

const No = styled.span`
  color: red;
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

const TimePicker = (props) => {
  const values = useMemo(() => {
    const result = [];
    for (let i = 0; i < 24; i += 1) {
      result.push(i);
    }
    return result;
  }, []);
  return (
    <select {...props}>
      {values.map((value) => (
        <option key={value} value={value}>
          {value.toString().padStart(2, 0)}
        </option>
      ))}
    </select>
  );
};

export const BackRoom = () => {
  const [isRoomColor, setIsRoomColor] = useState(false);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);
  const [isShowMessageButton, setIsShowMessageButton] = useState(false);
  const [isShowLogButton, setIsShowLogButton] = useState(false);
  const [isShadowlandOpen, setIsShadowlandOpen] = useState(false);
  const [canTravelFreely, setCanTravelFreely] = useState(false);
  const [canSeeBook, setCanSeeBook] = useState(false);
  const [canGetBook, setCanGetBook] = useState(false);
  const [isOpenOnStore, setIsOpenOnStore] = useState(false);
  const [canSeePortal, setCanSeePortal] = useState(false);
  const [isClockTick, setIsClockTick] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [isShowAdrogueInput, setIsShowAdrogueInput] = useState(true);
  const [isShowStoryKeeperInput, setIsShowStoryKeeperInput] = useState(true);
  const [isShowSettings, setIsShowSettings] = useState(true);
  const [startHour, setStartHour] = useState(0);
  const [endHour, setEndHour] = useState(0);
  const [hasLeftShard, setHasLeftShard] = useState(false);
  const [hasRightShard, setHasRightShard] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const [numVisitors, setNumVisitors] = useState(0);
  const tsLastVisit = useMemo(() => Date.now(), []);

  const updateSettings = async () => {
    const response = await fetch('/settings');
    if (!response.ok) {
      return;
    }
    const json = await response.json();
    setIsShadowlandOpen(json[SETTINGS_SHADOWLAND]);
    setIsShowMessageButton(json[INVENTORY_MESSAGE]);
    setIsShowLogButton(json[INVENTORY_LOG]);
    setHasLeftShard(json[INVENTORY_LEFT_SHARD]);
    setHasRightShard(json[INVENTORY_RIGHT_SHARD]);
    setCanTravelFreely(json[SETTINGS_TRAVEL_FREELY]);
    setStartHour(json[SETTINGS_START_HOUR]);
    setEndHour(json[SETTINGS_END_HOUR]);
    setIsRoomColor(json[SETTINGS_ROOM_COLOR]);
    setCanSeeBook(json[SETTINGS_CAN_SEE_BOOK]);
    setCanGetBook(json[SETTINGS_CAN_GET_BOOK]);
    setIsOpenOnStore(json[SETTINGS_OPEN_ON_STORE]);
    setCanSeePortal(json[SETTINGS_CAN_SEE_PORTAL]);
    setIsClockTick(json[SETTINGS_TICK]);
    setIsUnavailable(json[SETTINGS_UNAVAILABLE]);
    setIsSettingsLoaded(true);
  };

  useEffect(() => {
    updateSettings();
    const socket = io();
    socket.on('update', () => {
      updateSettings();
    });
    socket.on('hello', ({ num }) => {
      setNumVisitors(num - 1);
    });
    socket.on('message', ({ file }) => {
      setLastMessageTime(Date.now());
    });
    socket.on('delete', () => {
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

  const toggleShadowland = () =>
    updateSetting(SETTINGS_SHADOWLAND, !isShadowlandOpen);

  const toggleTravelFreely = () =>
    updateSetting(SETTINGS_TRAVEL_FREELY, !canTravelFreely);

  const toggleCanGetBook = () =>
    updateSetting(SETTINGS_CAN_GET_BOOK, !canGetBook);

  const toggleCanSeeBook = () =>
    updateSetting(SETTINGS_CAN_SEE_BOOK, !canSeeBook);

  const toggleCanSeePortal = () =>
    updateSetting(SETTINGS_CAN_SEE_PORTAL, !canSeePortal);

  const toggleIsOpenOnstore = () =>
    updateSetting(SETTINGS_OPEN_ON_STORE, !isOpenOnStore);

  const toggleIsClockTick = () => updateSetting(SETTINGS_TICK, !isClockTick);

  const toggleIsUnavailable = () =>
    updateSetting(SETTINGS_UNAVAILABLE, !isUnavailable);

  const toggleIsRoomColor = () => {
    const result = window.confirm('Are you sure you want to update this?');
    if (result) {
      updateSetting(SETTINGS_ROOM_COLOR, !isRoomColor);
    }
  };

  return (
    <Wrapper>
      <Theme isColor={isRoomColor} />
      <FullPageImage
        align="top"
        src={isRoomColor ? '/nouvelle-leonie.webp' : '/leonia.webp'}
        opacity={1}
      />
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
                  onChange={() => toggleShadowland()}
                  checked={isShadowlandOpen}
                />
                <div>Is shadowland gate open?</div>
              </Row>
              <Row>
                <input
                  type="checkbox"
                  onChange={() => toggleIsClockTick()}
                  checked={isClockTick}
                />
                <div>Does clock tick?</div>
              </Row>
              <Row>
                <input
                  type="checkbox"
                  onChange={() => toggleIsUnavailable()}
                  checked={isUnavailable}
                />
                <div>Is unavailable?</div>
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
                  onChange={() => toggleTravelFreely()}
                  checked={canTravelFreely}
                />
                <div>Can travel freely</div>
              </Row>
              <Row>
                <input
                  type="checkbox"
                  onChange={() => toggleIsRoomColor()}
                  checked={isRoomColor}
                />
                <div>Is Storykeeper present?</div>
              </Row>
              <Row>
                <input
                  type="checkbox"
                  onChange={() => toggleCanSeeBook()}
                  checked={canSeeBook}
                />
                <div>Can see Euphemia book?</div>
              </Row>
              <Row>
                <input
                  type="checkbox"
                  disabled={!canSeeBook}
                  onChange={() => toggleCanGetBook()}
                  checked={canGetBook}
                />
                <div>Can get Euphemia book?</div>
              </Row>
              <Row>
                <input
                  type="checkbox"
                  onChange={() => toggleCanSeePortal()}
                  checked={canSeePortal}
                />
                <div>Can leave Leonia?</div>
              </Row>
              <Row>
                <input
                  type="checkbox"
                  onChange={() => toggleIsOpenOnstore()}
                  checked={isOpenOnStore}
                />
                <div>Skip Leonia intro?</div>
              </Row>
              <Row>
                <input
                  type="checkbox"
                  onChange={() =>
                    setIsShowStoryKeeperInput(!isShowStoryKeeperInput)
                  }
                  checked={isShowStoryKeeperInput}
                />
                <div>Show StoryKeeper input?</div>
              </Row>

              <Row>
                <input
                  type="checkbox"
                  onChange={() => setIsShowAdrogueInput(!isShowAdrogueInput)}
                  checked={isShowAdrogueInput}
                />
                <div>Show Adrogue input?</div>
              </Row>

              <Row $padded>
                <TimePicker
                  value={startHour}
                  onChange={(e) =>
                    updateSetting(SETTINGS_START_HOUR, e.target.value)
                  }
                />
                <TimePicker
                  value={endHour}
                  onChange={(e) =>
                    updateSetting(SETTINGS_END_HOUR, e.target.value)
                  }
                />
              </Row>
              <Row $padded>
                <button onClick={() => updateSetting('input', true)}>
                  Show message input
                </button>
                <button onClick={() => updateSetting('input', false)}>
                  Hide message input
                </button>
              </Row>
              {!(hasLeftShard && hasRightShard) && (
                <Row $padded>
                  Has Valdrada shard:&nbsp;
                  {hasLeftShard ? <Yes>yes</Yes> : <No>no</No>}
                </Row>
              )}
              {!(hasLeftShard && hasRightShard) && (
                <Row>
                  Has Adardlav shard:&nbsp;
                  {hasRightShard ? <Yes>yes</Yes> : <No>no</No>}
                </Row>
              )}
            </>
          )}
        </Settings>
      )}

      <Panels>
        {isShowAdrogueInput && (
          <Panel
            character={CHARACTER_ADROGUE}
            characterName="Adrogué"
            logUrl="/log"
            lastMessageTime={lastMessageTime}
            onMessageSend={onMessageSend}
            tsLastVisit={tsLastVisit}
            isInputActive={!isRoomColor}
          />
        )}
        {isShowStoryKeeperInput && (
          <Panel
            character={CHARACTER_STORYKEEPER}
            characterName="Storykeeper"
            logUrl="/log/storykeeper"
            lastMessageTime={lastMessageTime}
            onMessageSend={onMessageSend}
            tsLastVisit={tsLastVisit}
            isInputActive={isRoomColor}
          />
        )}
      </Panels>
    </Wrapper>
  );
};
