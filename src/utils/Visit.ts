import { TimelineVisitSegment } from '../types';
import { getCoordinatesPair } from './Formatters';
import { ALTITUDE } from '../Constants';

export const getKMLVisitCoordinates = (timelineVisitSegment: TimelineVisitSegment) => {
  return [
    ...getCoordinatesPair(timelineVisitSegment.visit.topCandidate.placeLocation.latLng),
    ALTITUDE,
  ].join(',');
};