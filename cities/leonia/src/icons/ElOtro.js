import styled, { css, keyframes } from 'styled-components';

const smoke = keyframes`
  100% {
    filter: blur(50px);
    transform: scaleX(0.3) scaleY(1.5);
    opacity: 0;
  }
`;

const Img = styled.img`
  ${({ $isAnimated }) =>
    $isAnimated &&
    css`
      animation: ${smoke} 2500ms ease-in both;
    `}
`;

export const ElOtro = ({ isAnimated, ...props }) => {
  return (
    <Img src="/el-otro-reloj.webp" $isAnimated={isAnimated} {...props} />
  );
};
