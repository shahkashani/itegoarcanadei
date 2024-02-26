import { useContext } from 'react';
import {
  LANGUAGE_ARCADIAN,
  LANGUAGE_ENGLISH,
  LanguageContext,
} from '../../../hooks/useLanguage';
import styled, { css } from 'styled-components';

const Language = styled.div`
  font-size: 20px;
  display: flex;
  gap: 5px;
  align-items: center;
  font-family: 'TrueAlchemy';
`;

const LanguageButton = styled.button`
  font-family: inherit;
  font-size: inherit;
  border: none;
  padding: 0 5px;
  background: none;
  color: #888;

  ${({ $isActive }) =>
    $isActive &&
    css`
      color: white;
    `}
`;

export const GodLanguage = ({ onChangeLanguage }) => {
  const { language, changeLanguage } = useContext(LanguageContext);

  const setLang = (lang) => {
    changeLanguage(lang);
    onChangeLanguage?.(lang);
  };

  return (
    <Language>
      <LanguageButton
        $isActive={language === LANGUAGE_ENGLISH}
        onClick={() => setLang(LANGUAGE_ENGLISH)}
      >
        English
      </LanguageButton>
      <LanguageButton
        $isActive={language === LANGUAGE_ARCADIAN}
        onClick={() => setLang(LANGUAGE_ARCADIAN)}
      >
        Arcadian
      </LanguageButton>
    </Language>
  );
};
