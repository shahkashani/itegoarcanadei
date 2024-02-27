import { createRef, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import { useAudioPlayer } from '@itegoarcanadei/client-shared';

const Container = styled.div`
  background: rgba(19, 9, 2, 0.8);
  color: #c8b7ab;
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
  overflow-y: scroll;
  text-align: left;
  border-radius: 6px;
`;

const Who = styled.span`
  color: #ffda78;

  ${({ $isYou }) =>
    $isYou &&
    css`
      color: #9a7861;
    `}
`;

const Line = styled.p`
  padding: 0;
  margin: 0;
  line-height: 1.5;

  & + & {
    margin-top: 10px;
  }

  ${({ $isSeparator }) =>
    $isSeparator &&
    css`
      border-top: 1px solid #9a7861;
      padding-top: 10px;
    `}

  ${({ $canClick }) =>
    $canClick &&
    css`
      cursor: pointer;
    `}
`;

const LineWrapper = styled.span`
  display: inline-block;

  ${({ $canClick }) =>
    $canClick &&
    css`
      cursor: pointer;
    `}
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  opacity: 0.3;

  &:hover {
    opacity: 1;
  }
`;

const Unread = styled.span`
  margin-left: 10px;
  opacity: 0.5;
  text-transform: uppercase;
`;

const LogLine = ({
  message,
  canDelete,
  onDelete,
  onPlayAudio,
  youLabel,
  hideUnread,
  isSeparator,
}) => {
  const { who, text, file, id, isRead } = message;
  const isPlayer = who === 'You';
  return (
    <Line $isSeparator={isSeparator}>
      <LineWrapper
        $canClick={!!file}
        onClick={() => {
          if (file) {
            onPlayAudio?.(file);
          }
        }}
      >
        <Who $isYou={isPlayer}>{isPlayer ? youLabel : who}:</Who>
        &nbsp;
        {text}
        {!hideUnread && !isRead && <Unread>unread</Unread>}
        {canDelete && (
          <DeleteButton
            onClick={(e) => {
              const answer = window.confirm(
                'Do you really want to delete this message?'
              );
              if (!answer) {
                return;
              }
              e.preventDefault();
              e.stopPropagation();
              onDelete?.(id);
            }}
          >
            x
          </DeleteButton>
        )}
      </LineWrapper>
    </Line>
  );
};

export const Log = ({
  tsLastVisit,
  messages,
  canDelete,
  onDelete,
  hideUnread = true,
  youLabel = 'You',
}) => {
  const lastMessageRef = createRef();
  const [stopAudio, setStopAudio] = useState(null);
  const { playAudio } = useAudioPlayer();

  useEffect(() => {
    lastMessageRef.current.scrollIntoView();
  }, [messages.length, lastMessageRef.current]);

  let hasAddedSeparator = false;

  return (
    <Container>
      {messages
        .filter((message) => (hideUnread ? message.isRead : true))
        .map((message, i) => {
          const isNew = message.time > tsLastVisit;
          let isSeparator = false;
          if (isNew && !hasAddedSeparator) {
            hasAddedSeparator = true;
            isSeparator = true;
          }
          return (
            <LogLine
              onPlayAudio={async (file) => {
                if (stopAudio && stopAudio.fn) {
                  stopAudio.fn.stop();
                }
                setStopAudio({
                  fn: await playAudio(file, { volume: 0.05, stopFn: true }),
                });
              }}
              message={message}
              key={i}
              youLabel={youLabel}
              canDelete={canDelete}
              onDelete={onDelete}
              hideUnread={hideUnread}
              isSeparator={isSeparator && i > 0}
            />
          );
        })}
      <div ref={lastMessageRef} />
    </Container>
  );
};
