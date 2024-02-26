import styled, { css, keyframes } from 'styled-components';
import {
  FadeImage,
  LanguageContext,
  useLanguage,
  GodSettings,
} from '@itegoarcanadei/client-shared';
import { useState } from 'react';

const fade = keyframes`
  0% { opacity: 0 };
`;

const Page = styled.main`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: -webkit-fill-available;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #aaa;

  ${({ $isEnglish }) =>
    $isEnglish &&
    css`
      font-family: 'Arcana';
      font-size: 1.3rem;
    `};
`;

const Img = styled(FadeImage)`
  object-fit: contain;
  object-position: center center;
  width: 100%;
  height: 100%;
  min-height: 0;
`;

const Credits = styled.div`
  padding: 20px;
  max-width: 800px;
  text-align: center;
  animation: ${fade} 2s ease-out;
`;

const Links = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 10px;
  justify-content: center;
  a {
    color: inherit;
  }
`;

const Separator = styled.span`
  &::after {
    font-family: 'Arcana';
    content: '†';
  }
`;

const ShowLinks = styled.span`
  cursor: pointer;
`;

export const HallOfTheGods = () => {
  const languageData = useLanguage();
  const { isEnglish } = languageData;
  const [isShowLinks, setShowLinks] = useState(false);

  return (
    <LanguageContext.Provider value={languageData}>
      <GodSettings />
      <Page $isEnglish={isEnglish}>
        <Img
          key={`book-${isEnglish ? 'english' : 'voynich'}`}
          src={
            isEnglish ? '/itegoarcanadei.webp' : '/itegoarcanadei-voynich.webp'
          }
        />
        <Credits>
          9 travelers, 730 days, 14 invisible cities, 7 seas / Cs, 3 notes
          buried in the dirt, one labyrinth. On the two-year anniversary of
          Kati's return to Arcadia, the Dreamers have once again used their
          ingenuity, patience and resourcefulness to help Leonora find her way
          back home, reuniting her with her friends and the secrets of the Gods.
          They've overcome countless obstacles and left an everlasting
          impression on Daphnis, Adrogué, the Storykeeper, Horcicky,
          Haselberger, The Sun Lady, Der Filmstar, Padiel, Hylas, the Cormorants
          and the many spirits they've encountered along the way. Their
          friendship, kindness and bravery will never be forgotten. May the
          Flavortown Fellowship live forever{' '}
          <ShowLinks onClick={() => setShowLinks(!isShowLinks)}>◬</ShowLinks>
          {isShowLinks && (
            <Links>
              <a href="https://media.itegoarcanadei.com/flavortown-fellowship-sights.zip">
                Sights
              </a>
              <Separator />
              <a href="https://media.itegoarcanadei.com/flavortown-fellowship.zip">
                Sounds
              </a>
              <Separator />
              <a
                href="https://github.com/shahkashani/itegoarcanadei"
                target="_blank"
              >
                Source
              </a>
            </Links>
          )}
        </Credits>
      </Page>
    </LanguageContext.Provider>
  );
};
