export interface TimelinePoint {
  point: string,
  time: string,
}

export interface Visit {
  hierarchyLevel: number,
  probability: number,
  topCandidate: {
    placeId: string,
    semanticType: string,
    probability: number,
    placeLocation: {
      latLng: string,
    }
  }
}

export interface TimelinePathSegment {
  startTime: string,
  endTime: string,
  timelinePath: TimelinePoint[],
}

export interface TimelineVisitSegment {
  startTime: string,
  endTime: string,
  startTimeTimezoneUtcOffsetMinutes: number,
  endTimeTimezoneUtcOffsetMinutes: number,
  visit: Visit;
}

export type Timeline = (TimelinePathSegment | TimelineVisitSegment)[]

export type TimelineType = 'path' | 'visit';