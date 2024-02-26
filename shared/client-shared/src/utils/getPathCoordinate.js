export const getPathCoordinate = (path) => {
  const cache = {};
  if (path) {
    const pathLength = path.getTotalLength();
    for (let i = 0; i < pathLength; i += 1) {
      const point = path.getPointAtLength(i);
      const x = Math.round(point.x);
      const y = Math.round(point.y);
      cache[x] = y;
    }
  }
  return (x) => {
    if (!path) {
      return 0;
    }
    let attempts = 0;
    let point;
    let startX = Math.max(0, x);
    while (!Number.isFinite(point) && attempts < 10) {
      point = cache[startX];
      if (!Number.isFinite(point)) {
        startX = startX + 1;
        attempts += 1;
      }
    }
    return point;
  };
};
