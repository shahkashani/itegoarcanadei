import styled from 'styled-components';

const Wrapper = styled.div`
  width: 40px;
  height: 40px;

  @media (max-width: 720px) {
    width: 10vw;
    height: 10vw;
  }
`;

const Container = styled.div`
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: ${({ $isOrange }) => ($isOrange ? 'none' : 'sepia(0.7)')};
  background: url(${({ $isOrange }) => ($isOrange ? '/seed.png' : '/note.png')})
    no-repeat;
  background-size: 100% 100%;
`;

const Text = styled.div`
  font-size: 25px;
  color: black;
  z-index: 2;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
`;

export const Seed = ({ note, isOrange = false }) => {
  return (
    <Wrapper>
      <Container $isOrange={isOrange}>{note && <Text>{note}</Text>}</Container>
    </Wrapper>
  );
};
