export const getSearchValue = (year: number, month: number) => {
  return new Date(year, month)
    .toISOString()
    .slice(0, 7);
};

export const getCoordinatesPair = (value: string) => value.replace(/[ °]/g, '').split(',').reverse();
