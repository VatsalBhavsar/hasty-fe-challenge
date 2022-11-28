export const getCoordinateRangePoints = (pt: number, range: number) => {
  let coordinateRange = [pt];
  for (let i = 1; i <= range; i++) {
    coordinateRange.unshift(pt - i);
    coordinateRange.push(pt + 1);
  }
  return coordinateRange;
};
