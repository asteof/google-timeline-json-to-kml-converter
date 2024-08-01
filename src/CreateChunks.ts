import fs from 'fs';
import path from 'path';
import { createFile, createFolder } from './utils/FileUtils';
import { Timeline } from './types';
import { getSearchValue } from './utils/Formatters';

const jsonFolderPath = path.resolve(__dirname, '../', 'json');
const locationHistoryFilePath = path.resolve(__dirname, '../', 'location-history.json');

export const createJsonFiles = (yearStart: number, yearEnd: number) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(locationHistoryFilePath)) {
      fs.readFile(locationHistoryFilePath, 'utf8', (err, data) => {
          if (err) {
            reject(err);
            console.log(err);
          }

          const locationData = JSON.parse(data);
          const { semanticSegments } = locationData;

          for (let year = yearStart; year < yearEnd + 1; year++) {
            getSegmentsByYear(semanticSegments, year);
          }

          resolve();
        },
      );
    }
  });
};

const getSegmentsByYear = (semanticSegments: Timeline, year: number) => {
  const folderPath = path.resolve(jsonFolderPath, year.toString());
  createFolder(folderPath, 'JSON');

  for (let month = 1; month < 13; month++) {
    const searchValue = getSearchValue(year, month);
    const filePath = path.resolve(folderPath, `${searchValue}.json`);
    const selectedMonthSegments = getSegmentsByMonth(semanticSegments, searchValue);
    if (selectedMonthSegments.length > 0) {
      createFile(filePath, JSON.stringify(selectedMonthSegments, null, 2), 'JSON');
    }
  }
};

const getSegmentsByMonth = (segments: Timeline, searchValue: string) => {
  return segments.filter((segment) => {
    return !!segment.startTime.includes(searchValue);
  });
};