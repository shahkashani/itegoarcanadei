import { useEffect, useState } from 'react';

import styled from 'styled-components';

const Container = styled.div`
  text-align: left;
`;

const Image = styled.img`
  width: 100%;
  margin-bottom: 10px;
  display: block;
`;

const ImageContainer = styled.div`
  position: relative;
`;

const getRandom = (min = 3000, max = 10000) =>
  min + Math.random() * (max - min);

export const Book = ({ book, children }) => {
  const { image, Child } = book;
  const [showChild, setShowChild] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [showTimerId, setShowTimerId] = useState(null);
  const [hideTimerId, setHideTimerId] = useState(null);

  const hours = new Date().getHours();
  const isDayTime = hours > 6 && hours < 20;

  const scheduleActive = () => {
    clearTimeout(showTimerId);
    setShowTimerId(
      setTimeout(() => {
        if (!isHover) {
          setShowChild(true);
        }
        clearTimeout(hideTimerId);
        setHideTimerId(
          setTimeout(() => {
            if (!isHover) {
              setShowChild(false);
            }
            scheduleActive();
          }, getRandom())
        );
      }, getRandom())
    );
  };

  useEffect(() => {
    if (Child && !isDayTime) {
      scheduleActive();
    }
  }, []);

  useEffect(() => {
    setShowChild(isHover);
  }, [isHover]);

  return (
    <Container key={image}>
      {Child ? (
        <ImageContainer
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <Image src={image} />
          {<Child isActive={showChild} />}
        </ImageContainer>
      ) : (
        <Image src={image} />
      )}
      {children}
    </Container>
  );
};
