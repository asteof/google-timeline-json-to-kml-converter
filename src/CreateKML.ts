import fs from 'fs';
import path from 'path';
import { createFile, createFolder } from './utils/FileUtils';
import { Timeline, TimelinePathSegment, TimelineVisitSegment } from './types';
import { TOKENS } from './Constants';
import { createNameElement, createPlacemark } from './utils/KMLElement';
import { getKMLCompatibleCoordinates } from './utils/TimelinePath';
import { getSearchValue } from './utils/Formatters';
import formatXml from 'xml-formatter';

const jsonChunksFolderPath = path.resolve(__dirname, '../', 'json', 'chunks');
const kmlFolderPath = path.resolve(__dirname, '../', 'kml');

export const parseJsonChunk = (year: string, searchValue: string) => {
  const filePath = path.resolve(jsonChunksFolderPath, year, `${searchValue}.json`);
  if (fs.existsSync(filePath)) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) throw err;

      const locationDataForMonth = JSON.parse(data);
      const { timelinePaths, visits } = divideSemanticSegmentsIntoLogicalParts(locationDataForMonth);
      const allCoordinates = timelinePaths.map((path) => getKMLCompatibleCoordinates(path));
      createTimelinePathKML(allCoordinates, year, searchValue);
    });
  }
};

export const createKMLFiles = (yearStart: number, yearEnd: number) => {
  for (let year = yearStart; year < yearEnd + 1; year++) {
    for (let month = 1; month < 13; month++) {
      const searchValue = getSearchValue(year, month);
      parseJsonChunk(year.toString(), searchValue);
    }
  }
};

const divideSemanticSegmentsIntoLogicalParts = (semanticSegments: Timeline) => {
  const timelinePaths: TimelinePathSegment[] = [];
  const visits: TimelineVisitSegment[] = [];

  semanticSegments.forEach(semanticSegment => {
    if (semanticSegment.hasOwnProperty('timelinePath')) {
      timelinePaths.push(semanticSegment as TimelinePathSegment);
    }

    if (semanticSegment.hasOwnProperty('visit')) {
      visits.push(semanticSegment as TimelineVisitSegment);
    }
  });

  return {
    timelinePaths,
    visits,
  };
};

const createFileContent = (coordinatesCollection: string[], name: string) => {
  const placemarks = coordinatesCollection.map((coordinates) => createPlacemark(name, coordinates));

  const content = [
    TOKENS.xml,
    TOKENS.kmlStart,
    TOKENS.documentStart,
    createNameElement(name),
    TOKENS.style1,
    TOKENS.style2,
    TOKENS.styleMap,
    ...placemarks,
    TOKENS.documentEnd,
    TOKENS.kmlEnd,
  ];

  return content.join('\n');
};

const createTimelinePathKML = (coordinates: string[], year: string, searchValue: string) => {
  const folderPath = path.resolve(kmlFolderPath, year);
  createFolder(folderPath);

  const filePath = path.resolve(folderPath, `Timeline-Path-${searchValue}.kml`);
  const content = formatXml(createFileContent(coordinates, searchValue), { collapseContent: true });
  createFile(filePath, content);
};