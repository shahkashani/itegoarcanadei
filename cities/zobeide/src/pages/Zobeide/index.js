import { createRef, useEffect, useState } from 'react';

import { BackgroundVideo } from '../../components/BackgroundVideo';
import { FullPageVideo } from '../../components/FullPageVideo';
import { Message } from '../../components/Message';
import {
  WithFade,
  FadeImage,
  LanguageContext,
  useLanguage,
  GodSettings,
  BREAKPOINT_SMALL,
} from '@itegoarcanadei/client-shared';
import styled, { css } from 'styled-components';

const SKIP_VIDEO = false;
const MESSAGE_FADE_DURATION = 3000;

const Content = styled(WithFade)`
  padding: 50px;
  padding: margin 250ms;

  ${({ $isComplete }) =>
    $isComplete &&
    css`
      padding-bottom: 0;
    `};
`;

const Wrapper = styled.div`
  box-sizing: border-box;
  margin: 0 auto;
  max-width: 1000px;
  color: #eee;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    font-size: 1.2rem;
    line-height: 2;
  }

  p {
    margin: 20px 0;
  }

  ${({ $isEnglish }) =>
    $isEnglish &&
    css`
      font-family: 'The Divide';
      font-size: 2.5rem;

      @media (max-width: ${BREAKPOINT_SMALL}px) {
        font-size: 1.5rem;
        line-height: 1.3;
      }
    `};
`;

const Dim = styled.p`
  opacity: 0.6;
`;

const CompassWrapper = styled.div`
  margin: 20px 0;
  position: relative;
  line-height: 0;
  font-size: 0;
`;

const StartVideo = styled(WithFade)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  padding: 10%;
  text-align: center;
`;

const MessageWrapper = styled.div`
  text-align: center;
  max-width: 80%;
  margin: 0 auto;
`;

const SymbolWrapper = styled.div`
  padding-top: 15px;
  text-align: center;
  font-size: 0;
  line-height: 0;
`;

const Button = styled.button`
  background: none;
  outline: none;
  border: none;
  cursor: pointer;
  font-size: 0;
  margin: 0;
  padding: 0;
  line-height: 0;
`;

const FadeOut = styled.div`
  position: fixed;
  background: black;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Image = styled(FadeImage)`
  width: 100%;
  aspect-ratio: 3/2;
`;

const Compass = styled.div`
  transform: scaleY(0.6);
  transform-origin: 50% 100%;
  user-select: none;
  font-size: 180px;
  font-family: 'Guides';
  position: relative;
  line-height: 1;
  position: absolute;
  bottom: 2%;
  right: 17%;

  @media (max-width: 1000px) {
    font-size: 18vw;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/grain.webp');
    background-size: 30px 30px;
  }
`;

const PageWrapper = styled.div`
  font-family: 'Sinapius';
  font-size: 1.5rem;
  line-height: 3rem;

  ${({ $isEnglish }) =>
    $isEnglish &&
    css`
      font-family: 'Zobeide';
      font-size: 2rem;
    `};
`;

const WithFadeCallback = ({ onDone, fadeDuration, isVisible, ...props }) => {
  const [timerId, setTimerId] = useState(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (isDone) {
      onDone?.();
    }
  }, [isDone, onDone]);

  useEffect(() => {
    if (isVisible && !timerId) {
      setTimerId(
        setTimeout(() => {
          setIsDone(true);
        }, fadeDuration || 1000)
      );
    }
    return () => clearTimeout(timerId);
  }, [isVisible, fadeDuration, onDone]);
  return (
    <WithFade isVisible={isVisible} fadeDuration={fadeDuration} {...props} />
  );
};

const Mistakes = ({ mistakes, numMistakes, onDone }) => {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    onDone?.();
  }, [isDone]);

  if (!mistakes) {
    return null;
  }

  return (
    <>
      <MessageWrapper>
        <Message useGuide={false} onDone={() => setIsDone(true)}>
          {mistakes}
        </Message>
      </MessageWrapper>
      <WithFade isVisible={isDone}>
        {numMistakes < 2 ? (
          <p>
            I repeat the words that have appeared in the red sand in front of
            me, but nothing happens.
          </p>
        ) : (
          <p>
            Several words appear in the red sand in front of me. I repeat them
            all, but nothing happens.
          </p>
        )}
      </WithFade>
    </>
  );
};

