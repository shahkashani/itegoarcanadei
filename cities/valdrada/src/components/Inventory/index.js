import {
  BREAKPOINT_MEDIUM,
  BREAKPOINT_SMALL,
  FadeImage,
  LeftShardIcon,
} from '@itegoarcanadei/client-shared';
import { INVENTORY_BOOK, INVENTORY_MAP } from '../../pages/Valdrada/types';
import styled, { css, keyframes } from 'styled-components';
import { useEffect, useMemo, useState } from 'react';

import { BookIcon } from '../../icons/BookIcon';
import { CloseIcon } from '../../icons/CloseIcon';
import { INVENTORY_SHARD } from '../../pages/ShadowValdrada/types';
import { LineIcon } from '../../icons/LineIcon';
import { MapIcon } from '../../icons/MapIcon';
import { WingIcon } from '../../icons/WingIcon';

const ICON_COLOR = '#382b25';
const ICON_CONTAINER_COLOR = '#968166';

const fade = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const ThumbnailWrapper = styled.div`
  animation: ${fade} 2000ms both;
`;

const Thumbnail = styled.button`
  border-radius: 100%;
  display: flex;
  border: 0;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  background: ${ICON_CONTAINER_COLOR};
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
  width: 90px;
  height: 90px;
  padding: 20px;
  transition: background-color 500ms, opacity 500ms;

  svg {
    transition: fill 500ms;
  }

  &:not(:disabled) {
    cursor: pointer;
    &:hover {
      background: ${ICON_COLOR};
      svg {
        fill: ${ICON_CONTAINER_COLOR};
      }
    }
  }

  &:disabled {
    opacity: 0.5;
  }

  @media (max-width: ${BREAKPOINT_MEDIUM}px) {
    width: 70px;
    height: 70px;
    padding: 15px;
  }

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    width: 50px;
    height: 50px;
    padding: 10px;
  }
`;

const InventoryWrapper = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  margin: 50px;
  display: flex;
  gap: 20px;

  @media (max-width: ${BREAKPOINT_MEDIUM}px) {
    margin: 25px;
    gap: 15px;
  }

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    margin: 10px;
    gap: 10px;
    flex-direction: column;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  height: -webkit-fill-available;
  background: ${({ fillOpacity = 0.8 }) => `rgba(0, 0, 0, ${fillOpacity});`};
  animation: ${fade} 350ms both;
  z-index: 4;
`;

const BackdropChildren = styled.div`
  padding: ${({ $backdropPadding = 20 }) => `${$backdropPadding}px;`};
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const InventoryMapImage = styled(FadeImage).attrs({
  startDelay: 50,
})`
  max-width: 100%;
  max-height: 100%;
`;

const InventoryBookImage = styled(FadeImage).attrs({
  startDelay: 50,
})`
  max-width: 100%;
  max-height: 100%;
  box-shadow: 0 0 20px black;
  background: black;
  padding: 2px;
  border-radius: 10px;
  align-self: end;
`;

const InventoryBookContainer = styled.div`
  display: grid;
  grid-gap: 30px;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  width: 100%;
  max-width: 1080px;
  grid-template-rows: minmax(100px, 1fr) max-content;
  text-align: center;
  justify-items: center;
  margin: 0 auto;
`;

const CloseButton = styled.button`
  cursor: pointer;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  background: ${ICON_COLOR};
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
  width: 40px;
  height: 40px;
  padding: 10px;
  position: fixed;
  top: 10px;
  right: 10px;
  transition: opacity 500ms;
  opacity: 0.7;
  border: 0;

  &:hover {
    opacity: 1;
  }
`;

const BookText = styled.div`
  color: #d9d5c9;
  font-size: 1.5rem;
  margin-bottom: 40px;
`;

