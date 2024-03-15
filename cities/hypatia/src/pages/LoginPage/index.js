import {
  FadeImage,
  FadeOut,
  ScalableContainer,
  LanguageContext,
  useLanguage,
  GodSettings,
} from '@itegoarcanadei/client-shared';
import styled, { css, keyframes } from 'styled-components';
import { useEffect, useState } from 'react';

const shake = keyframes`
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
`;

const fade = keyframes`
  0% {
    opacity: 0;
  }
`;

const Form = styled.form`
  position: absolute;
  top: 1020px;
  left: 880px;
  animation: ${fade} 2s ease-out;
  flex-direction: column;
  text-align: center;
  gap: 20px;

  ${({ $isEnglish }) =>
    $isEnglish &&
    css`
      font-family: 'Hylas';
    `}
`;

const Input = styled.input`
  font-family: 'Hylas';
  padding: 30px 50px;
  border: 4px solid rgba(255, 255, 255, 0.4);
  background: transparent;
  color: white;
  font-size: 40px;
  border-radius: 70px;
  transition: border-color 2s ease-out;
  width: 520px;

  &:focus {
    border-color: ${({ isError }) => (isError ? '#FF3E3E' : 'white')};
    outline: none;
  }

  ${({ $isError }) =>
    $isError &&
    css`
      animation: ${shake} 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
      transform: translate3d(0, 0, 0);
      backface-visibility: hidden;
      perspective: 1000px;
    `}
`;

const Bypass = styled.button`
  background: none;
  border: 0;
  color: white;
  opacity: 0.5;
  margin-top: 30px;
  transition: opacity 250ms ease-in-out;
  cursor: pointer;
  font-size: 30px;

  &:hover {
    opacity: 0.8;
  }
`;

export const LoginPage = () => {
  const [password, setPassword] = useState('');
  const [isFadeOut, setIsFadeOut] = useState(false);
  const [isError, setIsError] = useState(false);
  const [timerId, setTimerId] = useState(null);
  const [inputType, setInputType] = useState('password');
  const languageData = useLanguage();
  const { isEnglish } = languageData;

  const onLogin = async (givenPassword) => {
    const result = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: givenPassword || password,
      }),
    });
    if (result.ok) {
      setIsFadeOut(true);
    } else {
      setIsError(true);
    }
  };

  useEffect(() => {
    if (!isError) {
      return;
    }
    if (timerId) {
      clearTimeout(timerId);
    }
    const timer = setTimeout(() => {
      setIsError(false);
      setTimerId(null);
    }, 1000);
    setTimerId(timer);
  }, [isError]);

  return (
    <LanguageContext.Provider value={languageData}>
      <GodSettings city="Hypatia" />
      <ScalableContainer width={2400} height={2190} isCover={false}>
        <FadeImage src="/window.svg" width="100%" dimTo={0.1} />
        <Form
          $isEnglish={isEnglish}
          onSubmit={(e) => {
            onLogin();
            e.preventDefault();
          }}
        >
          <Input
            type={inputType}
            autoComplete="off"
            data-form-type="other"
            value={password}
            $isError={isError}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <Bypass
              type="button"
              onClick={() => {
                const password = process.env.HYPATIA_PASSWORD;
                setInputType('text');
                setPassword(password);
                onLogin(password);
              }}
            >
              Skip login
            </Bypass>
          </div>
        </Form>
      </ScalableContainer>
      {isFadeOut && (
        <FadeOut
          onComplete={() => {
            document.location.reload();
          }}
        />
      )}
    </LanguageContext.Provider>
  );
};