export const Zobeide = () => {
  const [sign, setSign] = useState(undefined);
  const [message, setMessage] = useState(undefined);
  const [door, setDoor] = useState(undefined);
  const [direction, setDirection] = useState(undefined);
  const [mistakes, setMistakes] = useState(undefined);
  const [numMistakes, setNumMistakes] = useState(0);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoDone, setIsVideoDone] = useState(false);
  const videoRef = createRef();
  const backgroundRef = createRef();
  const [isIntroNarrativeShown, setIsIntroNarrativeShown] = useState(false);
  const [isSignShown, setIsSignShown] = useState(false);
  const [isDirectionShown, setIsDirectionShown] = useState(false);
  const [isFinalShown, setIsFinalShown] = useState(false);
  const [isSignNarrativeShown, setIsSignNarrativeShown] = useState(false);
  const [isDirectionNarrativeShown, setIsDirectionNarrativeShown] =
    useState(false);
  const [isMessageShown, setIsMessageShown] = useState(false);
  const [gotoUrl, setGotoUrl] = useState('');
  const [isCompassLoaded, setIsCompassLoaded] = useState(false);
  const languageData = useLanguage();
  const { isEnglish } = languageData;

  const onStatus = (status) => {
    setSign(status.sign);
    setMessage(status.message);
    setDoor(status.door);
    setDirection(status.direction);
    setMistakes((status.mistakes || []).join(', '));
    setNumMistakes((status.mistakes || []).length);
  };

  const onDeparture = async () => {
    const response = await fetch('/depart', { method: 'POST' });
    if (!response.ok) {
      return;
    }
    const { url } = await response.json();
    setGotoUrl(url);
  };

  useEffect(() => {
    let timerId;
    if (isError) {
      timerId = setTimeout(() => setIsError(false), 1000);
    }
    return () => clearTimeout(timerId);
  }, [isError]);

  useEffect(() => {
    const socket = io();
    socket.on('zobeide-hello', (status) => {
      setIsLoaded(true);
      onStatus(status);
    });
    socket.on('zobeide-status', (status) => onStatus(status));
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && isVideoPlaying) {
      videoRef.current.play();
    }
  }, [videoRef, isVideoPlaying]);

  useEffect(() => {
    if (backgroundRef.current && isVideoDone) {
      backgroundRef.current.play();
    }
  }, [backgroundRef, isVideoDone]);

  if (!isLoaded) {
    return null;
  }

  return (
    <LanguageContext.Provider value={languageData}>
      {isVideoDone && <GodSettings city="Zobeide" />}
      <PageWrapper $isEnglish={isEnglish}>
        {!isVideoDone && (
          <>
            <FullPageVideo
              ref={videoRef}
              still="/static.mp4"
              playsInline
              muted={false}
              disablePictureInPicture
              fadeMainFromEndSeconds={17}
              onEnd={() => setIsVideoDone(true)}
            >
              <source src="/thereturn.mp4" type="video/mp4" />
            </FullPageVideo>
            <StartVideo
              fadeDuration={isVideoPlaying ? 3000 : 10000}
              isVisible={!isVideoPlaying}
              onClick={() => {
                if (SKIP_VIDEO) {
                  setIsVideoDone(true);
                } else {
                  setIsVideoPlaying(true);
                }
              }}
            >
              I dream the dreams of the other dreamer
            </StartVideo>
          </>
        )}
        {isVideoDone && (
          <BackgroundVideo
            playsInline
            ref={backgroundRef}
            muted={true}
            disablePictureInPicture
            loop
          >
            <source src="/thedivide.mp4" type="video/mp4" />
          </BackgroundVideo>
        )}
        <Content
          fadeDuration={5000}
          isVisible={isVideoDone}
          $isComplete={isFinalShown}
        >
          <Wrapper $isEnglish={isEnglish}>
            <WithFadeCallback
              fadeDuration={MESSAGE_FADE_DURATION}
              isVisible={true}
              onDone={() => setIsIntroNarrativeShown(true)}
            >
              <p>
                Kati, I know you can't hear me, but I have arrived at the
                Divide, where you once stood. I am not where I was expecting. I
                don't understand how I ended up here. Am I traversing the
                tapestry of your dreams? Oneiro's dreams? Or has the Divide
                itself expanded in all dimensions?
              </p>
              <p>I remember the words you once sang to me.</p>
              <Dim>
                And this I dreamt, and this I dream,
                <br />
                And some time this I will dream again,
                <br />
                And all will be repeated, all be re-embodied,
                <br />
                You will dream everything I have seen in a dream.
                <br />
              </Dim>
              <p>
                The Divide is exactly as you described. It is the quietest place
                in the Universe. A silence waiting with bated breath to be
                broken. An air charged with unbearable tension. Red sand beneath
                my feet. A landscape identical in all directions save for the
                scattered bones of cormorants. The permanent midnight that makes
                itself felt.
              </p>
              <p>
                Aside from the hyenas, with eyes aglow in the surrounding
                darkness, I seem to be alone here. Your companions appear to
                have found their exit. This isolation makes me wish they were
                still here. I do not know this place. I have no way of safely
                moving forwards or backwards. All I can do is walk aimlessly, or
                wait. Wait and hope someone senses that I am here. Hope someone
                reaches out. Hope for letters carved into the sand; a sentence,
                a word, anything at all.
              </p>
              <p>
                And so, under the watchful gaze of hyenas, I tread the lonely
                terrain, waiting for a sign, a message to guide my uncertain
                path.
              </p>
            </WithFadeCallback>
            {sign && isIntroNarrativeShown && (
              <MessageWrapper>
                <Message
                  onDone={() => setTimeout(() => setIsSignShown(true), 1000)}
                >
                  {sign}
                </Message>
              </MessageWrapper>
            )}
            <WithFadeCallback
              isVisible={sign && isSignShown}
              fadeDuration={MESSAGE_FADE_DURATION}
              onDone={() => setIsSignNarrativeShown(true)}
            >
              <CompassWrapper>
                <Image
                  src="/the-compass.webp"
                  onComplete={() => setIsCompassLoaded(true)}
                />
                <WithFade isVisible={sign && isCompassLoaded && isSignShown}>
                  {sign && <Compass>{sign.slice(-1)}</Compass>}
                </WithFade>
              </CompassWrapper>
              <p>
                Suddenly, a miracle unfolds before my eyes. A message drawn in
                the red sand. "{sign}". Kati, I am not alone. The last letter of
                the message forms an arrow, a needle, a direction. So I begin
                walking, relying on this compass from another time and place.
              </p>
              <p>
                The hyenas follow, their howls echoing in the air. I feel the
                presence of my unseen guides and the pull of the path they have
                marked for me. Sometimes I see their shadows, as if they are
                moving somewhere behind this unending landscape. I have
                separated their darkness from the dark of this world. This place
                I never thought I would see. Is this no more than a dream made
                up by souls in a common act of magic? Who have I become in this
                dreamfall into darkness?
              </p>
              <p>
                Nights and nights of walking. I notice the Divide has begun to
                change. The once flat and empty ground now twisted and contorted
                into jagged, unforgiving, repetitive terrain, each direction
                still indistinguishable from the other, mocking any sense of
                orientation. Strange, twisted plants have emerged from the
                ground, their alien forms reaching towards the gray sky.
              </p>
              <p>
                The wind’s invisible hands now slow me down. Its sound is
                deafening. The air is heavy, as though walking under water. Have
                I passed this way before? The moon, now hidden behind a layer of
                ash, hangs perpetually in a featureless sky, casting no shadows
                and providing no clues as to the passage of time.
              </p>
              <p>I am lost.</p>
              <p>
                I kneel down in the vast expanse of red sand. With a mixture of
                hope and trepidation, I trace patterns in the crimson grains,
                wondering if there is a message waiting to be unveiled. Hoping
                it’ll once again guide my way.
              </p>
            </WithFadeCallback>

            {direction && isSignNarrativeShown && (
              <MessageWrapper>
                <Message
                  onDone={() =>
                    setTimeout(() => setIsDirectionShown(true), 1000)
                  }
                >
                  {direction}
                </Message>
              </MessageWrapper>
            )}

            <WithFadeCallback
              isVisible={isDirectionShown && direction && door}
              fadeDuration={MESSAGE_FADE_DURATION}
              onDone={() => setIsDirectionNarrativeShown(true)}
            >
              <p>
                The once-still grains begin to shift and swirl, forming
                intricate patterns. The red sand comes alive, shaping itself
                into another message from my guides. The moving grains form
                letters, “{direction}”, and include another invitation, an arrow
                pointing towards a new direction.
              </p>
              <p>
                With newfound purpose, I follow its guidance. As I walk, the
                landscape changes in response to my steps, as if the very ground
                itself acknowledges my presence. Perhaps we have become
                familiar. Perhaps I am still an intruder.
              </p>
              <p>
                I keep walking until an incredible sight stops my mindless
                movements. A door emerging from the red sand, its surface
                seamlessly transitioning into a lush tapestry of moss. The
                vibrant green growth intertwines with the red grains, creating a
                portal that seems to appear effortlessly from the landscape, yet
                feels strangely misplaced. As if it was manifested from another
                world.
              </p>
              <p>
                Approaching cautiously, I trace my fingers over its soft
                surface, feeling the subtle vibrations of a very different
                energy. Below the moss, I find words written on the door. “
                {door}”. The letters pulsate in unison with my breath, as if we
                are one. As if it is waiting for something from me. I want to
                speak, to say something, but I do not know the words to utter.
              </p>
              <p>
                <Image src="/at-the-gate.webp" />
              </p>
            </WithFadeCallback>

            {!message && mistakes && isDirectionNarrativeShown && (
              <Mistakes mistakes={mistakes} numMistakes={numMistakes} />
            )}

            {message && isDirectionNarrativeShown && (
              <MessageWrapper>
                <Message
                  useGuide={false}
                  onDone={() => setTimeout(() => setIsMessageShown(true), 1000)}
                >
                  {message}
                </Message>
              </MessageWrapper>
            )}
            <WithFadeCallback
              isVisible={message && isMessageShown}
              fadeDuration={MESSAGE_FADE_DURATION}
              onDone={() => setIsFinalShown(true)}
            >
              <p>
                Once again, helping words appear in the sand. I feel them
                wanting to leave my body. It is finally time to break this
                terrible silence. As if speaking directly to the soul of the
                Divide, my voice carries the message. "{message}".
              </p>
              <p>
                As expected, this acts as an invitation to the hyenas following
                me. I hear them running towards me. The howling becomes
                unbearable. For the first time, I can smell their presence.
              </p>
              <p>
                Something else happens. The words "{door}" written on the door
                fade. A symbol appears instead, glowing, filling the night with
                a warm light. Blinding not only me, but also the hyenas.
              </p>
              <p>The hyenas retreat.</p>
              <p>The door opens.</p>
              <p>I enter.</p>
              {isFinalShown && (
                <SymbolWrapper>
                  <Button type="button" onClick={() => onDeparture()}>
                    <Image src="/the-great-glyph.webp" />
                  </Button>
                </SymbolWrapper>
              )}
            </WithFadeCallback>
          </Wrapper>
        </Content>
        {message && gotoUrl && (
          <WithFadeCallback
            fadeDuration={5000}
            isVisible={true}
            onDone={() => (window.location.href = gotoUrl)}
          >
            <FadeOut />
          </WithFadeCallback>
        )}
      </PageWrapper>
    </LanguageContext.Provider>
  );
};
