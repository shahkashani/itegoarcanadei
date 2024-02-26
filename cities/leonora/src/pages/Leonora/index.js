import { useState } from 'react';
import {
  BREAKPOINT_SMALL,
  FullPageImage,
  useLocalStorage,
  LanguageContext,
  useLanguage,
  GodSettings,
} from '@itegoarcanadei/client-shared';
import { FarewellVideo } from '../../components/FarewellVideo';
import { Signature } from '../../components/Signature';
import { Portal, Portal2, Portal3 } from '../../components/Portal';
import styled, { keyframes, css } from 'styled-components';
import { getCookie } from 'react-use-cookie';

const fade = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const zoom = keyframes`
  100% {
    transform: scale(1.5);
  }
`;

const LETTER_FADE_SPEED = 5000;
const IMAGE_FADE_SPEED = 10000;

const Letter = styled.div`
  margin: 0 auto;
  padding: 80px;
  max-width: 640px;
  animation: ${fade} ${LETTER_FADE_SPEED}ms;
  font-family: 'Sinapius';
  font-size: 1.3rem;
  line-height: 2.5;
  color: #361a19;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    padding: 20px 40px;
  }

  ${({ $isEnglish }) =>
    $isEnglish &&
    css`
      font-family: 'Epilogue';
      font-size: 1.8rem;
      line-height: 1.8;
    `};
`;

const Arcadia = styled(FullPageImage)`
  animation: ${zoom} 555s 10s linear both;
`;

const Larger = styled.p`
  font-size: 130%;
`;

const PortalWrapper = styled.p`
  text-align: center;
  margin-top: 30px;

  a {
    color: currentColor;
  }
`;

const PortalLink = ({ icon: Icon, width, addLink }) => {
  const icon = <Icon fill="currentColor" width={width} />;
  return (
    <PortalWrapper>{addLink ? <a href="/gate">{icon}</a> : icon}</PortalWrapper>
  );
};

