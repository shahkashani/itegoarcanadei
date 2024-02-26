import styled, { css } from 'styled-components';
import { useEffect, useMemo, useRef, useState } from 'react';

import { BREAKPOINT_SMALL } from '../../../styles/variables';
import { getFilteredDialog } from '../../../utils/getFilteredDialog';
import { playLine } from '../DialogAudio';
import { useAudioPlayer } from '../../../hooks/useAudioPlayer';
import { useTimeout } from '../../../hooks/useTimeout';
import { useWindowSize } from '../../../hooks/useWindowSize';

const PER_WORD_DELAY = 400;
const MAX_DELAY = 10000;
const MIN_DELAY = 2500;
const PLAY_AUDIO = true;

const StyledText = styled.div`
  text-align: center;
  text-shadow: 1px 1px rgba(0, 0, 0, 0.8);
  position: fixed;
  color: #edead3;
  max-width: 200px;
  font-size: 1.4rem;
  line-height: 1.5;
  padding: 10px;
  user-select: none;
  margin-bottom: 10px;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    font-size: 1rem;
    padding: 5px;
    margin-bottom: 5px;
  }

  ${({ $speakingCharacter }) =>
    $speakingCharacter === 'you' &&
    css`
      color: #efdf74;
    `};
`;

export const DialogTextLine = ({
  character,
  text,
  pronunciations,
  additionalAudio,
  additionalAudioVolume,
  refs,
  onDone,
  onSpoken,
  flipDialog,
  volume,
}) => {
  const popoverRef = useRef();
  const [popoverHeight, setPopoverHeight] = useState(0);
  const [popoverWidth, setPopoverWidth] = useState(0);
  const [targetX, setTargetX] = useState(-100000);
  const [targetY, setTargetY] = useState(-100000);
  const [targetWidth, setTargetWidth] = useState(0);
  const [targetHeight, setTargetHeight] = useState(0);
  const { width } = useWindowSize();
  const { playAudio } = useAudioPlayer();

  const delay = useMemo(
    () =>
      Math.min(
        MAX_DELAY,
        Math.max(MIN_DELAY, (text || '').split(/\s/).length * PER_WORD_DELAY)
      ),
    [text]
  );

  const left = useMemo(() => {
    const x = targetX - (popoverWidth - targetWidth) / 2;
    if (x + targetWidth > width) {
      return width - targetWidth;
    }
    return Math.max(0, x);
  }, [targetX, popoverWidth]);

  const top = useMemo(() => {
    return flipDialog ? targetY + targetHeight : targetY - popoverHeight;
  }, [targetY, flipDialog, targetHeight, popoverHeight]);

  useEffect(() => {
    if (!popoverRef.current) {
      return;
    }
    const { current } = popoverRef;
    const { width, height } = current.getBoundingClientRect();
    setPopoverWidth(width);
    setPopoverHeight(height);
  }, [popoverRef.current, width]);

  useEffect(() => {
    if (!character || !refs[character] || !refs[character].current) {
      return;
    }
    const ref = refs[character];
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    setTargetX(left);
    setTargetY(top);
    setTargetHeight(height);
    setTargetWidth(width);
  }, [refs.current, character, width]);

  if (PLAY_AUDIO) {
    useEffect(() => {
      playLine(
        {
          character,
          text,
          pronunciations,
          additionalAudio,
          additionalAudioVolume,
          playAudio,
        },
        delay,
        () => {
          onDone();
        },
        {
          volume: volume || 1,
        }
      );
    }, [text, character]);
  } else {
    useTimeout(() => onDone(), delay);
  }

  useEffect(() => {
    onSpoken?.({ text, character });
  }, [text, character]);

  const styles = flipDialog ? { transform: 'rotate(180deg)' } : {};

  return (
    <StyledText
      ref={popoverRef}
      $speakingCharacter={character}
      style={{
        left,
        top,
        ...styles,
      }}
    >
      {text}
    </StyledText>
  );
};

export const DialogBlock = ({
  config,
  refs,
  flipDialog,
  onDone,
  onSpoken,
  volume,
}) => {
  const { text, pronunciations, character, pauseAfter } = config;
  const [lineIndex, setLineIndex] = useState(0);
  const lines = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
  const numLines = useMemo(() => lines.length, [lines]);
  const line = useMemo(() => lines[lineIndex], [lineIndex]);
  const additionalAudio =
    lineIndex === 0 && config.audioBefore ? config.audioBefore : null;
  const additionalAudioVolume =
    lineIndex === 0 && config.audioVolume ? config.audioVolume : null;

  const onLineDone = () => {
    if (lineIndex < numLines - 1) {
      setLineIndex((index) => index + 1);
    } else {
      if (pauseAfter) {
        setLineIndex(undefined);
        setTimeout(() => onDone?.(), pauseAfter);
      } else {
        onDone?.();
      }
    }
  };

  if (!Number.isFinite(lineIndex)) {
    return null;
  }

  return (
    <DialogTextLine
      onSpoken={onSpoken}
      flipDialog={flipDialog}
      key={`line-${lineIndex}`}
      character={character}
      text={line}
      pronunciations={pronunciations}
      additionalAudio={additionalAudio}
      additionalAudioVolume={additionalAudioVolume}
      refs={refs}
      onDone={onLineDone}
      volume={volume}
    />
  );
};

export const DialogText = ({
  config,
  state,
  refs,
  onDone,
  onSeen,
  onEffect,
  onInventory,
  flipDialog,
  volume,
  onSpoken,
}) => {
  const filteredConfig = useMemo(
    () => getFilteredDialog(config, state),
    [config, state]
  );
  const [blockIndex, setBlockIndex] = useState(0);
  const block = useMemo(() => filteredConfig[blockIndex], [blockIndex]);
  const numBlocks = useMemo(() => filteredConfig.length, [filteredConfig]);

  const onBlockDone = () => {
    if (block.effects) {
      onEffect?.(block.effects);
    }
    if (block.inventory) {
      onInventory?.(block.inventory);
    }
    if (block.once) {
      onSeen?.(block);
    }
    if (blockIndex < numBlocks - 1) {
      setBlockIndex((index) => index + 1);
    } else {
      onDone?.();
    }
  };

  return (
    <>
      {block && (
        <DialogBlock
          onSpoken={onSpoken}
          flipDialog={flipDialog}
          volume={volume}
          key={`block-${blockIndex}`}
          config={block}
          onDone={onBlockDone}
          onEffect={onEffect}
          refs={refs}
        />
      )}
    </>
  );
};
