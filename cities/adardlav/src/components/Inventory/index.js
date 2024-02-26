import {
  BREAKPOINT_MEDIUM,
  BREAKPOINT_SMALL,
  FadeImage,
  RightShardIcon,
  playLine,
  useAudioPlayer,
  useWindowSize,
} from '@itegoarcanadei/client-shared';
import styled, { css, keyframes } from 'styled-components';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { BookIcon } from '../../icons/BookIcon';
import { CloseIcon } from '../../icons/CloseIcon';
import { INVENTORY_BOOK } from '../../pages/Adardlav/types';
import { INVENTORY_SHARD } from '../../pages/ShadowAdardlav/types';
import { contain } from 'intrinsic-scale';

const ICON_COLOR = '#382b25';
const ICON_CONTAINER_COLOR = '#968166';
const BOOK_HEIGHT = 4814;
const BOOK_WIDTH = 3200;

const FRIENDS = [
  {
    letter: '1',
    say: 'Turp',
    left: 290,
    top: 2941,
  },
  {
    letter: 'I',
    say: 'I',
    left: 609,
    top: 2926,
  },
  {
    letter: '2',
    say: 'Hepp',
    left: 870,
    top: 2918,
  },
  {
    letter: 'U',
    say: 'U',
    left: 1139,
    top: 2983,
  },
  {
    letter: '3',
    say: 'Arb',
    left: 1383,
    top: 2972,
  },
  {
    letter: 'C',
    say: 'C',
    left: 1685,
    top: 2969,
  },
  {
    letter: '4',
    say: 'Grr',
    left: 1959,
    top: 2953,
  },
  {
    letter: 'D',
    say: 'D',
    left: 2229,
    top: 2976,
  },
  {
    letter: '5',
    say: 'Sor',
    left: 2467,
    top: 2972,
  },
  {
    letter: 'F',
    say: 'F',
    left: 2736,
    top: 2975,
  },
  {
    letter: 'P',
    say: 'P',
    left: 276,
    top: 3360,
  },
  {
    letter: '6',
    say: 'Hhhh',
    left: 567,
    top: 3355,
  },
  {
    letter: 'V',
    say: 'V',
    left: 885,
    top: 3360,
  },
  {
    letter: 'N',
    say: 'N',
    left: 1152,
    top: 3369,
  },
  {
    letter: 'R',
    say: 'R',
    left: 1367,
    top: 3355,
  },
  {
    letter: 'L',
    say: 'L',
    left: 1625,
    top: 3356,
  },
  {
    letter: '7',
    say: 'Hehe',
    left: 1816,
    top: 3364,
  },
  {
    letter: 'G',
    say: 'G',
    left: 2002,
    top: 3346,
  },
  {
    letter: 'H',
    say: 'H',
    left: 2295,
    top: 3346,
  },
  {
    letter: 'T',
    say: 'T',
    left: 2692,
    top: 3322,
  },
  {
    letter: '8',
    say: 'Arm',
    left: 291,
    top: 3750,
  },
  {
    letter: '9',
    say: 'Fish',
    left: 518,
    top: 3747,
  },
  {
    letter: '10',
    say: 'Or',
    left: 833,
    top: 3736,
  },
  {
    letter: 'Y',
    say: 'Y',
    left: 1095,
    top: 3739,
  },
  {
    letter: 'K',
    say: 'K',
    left: 1323,
    top: 3732,
  },
  {
    letter: 'M',
    say: 'M',
    left: 1559,
    top: 3749,
  },
  {
    letter: 'B',
    say: 'B',
    left: 1862,
    top: 3751,
  },
  {
    letter: 'O',
    say: 'O',
    left: 2078,
    top: 3735,
  },
  {
    letter: '-',
    say: 'Rawr',
    left: 2372,
    top: 3754,
  },
  {
    letter: 'Z',
    say: 'Z',
    left: 2554,
    top: 3760,
  },
  {
    letter: 'J',
    say: 'J',
    left: 2708,
    top: 3749,
  },
  {
    letter: 'Q',
    say: 'Q',
    left: 261,
    top: 4201,
  },
  {
    letter: '?',
    say: 'Hi',
    left: 493,
    top: 4177,
  },
  {
    letter: 'A',
    say: 'A',
    left: 780,
    top: 4159,
  },
  {
    letter: '.',
    say: 'Epp',
    left: 1039,
    top: 4159,
  },
  {
    letter: 'S',
    say: 'S',
    left: 1303,
    top: 4147,
  },
  {
    letter: ',',
    say: 'Snurr',
    left: 1526,
    top: 4179,
  },
  {
    letter: 'X',
    say: 'X',
    left: 1878,
    top: 4164,
  },
  {
    letter: '@',
    say: 'Me',
    left: 2173,
    top: 4161,
  },
  {
    letter: 'E',
    say: 'E',
    left: 2498,
    top: 4159,
  },
  {
    letter: '#',
    say: 'Hello!',
    left: 2749,
    top: 4165,
  },
];

const fade = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const bounce = keyframes`
  from {
    filter: drop-shadow(0 0 0 #d30c8a);
  }
  to {
    filter: drop-shadow(0 0 20px #d30c8a);
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
    opacity: 0.5 !important;
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

const SummonContainer = styled.div`
  position: fixed;
  z-index: 2;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  animation: ${fade} 4s ease-in-out;
