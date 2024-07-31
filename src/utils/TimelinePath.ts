import { TimelinePathSegment } from '../types';
import { timelinePathCoordinatesSeparator } from '../Constants';
import { getCoordinatesPair } from './Formatters';

export const getKMLPathCoordinates = (timelinePathSegment: TimelinePathSegment) => {
  return timelinePathSegment.timelinePath
    .map((point) => getCoordinatesPair(point.point))
    .join(timelinePathCoordinatesSeparator)
    .concat(timelinePathCoordinatesSeparator);
};