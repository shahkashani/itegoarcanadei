import styled, { css, keyframes } from 'styled-components';
import { useEffect, useState } from 'react';
import {
  FullPageImage,
  FadeOut,
  LanguageContext,
  useLanguage,
  GodSettings,
} from '@itegoarcanadei/client-shared';

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

const Form = styled.form`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 20px;

  ${({ $isEnglish }) =>
    $isEnglish &&
    css`
      font-family: 'Log';
    `}
`;

const Bypass = styled.button`
  background: none;
  border: 0;
  color: white;
  opacity: 0.5;
  transition: opacity 250ms ease-in-out;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    opacity: 0.8;
  }
`;

const Input = styled.input`
  padding: 15px;
  border: 3px solid rgba(255, 255, 255, 0.7);
  background: transparent;
  color: #eee;
  font-size: 20px;
  border-radius: 30px;
  width: 200px;
  transition: border-color 150ms ease-in;

  &:focus {
    border-color: ${({ $isError }) => ($isError ? '#FF3E3E' : 'white')};
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

export const LoginPage = () => {
  const [password, setPassword] = useState('');
  const [isFadeOut, setIsFadeOut] = useState(false);
  const [isError, setIsError] = useState(false);
  const [timerId, setTimerId] = useState(null);
  const [inputType, setInputType] = useState('password');
  const languageData = useLanguage();
  const { isEnglish } = languageData;

  const onLogin = async (givenPass) => {
    const result = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: givenPass || password,
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
      <FullPageImage src={'/pages.jpg'} opacity={0.2} />
      <GodSettings city="Daphnis" />
      <Form
        $isEnglish={isEnglish}
        onSubmit={(e) => {
          onLogin();
          e.preventDefault();
        }}
      >
        <Input
          autoComplete="off"
          type={inputType}
          value={password}
          $isError={isError}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div>
          <Bypass
            type="button"
            onClick={() => {
              setInputType('text');
              setPassword(process.env.PASSWORD);
              onLogin(process.env.PASSWORD);
            }}
          >
            Skip login
          </Bypass>
        </div>
      </Form>
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