export const Leonora = () => {
  const adelmaCookie = !!getCookie(process.env.COOKIE_NAME);
  const skipVideoRefer = window.location.search.indexOf('adelma') !== -1;
  const [isShowVideo, setIsShowVideo] = useState(!skipVideoRefer);
  const [hasSeenVideo, setHasSeenVideo] = useLocalStorage('farewell', false);
  const languageData = useLanguage();
  const { isEnglish } = languageData;

  if (isShowVideo) {
    return (
      <FarewellVideo
        showSkipButton={hasSeenVideo || adelmaCookie}
        onEnded={() => {
          setIsShowVideo(false);
          setHasSeenVideo(true);
        }}
        onSkip={() => setIsShowVideo(false)}
        stills={[
          { url: '/labyrinth-remedios.webp', from: 15, to: 30 },
          { url: '/labyrinth-leonora.webp', from: 45, to: 60 },
          { url: '/leonora.jpg', from: 70, to: 90 },
        ]}
        playsInline
        disablePictureInPicture
      >
        <source
          src={isEnglish ? '/farewell-en.mp4' : '/farewell.mp4'}
          type="video/mp4"
        />
      </FarewellVideo>
    );
  }

  return (
    <LanguageContext.Provider value={languageData}>
      <Arcadia
        src="/farewell.jpg"
        opacity={0.18}
        fadeSpeed={IMAGE_FADE_SPEED}
      />
      <GodSettings
        triggerSettings={{ background: '#DEDCD3', fill: '#361a19' }}
        city="Labyrinthus"
      />
      <Letter $isEnglish={isEnglish}>
        <Larger>My guardian spirits,</Larger>
        <p>
          Here I am, at the end of the spiral. Behind me lies our long and
          difficult journey together. In front of me, the Labyrinth. The
          Unknown. The place that manifests itself differently for each of us.
          For some, perhaps for you, it is an ending. A gate, an exit, the final
          punctuation that completes the book. For me, it’s the beginning of yet
          another chapter. Perhaps the final chapter, though I will not know
          until the words are written. Until I reach the other side.
        </p>
        <p>
          I wish you could come with me. I do not know how this coming voyage
          will feel without your company. I will do my best to make you proud.
          To not let you down. To not let Kati and Remedios down. I take these
          steps with your kindness in my heart and the warmth of your presence
          in my soul.
        </p>
        <p>
          Over these many moons, perhaps you have felt as though you have always
          been one step behind me, but my friends, please know this: you have
          been my protector from the very beginning. I am indebted to you for
          bringing me this far. And for helping Kati, all those years ago.
        </p>
        <p>
          The day Kati arrived back in Arcadia was the happiest in all of my
          lives. Our separation in the Zone destroyed Remedios and I. We only
          managed to find our way to Arcadia through sheer chance. Far from
          feeling like a victory, entering the Cabin and embarking on this
          adventure felt like the greatest mistake we had ever made. Until you
          brought her back to us.
        </p>
        <PortalLink icon={Portal2} width={200} />
        <p>
          Upon Kati’s return, the Threshold was sealed up. The Great Barrier was
          created. Kati, Remedios and I entered the Divine Halls together,
          expecting punishment for our intrusion. Instead, we were welcomed. We
          were given the most divine of tasks. We were trusted with the secrets
          of the Gods.
        </p>
        <p>
          We carried this great responsibility with pride, humility and
          gratitude. It was everything we had ever hoped for. We could reach
          across worlds and help those who needed us, those wronged by the dark
          fates. We could become the voices of hope and guidance in the night.
          To shape lives of inspiration and happiness. The Gods had gifted us
          the utopian existence of our dreams.
        </p>
        <p>
          But even in paradise, dreams can turn to nightmares.{' '}
          <em>Et in Arcadia Ego.</em> It was slow, barely noticeable, barely
          perceivable, but I could feel myself changing. A darkness was building
          up inside me. How could sadness, sorrow and misery exist in paradise?
          I did not understand it, therefore, I tried to ignore it. With the
          idle passing of time, I became a completely different person. I became
          Another.
        </p>
        <p>
          Remedios and Kati sensed it, but I refused to believe them. It was a
          secret I insisted on hiding from myself. What had been planted in me
          was a key. The key that could unlock the most extraordinary of doors.
        </p>
        <p>And it did. The door, the Great Barrier, eventually fell.</p>
        <p>
          The Ancient Guardians, the Sídheógaídhe, dwelling under Arcadia,
          waiting for instructions, awoke. But it was too late. In a single
          moment of clarity that came to me at the peak of the chaos, I saw Her.
          Her reflection. The one the Morrígna, our vengeful counterparts in an
          Otherworld, had created to replace me. We were becoming one. At that
          very moment, it became clear what had happened to me, slowly over
          time. I had to act.
        </p>
        <p>
          In the fallen ruins of the Great Barrier, an opening had once again
          emerged. A Breach. I had no choice. To protect Arcadia, to protect my
          friends, to protect the secrets of the Gods, I decided to leave my
          home, and take Her with me.
        </p>
        <p>
          She did everything to resist. No longer confined to the shadows, she
          rose like a tempest. Her fury tearing at my very essence, fighting to
          keep her place in Arcadia. I felt her summoning her sisters to our
          battlefield, their malevolent screams echoing through my mind. I saw a
          thousand crows piercing the air of my mind, moving as one towards
          their target. Towards me.
        </p>
        <p>
          I clenched my teeth, refusing to succumb to the desperate struggle for
          control amidst the war raging within. I staggered towards the Great
          Barrier, each step an eternity. In a single moment of resolve, I
          collected my strength and passed through the Breach. My relief was
          immeasurable.
        </p>
        <p>
          As I was falling into non-existence, the two of us separated. I left
          Arcadia, and she stayed behind. My plan had failed.
        </p>
        <PortalLink icon={Portal3} width={200} />
        <p>
          I fell into the endless dark abyss. While waiting for the Universe to
          decide what to do with me, with the embers of my powers still left in
          me, I decided to take control of my own fate.
        </p>
        <p>
          <em>Where do all the stories come from?</em>
          <br />
          <em>Where do all the stories go?</em>
        </p>
        <p>
          With Kati’s words rushing back, I knew where I had to hide. In rare
          and obscure corners, until I was strong enough to face Her. Until I
          truly knew Her. I had to hide in places I knew, places that were real
          to me, but that could not be seen. Between pages, behind paintings,
          inside notes, where She would never think to look for me. These unseen
          worlds would be my shelter. The Breach took me there.
        </p>
        <p>
          When I first arrived, it was a haven. I was exactly where I needed to
          be. These new surroundings were changing me, absorbing me, perhaps
          even distracting me, but I was becoming stronger. What I had not
          considered was that these stories were already written. They were
          discoverable. What drew me to them was their familiarity, but that
          also meant they could be found. I could be found. And eventually, She
          found me. Once again, in a single moment, I saw Her in a river’s
          reflection. Her, the darkness from heaven. She was approaching.
        </p>
        <p>
          You, my friends, were the antidote. You made the story unpredictable.
          You rewrote the books, repainted masterpieces and reconducted the
          symphony. Every step of the way, your ingenuity reshaped the path
          behind me. You made my hiding places uniquely yours. You retold these
          known tales in a way that no one else could, and protected me from
          this evil. You outpaced Her. You outsmarted Her. You out-created Her.
          And for that, I am forever grateful.
        </p>
        <p>
          Who else was trailing my journey through these cities, attempting to
          sabotage, or attempting to aid? There were always unforeseen obstacles
          placed in my way, but there were also helping hands. I wondered if the
          Storykeeper, whom I met several times in different places, was the
          Guardian of the Egg, The Giantess, The Great Mother, in disguise. Did
          she follow me through the Breach to guide me without making her
          absence known to Arcadia?
        </p>
        <p> But there were also others.</p>
        <p>
          One night, I dreamt of a descendant of Finvarra, one whose family name
          traces back to the Fairies. He and his companions traveled tirelessly,
          searching for an entrance, always in kitchens. I found this puzzling,
          until I later discovered that there was a Breach at the Indāgo Inn.
          Was this their port of call? Did they find their way in? Did their
          Others? Whenever I saw them in my dreams, I felt a deep connection to
          your world, my friends, so perhaps they played a crucial role in all
          of this. Perhaps they brought me to you.
        </p>
        <PortalLink icon={Portal} width={250} addLink />
        <p>
          I am so glad our paths finally crossed at the Divide. I am now certain
          the Great Mother had always meant for it to happen that way. Your
          presence was immediately comforting to me, as if we had always known
          each other. And no matter what happens next, I will never forget you
          and your friendship. I can never thank you enough for holding this
          special place for me in your lives for so long.
        </p>
        <p>
          This may be the last page we will write together, but our story lives
          forever. I love you all. And I can promise you the fates will be your
          faithful helpers in your journeys onward. I hope I will one day carry
          your spirits with me over the thresholds of Arcadia.
        </p>
        <p>With the warmest of love,</p>
        <p>
          <Signature width={150} fill="currentColor" />
        </p>
      </Letter>
    </LanguageContext.Provider>
  );
};