`;

const Summon = styled.button`
  background: #1a1613;
  border: none;
  border-radius: 5px;
  outline: none;
  cursor: pointer;
  padding: 8px 10px;
  color: #ccb390;
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

const LittleImage = styled.img`
  position: absolute;
  transition: opacity 1000ms;
  opacity: 0.3;

  ${({ $isBounce }) =>
    $isBounce &&
    css`
      animation: ${bounce} 1000ms 250ms alternate ease-in-out infinite;
    `};

  ${({ $isActive }) =>
    $isActive
      ? css`
          opacity: 1;
        `
      : css`
          cursor: pointer;
        `}
`;

const Friends = styled.div`
  animation: ${fade} 1000ms ease-out both;
`;

const Hacker = styled.div`
  font-size: 2rem;
`;

const InventoryShard = ({ onDone }) => {
  return (
    <BackdropContainer onDone={onDone}>
      <Hacker>You do not have this item in this universe, in this city.</Hacker>
    </BackdropContainer>
  );
};

const LittleFriend = ({
  say,
  onSelect,
  isActive,
  isBounce,
  pronunciations,
  num,
  top,
  left,
}) => {
  const { playAudio } = useAudioPlayer();

  let styles = {
    left,
    top,
  };

  return (
    <LittleImage
      src={`/static/friend${num}.png`}
      style={styles}
      $isActive={isActive}
      $isBounce={isBounce}
      onClick={() => {
        if (isActive) {
          return;
        }
        playLine(
          {
            playAudio,
            character: 'spirit',
            text: say,
            pronunciations,
          },
          0,
          () => null,
          { volume: 0.3 }
        );
        onSelect?.();
      }}
    />
  );
};

const Book = styled.div`
  transition: opacity 2500ms ease-out;
  position: relative;
  z-index: 2;
`;

const InventoryBook = ({ onDone, onUnlocked }) => {
  const { width, height } = useWindowSize();
  const [isBookLoaded, setIsBookLoaded] = useState(false);
  const [phrase, setPhrase] = useState('');
  const [actives, setActives] = useState([]);
  const [isAllActive, setIsAllActive] = useState(false);

  const isRotated = width > height;

  const rotatedBookWidth = isRotated ? BOOK_HEIGHT : BOOK_WIDTH;
  const rotatedBookHeight = isRotated ? BOOK_WIDTH : BOOK_HEIGHT;

  const result = contain(width, height, rotatedBookWidth, rotatedBookHeight);

  const padding = (width * 0.05) / rotatedBookWidth;
  const scale = result.width / rotatedBookWidth - padding;

  const addLetter = (letter) => {
    setPhrase((p) => `${p}${letter}`);
  };

  useEffect(() => {
    (async () => {
      if (!phrase) {
        return;
      }
      const result = await fetch('/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: phrase,
        }),
      });
      if (result.ok) {
        const json = await result.json();
        if (json.exit) {
          setIsAllActive(true);
          onUnlocked?.();
        }
        if (json.dim) {
          setActives((actives) =>
            actives.filter((letter) => letter != json.dim)
          );
        }
      }
    })();
  }, [phrase]);

  const getIsActive = useCallback(
    (letter) => {
      return isAllActive || actives.indexOf(letter) !== -1;
    },
    [actives, isAllActive]
  );

  return (
    <>
      <Backdrop />
      {!isAllActive && (
        <CloseButton onClick={() => onDone()}>
          <CloseIcon width="100%" fill={ICON_CONTAINER_COLOR} />
        </CloseButton>
      )}
      <Book
        style={{
          opacity: isBookLoaded ? 1 : 0,
          width: BOOK_WIDTH,
          transform: `scale(${scale}) ${isRotated ? 'rotate(-90deg' : ''}`,
        }}
      >
        <FadeImage
          fadeSpeed={50}
          src="/static/book.webp"
          style={{ width: '100%' }}
          onComplete={() => setIsBookLoaded(true)}
        />
        <Friends>
          {FRIENDS.map((friend, num) => (
            <LittleFriend
              onSelect={() => {
                addLetter(friend.letter);
                setActives((actives) => [...actives, friend.letter]);
              }}
              isBounce={isAllActive}
              isActive={getIsActive(friend.letter)}
              say={friend.say}
              key={`friend-${num}`}
              num={num + 1}
              left={friend.left}
              top={friend.top}
            />
          ))}
        </Friends>
      </Book>
      {isBookLoaded && (
        <SummonContainer>
          <Summon
            onClick={() => {
              setIsAllActive(true);
              onUnlocked?.();
            }}
          >
            Summon the correct spirits
          </Summon>
        </SummonContainer>
      )}
    </>
  );
};

const INVENTORY_ITEMS = {
  [INVENTORY_BOOK]: {
    key: INVENTORY_BOOK,
    icon: () => <BookIcon height="100%" fill={ICON_COLOR} />,
    enlarged: InventoryBook,
  },
  [INVENTORY_SHARD]: {
    key: INVENTORY_SHARD,
    isAlwaysDisabled: true,
    icon: () => (
      <RightShardIcon
        style={{ marginLeft: '30%' }}
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
  onUnlocked,
  language,
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
          language={language}
          item={INVENTORY_ITEMS[enlargedItem]}
          onDone={() => {
            onCloseItem?.(enlargedItem);
            setEnlargedItem(null);
          }}
          onUnlocked={() => {
            onUnlocked?.();
          }}
        />
      )}
    </>
  );
};
