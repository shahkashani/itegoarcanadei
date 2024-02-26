import { BREAKPOINT_MEDIUM, BREAKPOINT_SMALL } from '../../styles/variables';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { DialogChoices } from './DialogChoices';
import { DialogText } from './DialogText';
import styled from 'styled-components';

const START_SECTION = 'enter';
const END_SECTION = 'exit';

const Wrapper = styled.div`
  position: fixed;
  padding: 50px;
  bottom: 0;
  left: 0;
  right: 270px;

  @media (max-width: ${BREAKPOINT_MEDIUM}px) {
    padding: 35px;
    right: 200px;
  }

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    padding: 25px;
    right: 80px;
  }
`;

const getDialogFromChoice = (choice) => ({
  character: 'you',
  text: choice.text,
});

export const Dialog = ({
  config,
  state = {},
  volume = 0.5,
  onDialogStateChange,
  onDialogSeen,
  onDone,
  onSpoken,
  onInventory,
  flipDialog,
  refs,
}) => {
  const [section, setSection] = useState(START_SECTION);
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [isShowChoices, setIsShowChoices] = useState(false);
  const [isShowLastChoice, setIsShowLastChoice] = useState(false);

  const [lastChoice, setLastChoice] = useState(null);

  const sectionConfig = useMemo(() => config[section], [section]);
  const choices = useMemo(() => (config[section] || {}).choices, [section]);
  const dialog = useMemo(() => (config[section] || {}).dialog || [], [section]);

  useEffect(() => {
    if (section === END_SECTION) {
      setIsShowDialog(false);
      setIsShowChoices(false);
      onDone?.();
      return;
    }

    setIsShowChoices(false);
    setIsShowDialog(false);

    const sectionConfig = config[section];
    const { goto = null, dialog = [], choices = [] } = sectionConfig;

    if (dialog.length > 0) {
      setIsShowDialog(true);
    } else if (choices.length > 0) {
      setIsShowChoices(true);
    } else if (goto) {
      setSection(goto);
    }
  }, [section]);

  const onDialogDone = useCallback(() => {
    setIsShowDialog(false);
    if (sectionConfig.choices) {
      setIsShowChoices(true);
    } else if (sectionConfig.goto) {
      setSection(sectionConfig.goto);
    }
  }, [sectionConfig]);

  const onDialogSelect = (choice) => {
    setLastChoice(choice);
    setIsShowLastChoice(true);
    setIsShowDialog(false);
    setIsShowChoices(false);
  };

  const onLastChoiceDone = () => {
    setIsShowLastChoice(false);
    if (lastChoice.once) {
      onDialogSeen?.(lastChoice);
    }
    if (lastChoice.effects) {
      onDialogStateChange?.(lastChoice.effects);
    }
    if (lastChoice.inventory) {
      onInventory?.(lastChoice.inventory);
    }
    if (lastChoice.goto) {
      setSection(lastChoice.goto);
    }
    setLastChoice(null);
  };

  if (section === END_SECTION) {
    return null;
  }

  return (
    <Wrapper>
      {isShowLastChoice && (
        <DialogText
          onSpoken={onSpoken}
          refs={refs}
          flipDialog={flipDialog}
          config={[getDialogFromChoice(lastChoice)]}
          state={state}
          onDone={() => onLastChoiceDone()}
          volume={volume}
        />
      )}
      {isShowDialog && (
        <DialogText
          onSpoken={onSpoken}
          refs={refs}
          volume={volume}
          flipDialog={flipDialog}
          config={dialog}
          state={state}
          onDone={onDialogDone}
          onSeen={(config) => onDialogSeen?.(config)}
          onEffect={(effects) => onDialogStateChange?.(effects)}
          onInventory={(items) => onInventory?.(items)}
        />
      )}
      {isShowChoices && (
        <DialogChoices
          config={choices}
          state={state}
          onSelect={onDialogSelect}
        />
      )}
    </Wrapper>
  );
};