const FormButton = styled.button`
  display: inline-flex;
  gap: 10px;
  border: 0;
  ${({ $isFilled = true }) =>
    $isFilled
      ? css`
          background: #211b18;
        `
      : css`
          background: none;
        `};
  color: #827f76;
  padding: 15px 20px;
  border-radius: 50px;
  font-size: 1rem;
  align-items: center;
  transition: all 250ms;
  white-space: nowrap;

  &:not(:disabled) {
    cursor: pointer;
  }

  &:disabled {
    opacity: 0.5;
  }

  ${({ isFilled = true }) =>
    isFilled
      ? css`
          &:not(:disabled) {
            &:hover {
              background: #2b221e;
              color: #afaca5;
            }

            &:active {
              background: #211b18;
              color: #99978f;
            }
          }
        `
      : css`
          &:not(:disabled) {
            &:hover {
              color: #afaca5;
            }

            &:active {
              color: #99978f;
            }
          }
        `};

  svg {
    fill: currentColor;
  }
`;

const SendWrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

const SendButton = styled.button`
  background: none;
  border: 0;
  display: inline-flex;
  flex-direction: column;
  gap: 10px;
  color: #827f76;
  font-size: 1rem;
  align-items: center;
  cursor: pointer;
  transition: color 250ms;

  &:hover {
    color: #afaca5;
  }

  &:active {
    color: #99978f;
  }

  svg {
    fill: currentColor;
  }
`;

const Textarea = styled.textarea`
  resize: none;
  border: none;
  width: 100%;
  max-width: 350px;
  aspect-ratio: 585/359;
  padding: 30px;
  margin-bottom: 15px;
  box-sizing: border-box;
  background: #d9d5c9;
  font-family: MisterK, Arial, Helvetica, sans-serif;
  line-height: 1.1;
  font-size: 2.4rem;
  background: url('/static/envelope.png') no-repeat center center;
  background-size: 100% auto;
  transform: rotate(-1deg);
  color: #4f251a;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    font-size: 1rem;
  }

  &::placeholder {
    color: #7f5d44;
  }

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border: 0;
    padding: 0;
  }

  &::-webkit-scrollbar-thumb {
    background: #901708;
    border: 0;
    padding: 0;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
`;

const BookContentContainer = styled.div`
  width: 100%;
`;

const WingWrapper = styled.div`
  display: inline-flex;
  align-items: flex-start;
  gap: 2px;
`;

const Hacker = styled.div`
  font-size: 2rem;
`;

const WingContainer = ({ children, width }) => {
  return (
    <WingWrapper>
      <WingIcon isLeft={true} width={width} marginTop={5} />
      {children}
      <WingIcon isLeft={false} width={width} marginTop={5} />
    </WingWrapper>
  );
};

const BackdropContainer = ({ children, padding, onDone }) => {
  return (
    <Backdrop>
      <BackdropChildren $backdropPadding={padding}>{children}</BackdropChildren>
      <CloseButton onClick={() => onDone()}>
        <CloseIcon width="100%" fill={ICON_CONTAINER_COLOR} />
      </CloseButton>
    </Backdrop>
  );
};

const InventoryMap = ({ item, onDone }) => {
  return (
    <BackdropContainer onDone={onDone}>
      <InventoryMapImage fadeSpeed={1000} src={item.image} />
    </BackdropContainer>
  );
};

const InventoryShard = ({ onDone }) => {
  return (
    <BackdropContainer onDone={onDone}>
      <Hacker>You do not have this item in this universe, in this city.</Hacker>
    </BackdropContainer>
  );
};

