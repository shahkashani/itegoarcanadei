import styled, { keyframes } from 'styled-components';

const fade = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;
const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  height: -webkit-fill-available;
  background: ${({ fillOpacity = 0.8 }) => `rgba(0, 0, 0, ${fillOpacity});`};
  animation: ${fade} 350ms both;
  z-index: 4;
`;

const BackdropChildren = styled.div`
  padding: ${({ $backdropPadding = 20 }) => `${$backdropPadding}px;`};
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export const BackdropContainer = ({
  opacity,
  children,
  padding,
  closeButton,
  onDone,
}) => {
  return (
    <Backdrop fillOpacity={opacity}>
      <BackdropChildren $backdropPadding={padding}>{children}</BackdropChildren>
      {closeButton && <div onClick={() => onDone()}>{closeButton}</div>}
    </Backdrop>
  );
};
