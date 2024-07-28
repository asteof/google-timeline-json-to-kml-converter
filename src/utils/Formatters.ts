export const getSearchValue = (year: number, month: number) => {
  return new Date(year, month)
    .toISOString()
    .slice(0, 7);
};

export const getCoordinatesPair = point => point.point.replace(/[ °]/g, '').split(',').reverse();
