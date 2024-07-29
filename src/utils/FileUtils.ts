import path from 'path';
import fs from 'fs';

export const createFolder = (folderPath: string, prefix: string = 'FileUtils', skipLog: boolean = false) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    if (!skipLog) {
      console.log(`[${prefix}] Folder "${folderPath}" created successfully.`);
    }
  }
  if (!skipLog) {
    console.log(`[${prefix}] Folder "${folderPath}" already exists. Skipping creation.`);
  }
};

export const createFile = (
  filePath: string,
  content: string,
  prefix: string = 'FileUtils',
  rewrite: boolean = false,
) => {
  const fileName = getFolderNameFromFilePath(filePath, 0);

  if (rewrite || !fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`\n[${prefix}] File ${fileName} created.\n`);
  } else {
    console.log(`[${prefix}] File ${fileName} already exists. Skipping creation.`);
  }
};

const getFolderNameFromFilePath = (filePath: string, folderLevel: number): string => {
  const basename = path.basename(filePath);
  const newPath = filePath.replace(`${path.sep}${basename}`, '');
  // console.log({ basename, folderLevel, newPath }, path.sep);
  const folderName = folderLevel === 0 ? '' : getFolderNameFromFilePath(newPath, folderLevel - 1) + '/';

  return `${folderName}${basename}`;
};
