import styled, { css, keyframes } from 'styled-components';
import {
  FadeImage,
  LanguageContext,
  useLanguage,
  GodSettings,
} from '@itegoarcanadei/client-shared';

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
          <p>
            9 travelers. 730 days. 14 invisible cities. 7 seas / Cs. 3 notes
            buried in the dirt. One Oneiro.
          </p>
          <p>
            On the two-year anniversary of Kati's return to Arcadia, Amelia,
            August, Christina, Ester, Marn, Mars, Paddington, Significantfoliage
            and Snow used their ingenuity, patience and resourcefulness to help
            Leonora find her way back home. They left an indelible mark on the
            hearts of Daphnis, Adrogué, the Storykeeper, Horcicky, Haselberger,
            The Sun Lady, Der Filmstar, Padiel, Hylas, the Cormorants and the
            many spirits they encountered along the way.
          </p>
          <p>Their kindness and bravery will never be forgotten.</p>
          <p>Long live the Flavortown Fellowship ▲△</p>
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
        </Credits>
      </Page>
    </LanguageContext.Provider>
  );
};
