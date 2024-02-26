import React from 'react';
import styled from 'styled-components';
import {
  LanguageContext,
  useLanguage,
  GodSettings,
  FadeImage,
} from '@itegoarcanadei/client-shared';

const Container = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Img = styled(FadeImage)`
  width: 80%;
  max-width: 593px;
`;

export const Maurilia = () => {
  const languageData = useLanguage();
  return (
    <LanguageContext.Provider value={languageData}>
      <GodSettings
        triggerSettings={{ background: '#291700', fill: '#dccaa4' }}
        city="Maurilia"
      />
      <Container>
        <Img src="/static/ii.png" />
      </Container>
    </LanguageContext.Provider>
  );
};
