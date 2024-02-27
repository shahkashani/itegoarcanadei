import { createRef, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import { useAudioPlayer } from '@itegoarcanadei/client-shared';

const Container = styled.div`
  background: var(--light-accent);
  color: var(--lightest-accent);
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
  overflow-y: scroll;
  text-align: left;
  border-radius: 6px;
`;

const Who = styled.span`
  color: var(--accent);

  ${({ $isYou }) =>
    $isYou &&
    css`
      color: var(--lighter-accent);
    `}
`;

const Line = styled.p`
  padding: 0;
  margin: 0;
  line-height: 1.2;

  & + & {
    margin-top: 10px;
  }

  ${({ $isSeparator }) =>
    $isSeparator &&
    css`
      border-top: 1px solid var(--lightest-accent-50);
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

const LogLine = ({
  message,
  canDelete,
  onDelete,
  onPlayAudio,
  onClick,
  youLabel,
  isSeparator,
}) => {
  const { who, text, file, id } = message;
  const isPlayer = who === 'You';
  return (
    <Line $isSeparator={isSeparator}>
      <LineWrapper
        $canClick={!!file || onClick}
        onClick={() => {
          onClick?.(message);
          if (file) {
            onPlayAudio?.(file);
          }
        }}
      >
        <Who $isYou={isPlayer}>{isPlayer ? youLabel : who}:</Who>
        &nbsp;
        {text}
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
  onClick,
  isPlayAudio = true,
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
      {messages.map((message, i) => {
        const isNew = message.time > tsLastVisit;
        let isSeparator = false;
        if (isNew && !hasAddedSeparator) {
          hasAddedSeparator = true;
          isSeparator = true;
        }
        return (
          <LogLine
            onClick={(message) => onClick?.(message)}
            onPlayAudio={async (file) => {
              if (!isPlayAudio) {
                return;
              }
              if (stopAudio && stopAudio.fn) {
                stopAudio.fn.stop();
              }
              setStopAudio({
                fn: await playAudio(file, { volume: 0.5, stopFn: true }),
              });
            }}
            message={message}
            key={i}
            youLabel={youLabel}
            canDelete={canDelete}
            onDelete={onDelete}
            isSeparator={isSeparator && i > 0}
          />
        );
      })}
      <div ref={lastMessageRef} />
    </Container>
  );
};
