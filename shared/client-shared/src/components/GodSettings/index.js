import styled, { css, createGlobalStyle } from 'styled-components';
import { useState, useContext } from 'react';
import { WithFade, ElementSize } from '../../components';
import { GodMap } from './GodMap';
import { GodLanguage } from './GodLanguage';
import { GodTrigger } from './GodTrigger';
import { GodClose } from './GodClose';
import { LanguageContext } from '../../hooks/useLanguage';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'TrueAlchemy';
    src: url('/common/alchemy.woff2') format('woff2');
    font-display: block;

  @font-face {
    font-family: 'TrueAlchemy';
    src: url('/common/alchemy-italic.woff2') format('woff2');
    font-display: block;
    font-style: italic;
  }
  }

  @font-face {
    font-family: 'TrueSinapius';
    src: url('/common/sinapius.woff2') format('woff2');
    font-display: block;
  }
`;

const Backdrop = styled(WithFade)`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 11;
  background: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  gap: 50px;
  font-family: 'TrueSinapius';
  *::-webkit-scrollbar {
    width: 14px;
  }

  *::-webkit-scrollbar-corner {
    background: none;
  }

  *::-webkit-scrollbar-track {
    background: black;
  }

  *::-webkit-scrollbar-thumb {
    background-color: #333;
    border-radius: 20px;
    border: 5px solid black;
  }

  *::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }

  ${({ $isEnglish }) =>
    $isEnglish &&
    css`
      font-family: 'TrueAlchemy';
    `};
`;

const MapContainer = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Credits = styled.div`
  padding: 20px;
  border: 1px solid #888;
`;

export const GodSettings = ({ children, city, triggerSettings }) => {
  const [isShowingSettings, setIsShowingSettings] = useState(false);
  const { language } = useContext(LanguageContext);

  return (
    <>
      <GlobalStyle />
      <div onClick={() => setIsShowingSettings(true)}>
        {children || <GodTrigger {...(triggerSettings || {})} />}
      </div>
      <Backdrop
        isVisible={isShowingSettings}
        $isEnglish={language === 'english'}
      >
        <MapContainer>
          <ElementSize>
            <GodMap city={city} />
          </ElementSize>
        </MapContainer>
        <GodClose onClick={() => setIsShowingSettings(false)} />
        <Credits>
          <GodLanguage onChangeLanguage={() => setIsShowingSettings(false)} />
        </Credits>
      </Backdrop>
    </>
  );
};
