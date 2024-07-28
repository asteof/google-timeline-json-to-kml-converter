import fs from 'fs';
import path from 'path';
import { createFile, createFolder } from './utils/FileUtils';
import { Timeline } from './types';
import { getSearchValue } from './utils/Formatters';

const jsonFolderPath = path.resolve(__dirname, '../', 'json');
const locationHistoryFilePath = path.resolve(jsonFolderPath, 'location-history.json');

export const createJsonChunks = (yearStart: number, yearEnd: number) => {
  if (fs.existsSync(locationHistoryFilePath)) {
    fs.readFile(locationHistoryFilePath, 'utf8', (err, data) => {
        if (err) console.log(err);

        const locationData = JSON.parse(data);
        const { semanticSegments } = locationData;

        for (let year = yearStart; year < yearEnd + 1; year++) {
          getSegmentsByYear(semanticSegments, year);
        }
      },
    );
  }
};

const getSegmentsByYear = (semanticSegments: Timeline, year: number) => {
  const folderPath = path.resolve(jsonFolderPath, 'chunks', year.toString());
  createFolder(folderPath);

  for (let month = 1; month < 13; month++) {
    const searchValue = getSearchValue(year, month);
    const filePath = path.resolve(folderPath, `${searchValue}.json`);
    const selectedMonthSegments = getSegmentsByMonth(semanticSegments, searchValue);
    if (selectedMonthSegments.length > 0) {
      createFile(filePath, JSON.stringify(selectedMonthSegments, null, 2));
    }
  }
};

const getSegmentsByMonth = (segments: Timeline, searchValue: string) => {
  console.log(searchValue);
  return segments.filter((segment) => {
    return !!segment.startTime.includes(searchValue);
  });
};