import styled, { keyframes } from 'styled-components';

const draw = keyframes`
  0% {
    fill-opacity: 0;
  }
  100% {
    stroke-dashoffset: 0;
  }
`;

const Path = styled.path`
  animation: ${draw} linear 2000ms both;
`;

export const InputIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 616.017 141.003"
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeDasharray={1403}
      strokeDashoffset={1403}
      d="m421.808 6.977 94.209-.756 57.05-1.303c6.069-.648 13.1.806 21.095 4.363 11.991 5.336 11.675 19.176 11.675 19.176l3.497 26.59L612 91.167l-1.716 14.935a20.717 20.717 0 0 1-9.518 15.15l-.755.476a32 32 0 0 1-16.655 4.942l-38.505.523-64.058-1.322-58.571 4.196-61.286-.92-61.176.495-85.433 2.234-30.555-.065-40.838.579-54.006 4.612-43.697-.034-6.112-.42a34 34 0 0 1-30.198-24.037l-.362-1.19L4 69.559l.073-32.791a22.698 22.698 0 0 1 17.323-17.822l15.565-3.484 40.988-4.33 78.997-1.525 78.84-2.877 53.661-2.727 41.054 1.123 85.466 1.467 5.841.384Z"
    />
  </svg>
);
