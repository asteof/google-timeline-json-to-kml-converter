import { timelinePathCoordinatesSeparator, TOKENS } from '../Constants';
import { TimelineType } from '../types';

export const createNameElement = (date: string, type: string, index?: number) => {
  const name = [type, date, index].filter(Boolean).join('-');
  return `<name>${name}</name>`;
};

export const createLookAt = (longitude: string, latitude: string, altitude: string) => {
  const lookAt = [
    TOKENS.lookAtStart,
    `<longitude>${longitude}</longitude>`,
    `<latitude>${latitude}</latitude>`,
    !!altitude ? `<altitude>${altitude}</altitude>` : '',
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

export const createPointElement = (coordinates: string) => {
  return [
    '<Point>',
    '<coordinates>',
    coordinates,
    '</coordinates>',
    '</Point>',
  ].join('\n');
};

const getLatLngAlt = (coordinates, type: 'path' | 'visit') => {
  let latitude, longitude, altitude;
  if (type === 'path') {
    [longitude, latitude] = coordinates.split(timelinePathCoordinatesSeparator)[0].split(',');
  } else {
    [longitude, latitude, altitude] = coordinates.split(',');
  }

  return {
    longitude, latitude, altitude,
  };
};

export const createPlacemark = (date: string, coordinates: string, type: TimelineType, index: number) => {
  const {longitude, latitude, altitude} = getLatLngAlt(coordinates, type);
  const mapElement = type === 'path' ? createLineStringElement(coordinates) : createPointElement(coordinates);

  return [
    `<Placemark id="${generatePlacemarkId()}">`,
    createNameElement(date, type, index),
    createLookAt(longitude, latitude, altitude),
    TOKENS.styleUrl,
    mapElement,
    '</Placemark>',
  ].join('\n');
};

const generatePlacemarkId = () => {
  return Math
    .random()
    .toString(22)
    .substring(2)
    .toUpperCase();
};

export const createKMLFileContent = (coordinatesCollection: string[], date: string, type: TimelineType) => {
  const placemarks = coordinatesCollection.map((coordinates, index) => createPlacemark(date, coordinates, type, index + 1));

  const content = [
    TOKENS.xml,
    TOKENS.kmlStart,
    TOKENS.documentStart,
    createNameElement(date, type),
    TOKENS.style1,
    TOKENS.style2,
    TOKENS.styleMap,
    ...placemarks,
    TOKENS.documentEnd,
    TOKENS.kmlEnd,
  ];

  return content.join('\n');
};