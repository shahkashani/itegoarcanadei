export const Triangle = ({ size = 51, isFilled }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 180 180"
    >
      <polygon
        points="20 153 90 38 160 153"
        fill={isFilled ? '#fff' : 'none'}
        stroke="#fff"
        strokeWidth="6"
      />
    </svg>
  );
};
