export const Circle = ({ dotSize = 2, boxSize = 42 }) => {
  return (
    <svg
      viewBox={`0 0 ${boxSize} ${boxSize}`}
      width={boxSize}
      height={boxSize}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width={boxSize}
        height={boxSize}
        fill="transparent"
        strokeWidth={3}
        stroke="white"
      />
      <circle cx={boxSize / 2} cy={boxSize / 2} r={dotSize} fill="white" />
    </svg>
  );
};