const InventoryBook = ({ item, state, onDone }) => {
  const [showForm, setShowForm] = useState(false);
  const [address, setAddress] = useState('');
  const [showCormorants, setShowCormorants] = useState(false);
  const [showBookDescription, setShowBookDescription] = useState(true);
  const [showSentSuccess, setShowSentSuccess] = useState(false);

  const sendBook = async () => {
    if (!address) {
      return;
    }
    const result = await fetch('/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
      }),
    });
    const { status, ok } = result;
    if (ok) {
      setShowForm(false);
      setShowSentSuccess(true);
      return;
    }
    if (status === 404) {
      setShowForm(false);
      setShowCormorants(true);
      return;
    }
  };

  return (
    <BackdropContainer onDone={onDone} padding={50}>
      <InventoryBookContainer>
        <InventoryBookImage fadeSpeed={1000} src={item.image} />
        <BookContentContainer>
          {showBookDescription && (
            <>
              <BookText>
                It's an intriguing book, especially because I cannot read it. It
                is written in a language completely unknown to me.
              </BookText>
              {state.canSendBook && (
                <SendWrapper>
                  <LineIcon fill="#3d3b36" width="100%" />
                  <SendButton
                    onClick={() => {
                      setShowBookDescription(false);
                      setShowForm(true);
                    }}
                  >
                    <WingContainer width={35}>
                      <BookIcon width={30} />
                    </WingContainer>
                    Send the book to another realm
                  </SendButton>
                </SendWrapper>
              )}
            </>
          )}
          {showForm && (
            <>
              <Textarea
                autoComplete="false"
                autoCorrect="false"
                autoCapitalize="false"
                spellCheck="false"
                placeholder="Send to this home address:"
                autoFocus={true}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <ButtonsContainer>
                <FormButton
                  $isFilled={false}
                  onClick={() => {
                    setShowForm(false);
                    setShowBookDescription(true);
                  }}
                >
                  <CloseIcon height={13} />
                  Nevermind, let's keep it
                </FormButton>
                <FormButton
                  onClick={() => sendBook()}
                  disabled={address.length === 0 || address.indexOf('@') !== -1}
                >
                  <WingIcon height={12} isLeft={true} />
                  Send the book
                </FormButton>
              </ButtonsContainer>
            </>
          )}
          {showCormorants && (
            <>
              <BookText>
                Unfortunately, it appears as though the cormorants are currently
                away on another delivery. The book cannot be sent until they
                return.
              </BookText>
              <FormButton
                onClick={() => {
                  setShowBookDescription(true);
                  setShowCormorants(false);
                }}
              >
                Okay.
              </FormButton>
            </>
          )}
          {showSentSuccess && (
            <>
              <BookText>
                The cormorants have been dispatched to the realm of your
                choosing, book in tow. May they arrive promptly and safely.
              </BookText>
              <FormButton
                onClick={() => {
                  setShowBookDescription(true);
                  setShowSentSuccess(false);
                }}
              >
                Wonderful!
              </FormButton>
            </>
          )}
        </BookContentContainer>
      </InventoryBookContainer>
    </BackdropContainer>
  );
};

const INVENTORY_ITEMS = {
  [INVENTORY_MAP]: {
    key: INVENTORY_MAP,
    icon: () => <MapIcon width="100%" fill={ICON_COLOR} />,
    image: '/static/valdrada.jpg',
    enlarged: InventoryMap,
  },
  [INVENTORY_BOOK]: {
    key: INVENTORY_BOOK,
    icon: () => <BookIcon height="100%" fill={ICON_COLOR} />,
    image: '/static/book.jpg',
    enlarged: InventoryBook,
  },
  [INVENTORY_SHARD]: {
    key: INVENTORY_SHARD,
    isAlwaysDisabled: true,
    icon: () => (
      <LeftShardIcon
        style={{ marginRight: '20%' }}
        height="130%"
        fill={ICON_COLOR}
      />
    ),
    enlarged: InventoryShard,
  },
};

export const Inventory = ({
  items,
  isDisabled,
  onOpenItem,
  onCloseItem,
  state,
}) => {
  const inventory = useMemo(
    () => items.map((item) => INVENTORY_ITEMS[item]),
    [items]
  );
  const [enlargedItem, setEnlargedItem] = useState(null);
  const EnlargedConstructor = useMemo(
    () => (enlargedItem ? INVENTORY_ITEMS[enlargedItem].enlarged : null),
    [inventory, enlargedItem]
  );

  useEffect(() => {
    onOpenItem?.(enlargedItem);
  }, [enlargedItem]);

  return (
    <>
      <InventoryWrapper>
        {inventory.map(({ icon, key, isAlwaysDisabled }) => (
          <ThumbnailWrapper key={key}>
            <Thumbnail
              onClick={() => setEnlargedItem(key)}
              disabled={isAlwaysDisabled || isDisabled}
            >
              {icon()}
            </Thumbnail>
          </ThumbnailWrapper>
        ))}
      </InventoryWrapper>
      {EnlargedConstructor && (
        <EnlargedConstructor
          state={state}
          item={INVENTORY_ITEMS[enlargedItem]}
          onDone={() => {
            onCloseItem?.(enlargedItem);
            setEnlargedItem(null);
          }}
        />
      )}
    </>
  );
};
