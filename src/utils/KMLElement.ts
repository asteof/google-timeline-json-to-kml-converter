import { timelinePathCoordinatesSeparator, TOKENS } from '../Constants';

export const createNameElement = (name: string) => {
  return `<name>${name}</name>`;
};

export const createLookAt = (longitude: string, latitude: string) => {
  const lookAt = [
    TOKENS.lookAtStart,
    `<longitude>${longitude}</longitude>`,
    `<latitude>${latitude}</latitude>`,
    TOKENS.props,
    TOKENS.lookAtEnd,
  ];

  return lookAt.join('\n');
};

export const createLineStringElement = (coordinates: string) => {
  return [
    '<LineString>',
    '<coordinates>',
    coordinates,
    '</coordinates>',
    '</LineString>',
  ].join('\n');
};

export const createPlacemark = (name: string, coordinates: string) => {
  const [longitude, latitude] = coordinates.split(timelinePathCoordinatesSeparator)[0].split(',');
  return [
    `<Placemark id="${generatePlacemarkId()}">`,
    createNameElement(name),
    createLookAt(longitude, latitude),
    TOKENS.styleUrl,
    createLineStringElement(coordinates),
    '</Placemark>',
  ].join('\n');
}

const generatePlacemarkId = () => {
  return Math
    .random()
    .toString(22)
    .substring(2)
    .toUpperCase();
};