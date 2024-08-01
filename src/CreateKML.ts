import fs from 'fs';
import path from 'path';
import { createFile, createFolder } from './utils/FileUtils';
import { Timeline, TimelinePathSegment, TimelineType, TimelineVisitSegment } from './types';
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
      populateKML({ pathCoordinates, visitCoordinates, year, searchValue });
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

const populateKML = ({ pathCoordinates, visitCoordinates, year, searchValue }: {
  pathCoordinates: string[],
  visitCoordinates: string[],
  year: string,
  searchValue: string
}) => {
  const folderPath = path.resolve(kmlFolderPath, year);
  createFolder(folderPath, 'KML');

  createKMLFile(pathCoordinates, year, searchValue, folderPath, `Timeline-Path-${searchValue}`, 'path');
  createKMLFile(visitCoordinates, year, searchValue, folderPath, `Visits-${searchValue}`, 'visit');
};

const createKMLFile = (coordinates: string[], year: string, searchValue: string, folderPath: string, fileName: string, type: TimelineType) => {
  const filePath = path.resolve(folderPath, `${fileName}.kml`);
  const content = formatXml(createKMLFileContent(coordinates, searchValue, type), { collapseContent: true });
  createFile(filePath, content, type);
};