import { createFolder } from './utils/FileUtils';
import path from 'path';

export const initialSetup = () => {
  const jsonFolderPath = path.resolve(__dirname, '../', 'json');
  createFolder(jsonFolderPath, 'Setup', true);
  const kmlFolderPath = path.resolve(__dirname, '../', 'kml');
  createFolder(kmlFolderPath, 'Setup', true);
};