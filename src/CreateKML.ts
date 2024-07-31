import fs from 'fs';
import path from 'path';
import { createFile, createFolder } from './utils/FileUtils';
import { Timeline, TimelinePathSegment, TimelineVisitSegment } from './types';
import { createKMLFileContent } from './utils/KMLElement';
import { getKMLPathCoordinates } from './utils/TimelinePath';
import { getSearchValue } from './utils/Formatters';
import formatXml from 'xml-formatter';
import { getKMLVisitCoordinates } from './utils/Visit';

const jsonChunksFolderPath = path.resolve(__dirname, '../', 'json');
const kmlFolderPath = path.resolve(__dirname, '../', 'kml');

export const parseJsonChunk = (year: string, searchValue: string) => {
  const filePath = path.resolve(jsonChunksFolderPath, year, `${searchValue}.json`);
  if (fs.existsSync(filePath)) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) throw err;

      const locationDataForMonth = JSON.parse(data);
      const { paths, visits } = divideSemanticSegmentsIntoLogicalParts(locationDataForMonth);
      const pathCoordinates = paths.map((path) => getKMLPathCoordinates(path));
      const visitCoordinates = Array.from(
        new Set(visits.map(visit => getKMLVisitCoordinates(visit))),
      );
      createPathKML(pathCoordinates, year, searchValue);
      createVisitsKML(visitCoordinates, year, searchValue);
      if (searchValue === '2015-05') {
        console.log({ pathCoordinates, visitCoordinates });
      }
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
  const paths: TimelinePathSegment[] = [];
  const visits: TimelineVisitSegment[] = [];

  semanticSegments.forEach(semanticSegment => {
    if (semanticSegment.hasOwnProperty('timelinePath')) {
      paths.push(semanticSegment as TimelinePathSegment);
    }

    if (semanticSegment.hasOwnProperty('visit')) {
      visits.push(semanticSegment as TimelineVisitSegment);
    }
  });

  return {
    paths,
    visits,
  };
};

const createPathKML = (coordinates: string[], year: string, searchValue: string) => {
  const folderPath = path.resolve(kmlFolderPath, year);
  createFolder(folderPath);

  const filePath = path.resolve(folderPath, `Timeline-Path-${searchValue}.kml`);
  const content = formatXml(createKMLFileContent(coordinates, searchValue, 'path'), { collapseContent: true });
  createFile(filePath, content);
};

const createVisitsKML = (coordinates: string[], year: string, searchValue: string) => {
  const folderPath = path.resolve(kmlFolderPath, year);
  createFolder(folderPath);

  const filePath = path.resolve(folderPath, `Visits-${searchValue}.kml`);
  const content = formatXml(createKMLFileContent(coordinates, searchValue, 'visit'), { collapseContent: true });
  createFile(filePath, content);
};