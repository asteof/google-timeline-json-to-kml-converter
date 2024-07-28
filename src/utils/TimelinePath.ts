import { TimelinePathSegment } from '../types';
import { timelinePathCoordinatesSeparator } from '../Constants';
import { getCoordinatesPair } from './Formatters';

export const getKMLCompatibleCoordinates = (timelinePathSegment: TimelinePathSegment) => {
  return timelinePathSegment.timelinePath
    .map(getCoordinatesPair)
    .join(timelinePathCoordinatesSeparator)
    .concat(timelinePathCoordinatesSeparator);
};