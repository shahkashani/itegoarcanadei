import {
  MultiNarrative,
  ScalableContainer,
  WithFade,
  useDarkMode,
  LanguageContext,
  useLanguage,
  GodSettings,
} from '@itegoarcanadei/client-shared';
import { useEffect, useMemo, useState } from 'react';

import { BirdBath } from '../../components/BirdBath';
import { DoorIcon } from '../../icons/DoorIcon';
import { MoonIcon } from '../../icons/MoonIcon';
import { SunIcon } from '../../icons/SunIcon';
import { Trap } from '../../components/Trap';
import styled, { css } from 'styled-components';

const FADE_SPEED = 5000;

const Wrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 40px;
  text-align: center;
  font-size: 1.2rem;
  user-select: none;

  *:focus {
    outline: 0;
  }

  @media (max-width: 720px) {
    padding: 20px;
  }

  @media (max-width: 200px) {
    padding: 0;
  }

  ${({ $isEnglish }) =>
    $isEnglish &&
    css`
      font-family: 'Moriana';
      font-size: 1.5rem;
      line-height: 1.7;
    `};
`;

const Ground = styled.img`
  width: 100%;
  position: absolute;
  z-index: 2;
  left: 0;
  top: 3150px;
`;

const SunAndMoon = styled.div`
  position: absolute;
  box-sizing: border-box;
  padding: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: blur(1px);
  svg {
    fill: #704a3f;
  }

  opacity: ${({ $isSeen }) => ($isSeen ? 1 : 0.3)};
`;

const Sun = styled(SunAndMoon)`
  width: 133px;
  height: 124px;
  left: 822px;
  top: 979px;
`;

const Moon = styled(SunAndMoon)`
  width: 127px;
  height: 123px;
  left: 1436px;
  top: 986px;
`;

const StyledDoor = styled(DoorIcon)`
  cursor: pointer;
`;

const StyledContainer = styled(ScalableContainer)`
  transition: opacity ${FADE_SPEED}ms;
  opacity: ${({ $isLoaded }) => ($isLoaded ? 1 : 0)};
`;

const Door = styled.div`
  position: absolute;
  top: 1216px;
  left: 1108px;
  width: 130px;
  height: 263px;
`;

const Poem = styled.div`
  color: #9c6b5d;
  p {
    margin: 0;
  }
`;

const StyledMultiNarrative = styled(MultiNarrative)`
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
`;

const Destinos = styled.span`
  color: #9c6b5d;
`;

export const Moriana = () => {
  const { isDarkMode } = useDarkMode();
  const [isBirdBathLoaded, setIsBirdBathLoaded] = useState(false);
  const [isTrapLoaded, setIsTrapLoaded] = useState(false);
  const [isSeenSun, setIsSeenSun] = useState(false);
  const [isSeenMoon, setIsSeenMoon] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isShowNarrative, setIsShowNarrative] = useState(true);
  const [isShowCity, setIsShowCity] = useState(!isShowNarrative);
  const languageData = useLanguage();
  const { isEnglish } = languageData;

  const areImagesLoaded = useMemo(
    () => isBirdBathLoaded && isTrapLoaded,
    [isBirdBathLoaded, isTrapLoaded]
  );

  const onDoorClick = async () => {
    const result = await fetch('/gate', { method: 'POST' });
    if (!result.ok) {
      return;
    }
    const { portal } = await result.json();
    setIsMoving(true);
    setTimeout(() => {
      document.location.href = portal;
    }, FADE_SPEED + 500);
  };

  useEffect(() => {
    if (!isShowCity) {
      return;
    }
    if (isDarkMode) {
      setIsSeenMoon(true);
    } else {
      setIsSeenSun(true);
    }
  }, [isShowCity, isDarkMode]);

  return (
    <LanguageContext.Provider value={languageData}>
      <Wrapper $isEnglish={isEnglish}>
        <GodSettings city="Moriana" />
        <WithFade isVisible={isShowNarrative}>
          <StyledMultiNarrative
            iconColor="white"
            onComplete={() => {
              setTimeout(() => {
                setIsShowNarrative(false);
                setIsShowCity(true);
              }, 2000);
            }}
          >
            <div>
              <Poem>
                <p>The warp was woven at noon</p>
                <p>The woof in the house of dawn</p>
                <p>The rest in the hall of the sun</p>
                <p>Wrought on the loom</p>
                <p>Danced on the treads</p>
                <p>Golden gown woven for the moon</p>
                <p>Shimmering veil for the little sun</p>
              </Poem>
            </div>
            <div>
              <div>
                <Destinos>Tres destinos.</Destinos>&nbsp; Our fates had always
                been intertwined. I believed we were destined to reside in
                Arcadia together. With some help, we eventually did.
              </div>
            </div>
            <div>
              <div>
                When we finally entered the halls of the gods, we were gifted a
                task. The great women of fate. A way for us to keep creating. To
                weave. Like the spider weaves.
              </div>
            </div>
            <div>
              <div>Then she came. And now I am here.</div>
            </div>
            <div>
              <div>
                I pray the Morr&iacute;gna did not take your place, Kati, nor
                yours, Remedios.
              </div>
            </div>
            <div>
              <div>
                This journey has been long, but it has not been in vain. I am
                remembering the essence of who or what I am. I do not take this
                for granted. It did not have to be this way. I could easily have
                stayed in Euphemia.
              </div>
            </div>
            <div>
              <div>
                I could have lived someone else's life, none the wiser. There
                was a time where I would have welcomed the relief of ignorance.
                Today, I revel in remembering. Remembering, slowly, as in a fog.
              </div>
            </div>
            <div>
              <div>
                I remain grateful to whatever force is weaving my destiny,
                grateful it has brought me this far.
              </div>
            </div>
            <div>
              <div>
                Yet, I also know that she is here with me. I have been careless,
                but no longer. Every corner I turn in Moriana, I sense her. We
                are separated by a mere street corner that neither of us can
                turn.
              </div>
            </div>
            <div>
              <div>
                It seems to me that in the order to move on, one must face both
                the light and the darkness.
              </div>
            </div>
            <div>
              <div>A simple question haunts me.</div>
            </div>
            <div>
              <div>Am I the darkness or the light?</div>
            </div>
            <div></div>
          </StyledMultiNarrative>
        </WithFade>
        {isShowCity && (
          <StyledContainer
            isCover={false}
            width={2460}
            height={4750}
            padding={20}
            $isLoaded={areImagesLoaded && !isMoving}
          >
            <BirdBath
              isAnimated={!isDarkMode}
              onLoaded={() => setIsBirdBathLoaded(true)}
            />
            <Ground src="/obverse-separator.png" />
            <Trap
              isAnimated={isDarkMode}
              onLoaded={() => setIsTrapLoaded(true)}
            />
            <Sun $isSeen={isSeenSun}>
              <SunIcon width="100%" />
            </Sun>
            <Moon $isSeen={isSeenMoon}>
              <MoonIcon width="80%" />
            </Moon>
            {isSeenMoon && isSeenSun && !isMoving && (
              <Door>
                <StyledDoor
                  onClick={() => onDoorClick()}
                  fill="transparent"
                  width="100%"
                />
              </Door>
            )}
          </StyledContainer>
        )}
      </Wrapper>
    </LanguageContext.Provider>
  );
};
