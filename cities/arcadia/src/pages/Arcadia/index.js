import { useEffect, useState } from 'react';
import {
  BREAKPOINT_MEDIUM,
  FullPageImage,
  WithFade,
  FadeImage,
  useInterval,
} from '@itegoarcanadei/client-shared';
import { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fade = keyframes`
  0% { opacity: 0};
`;

const Wrapper = styled.div`
  @media (min-width: ${BREAKPOINT_MEDIUM}px) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
`;

const CenteredWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const CenteredNarrative = styled.div`
  text-align: center;
  font-size: 2rem;
  color: #361a19;
  animation: ${fade} 3s ease-in-out;
  padding: 20px;

  p {
    margin: 10px 0;
  }
`;

const Narrative = styled.div`
  max-width: 800px;
  margin: 0 auto;
  font-size: 1.5rem;
  padding: 40px;
  color: #361a19;
  box-sizing: border-box;
  animation: ${fade} 3s ease-in-out;

  @media (min-width: ${BREAKPOINT_MEDIUM}px) {
    max-height: 100vh;
    overflow-y: auto;
  }

  a {
    color: inherit;
  }

  @media (min-width: ${BREAKPOINT_MEDIUM}px) {
    font-size: 2rem;
  }
`;

const Alt = styled.span`
  text-decoration: underline;
  cursor: pointer;
`;

const EmClosing = styled.em`
  color: #c8623a;
`;

const InputWrapper = styled.div`
  margin-top: 10px;
`;

const PreviewWrapper = styled.div``;

const Label = styled.label`
  display: block;
  margin: 20px 0;
`;

const Form = styled.form`
  input {
    padding: 10px 20px;
    padding-left: 0;
    border: none;
    border-bottom: 2px solid #361a19;
    border-radius: 0;
    color: #361a19;
    font-size: 1.5rem;
    outline: none;
    background: none;
    font-family: 'Epilogue';
    max-width: 100%;
    box-sizing: border-box;

    @media (max-width: ${BREAKPOINT_MEDIUM}px) {
      font-size: 1.2rem;
    }

    &::placeholder {
      color: #8e7d79;
    }
  }
`;

const Preview = styled.span`
  font-family: 'Epilogue';
  font-style: italic;
  font-size: 1.5rem;
`;

const Name = styled.input`
  width: 200px;
`;

const Email = styled.input`
  width: 400px;
`;

const Button = styled.button`
  font-size: 1.4rem;
  background: #361a19;
  border: none;
  color: #f7f8f7;
  padding: 10px 20px;
  border-radius: 40px;
  transition: opacity 250ms ease-in-out;

  &:disabled {
    opacity: 0.5;
  }
`;

const EditButton = styled.button`
  font-size: 1.4rem;
  color: #361a19;
  border: none;
  background: none;
  padding: 10px 20px;
  padding-left: 0;
`;

const Buttons = styled.div``;

const DecorativeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  &::before,
  &&::after {
    width: 100%;
    text-align: center;
    content: '†';
  }
`;

const ElBarco = styled(FadeImage)`
  width: 180px;
  max-width: 100%;
  aspect-ratio: 749 / 1069;
`;

const ContactForm = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [isPreview, setIsPreview] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const onSubmit = async () => {
    setIsSending(true);

    const data = {
      name,
    };

    if (contact) {
      data.contact = contact;
    }

    const response = await fetch('/records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      window.alert(
        'I am very sorry, but something went wrong. The record was not added. Could you please try again?'
      );
      return;
    }
    setIsSent(true);
  };

  if (isSent) {
    return (
      <div>
        <em>
          Thank you very much. It is my pleasure to be able to add you to the
          Records.
        </em>
      </div>
    );
  }

  if (isPreview) {
    return (
      <PreviewWrapper>
        <Label>
          Your immortal name: <Preview>{name}</Preview>
        </Label>
        {contact.length > 0 && (
          <Label>
            You may be reached at: <Preview>{contact}</Preview>
          </Label>
        )}
        <Buttons>
          <EditButton onClick={() => setIsPreview(false)}>
            Edit responses
          </EditButton>
          <Button onClick={() => onSubmit()} disabled={isSending}>
            {isSending ? 'Sending...' : 'Send responses'}
          </Button>
        </Buttons>
      </PreviewWrapper>
    );
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        setIsPreview(true);
      }}
    >
      <Label>
        How do you wish to be immortalized?
        <InputWrapper>
          <Name
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </InputWrapper>
      </Label>
      <Label>
        How would I be able to contact you if need be? (optional)
        <InputWrapper>
          <Email
            placeholder="E-mail address or Tumblr handle"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </InputWrapper>
      </Label>
      <Button disabled={name.length === 0}>Preview responses</Button>
    </Form>
  );
};

export const Arcadia = () => {
  const [status, setStatus] = useState('open');
  const [isShowingForm, setIsShowingForm] = useState(false);
  const [statusText, setStatusText] = useState(null);
  const [hasFetchedStatus, setHasFetchStatus] = useState(false);

  const fetchStatus = async () => {
    const response = await fetch('/status');
    if (!response.ok) {
      return;
    }
    const { status, text } = await response.json();
    setStatus(status);
    setStatusText(text);
  };

  useEffect(() => {
    (async () => {
      await fetchStatus();
      setHasFetchStatus(true);
    })();
  }, []);

  useInterval(async () => {
    await fetchStatus();
  }, 60000);

  return (
    <>
      <FullPageImage
        src="/arcadia.jpg"
        opacity={0.3}
        fadeSpeed={5000}
        align="bottom"
      />
      {hasFetchedStatus && (
        <>
          {status === 'closed' ? (
            <CenteredWrapper>
              <CenteredNarrative>
                <p>
                  <a href="/halls">
                    <ElBarco src="/elbarco.webp" />
                  </a>
                </p>
                <p>The Gate is closed. </p>
                <p>The Hall of the Gods awaits you.</p>
              </CenteredNarrative>
            </CenteredWrapper>
          ) : (
            <Wrapper>
              <Narrative>
                <p>Dear Traveller,</p>
                <p>
                  Let me be the first to congratulate you on passing through the
                  Gate. You made it on the back of your patience, strength and
                  kindness. I know your road was a long and arduous one, but you
                  are here. You have arrived in your Arcadia.
                </p>
                <p>
                  Let us hope that Leonora finds her way back to hers. You can
                  rest safely knowing you have done everything you possibly
                  could for her.
                </p>
                <p>
                  You deserve to be remembered for your deeds,{' '}
                  <a
                    href="https://www.tumblr.com/message/sidheogaidhe"
                    target="_blank"
                  >
                    so please let me know that you have arrived
                  </a>
                  . I will be eagerly waiting to hear from you. If this manner
                  of communication is not to your liking,{' '}
                  <Alt onClick={() => setIsShowingForm((c) => !c)}>
                    there is an alternate channel
                  </Alt>
                  .
                </p>
                {
                  <WithFade isVisible={isShowingForm}>
                    <DecorativeWrapper>
                      <ContactForm />
                    </DecorativeWrapper>
                  </WithFade>
                }
                {status === 'open' ? (
                  <p>
                    The gate is currently <em>open</em>, so feel free to spread
                    the word to your travel companions so that they may be
                    entered into the Records. Once the Gate is closing, or is
                    closed, I will let you know here.
                  </p>
                ) : (
                  <p>
                    The gate will be{' '}
                    <EmClosing>{statusText || 'closing soon'}</EmClosing>, so
                    make sure those who wish to be entered into the Records are
                    aware. Once it is closed, I will provide further
                    instructions here.
                  </p>
                )}
                <p>
                  In the meanwhile, I hope you enjoy these mementos of{' '}
                  <a href="https://media.itegoarcanadei.com/flavortown-fellowship-sights.zip">
                    sights
                  </a>{' '}
                  and{' '}
                  <a href="https://media.itegoarcanadei.com/flavortown-fellowship.zip">
                    sounds
                  </a>{' '}
                  throughout your journey here.
                </p>
                <p>Forever your faithful companion.</p>

                <p>- The Storykeeper</p>
              </Narrative>
            </Wrapper>
          )}
        </>
      )}
    </>
  );
};
