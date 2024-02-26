import {
  BackdropContainer,
  getDialogId,
  useAudioPlayer,
} from '@itegoarcanadei/client-shared';

import { CloseIcon } from '../../icons/CloseIcon';
import { EarIcon } from '../../icons/EarIcon';
import { TranscriptIcon } from '../../icons/TranscriptIcon';
import styled from 'styled-components';
import { useState } from 'react';

const ICON_COLOR = '#382b25';
const ICON_CONTAINER_COLOR = '#968166';

const TranscriptIconContainer = styled.button`
  border-radius: 100%;
  display: flex;
  border: 0;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  background: ${ICON_CONTAINER_COLOR};
  color: ${ICON_COLOR};
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
  width: 40px;
  height: 40px;
  padding: 10px;
  transition: background-color 500ms, opacity 500ms, color 500ms;
  position: fixed;
  top: 10px;
  right: 10px;

  svg {
    transition: fill 500ms;
  }

  &:not(:disabled) {
    cursor: pointer;
    &:hover {
      background: ${ICON_COLOR};
      color: ${ICON_CONTAINER_COLOR};
      svg {
        fill: ${ICON_CONTAINER_COLOR};
      }
    }
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const You = styled.span`
  color: #efdf74;
`;

const Them = styled.span`
  color: #888;
`;

const TranscriptContainer = styled.div`
  height: 100%;
  padding: 0 20px;
  overflow: auto;
  font-size: 1.3rem;
`;

const Play = styled.div`
  cursor: pointer;
  margin-left: 10px;
  display: inline-flex;
  font-size: 0.7rem;
  transition: opacity 500ms;
  opacity: 0.6;

  svg {
    fill: white;
  }

  &:hover {
    opacity: 1;
  }
`;

const Line = styled.p``;

const Separator = styled.hr`
  border: 1px solid #333;
`;

const Transcript = ({ transcript }) => {
  const { playAudio } = useAudioPlayer();

  const play = (line) => {
    const id = getDialogId(line);
    const mp3 = `/dialog/${id}.mp3`;
    playAudio(mp3);
  };

  return (
    <TranscriptContainer>
      {transcript.map((line, i) => {
        if (line.type === 'exit') {
          if (i === transcript.length - 1) {
            return null;
          }
          return <Separator />;
        }
        return (
          <Line>
            {line.character === 'you' ? (
              <You>{'You:'}</You>
            ) : (
              <Them>{'Them:'}</Them>
            )}
            &nbsp;&nbsp;{line.text}
            <Play onClick={() => play(line)}>
              <EarIcon width={16} />
            </Play>
          </Line>
        );
      })}
    </TranscriptContainer>
  );
};

export const TranscriptView = ({ transcript }) => {
  const [isShowing, setIsShowing] = useState(false);

  return (
    <>
      <TranscriptIconContainer onClick={() => setIsShowing(true)}>
        <TranscriptIcon fill={ICON_COLOR} width="100%" />
      </TranscriptIconContainer>
      {isShowing && (
        <BackdropContainer
          opacity={0.9}
          onDone={() => setIsShowing(false)}
          closeButton={
            <TranscriptIconContainer>
              <CloseIcon fill={ICON_COLOR} width="70%" />
            </TranscriptIconContainer>
          }
        >
          <Transcript transcript={transcript} />
        </BackdropContainer>
      )}
    </>
  );
};
