import fs from 'fs';
import path from 'path';

const getCachePath = (dir: string, file: string) =>
  path.join(process.cwd(), process.env.EXEC_PATH || '', dir, file);

export const getCache = (dir: string, file: string): any => {
  const fullPath = getCachePath(dir, file);

  if (!fs.existsSync(fullPath)) {
    console.error(`${fullPath} not found`);
    return [];
  }

  try {
    const file = fs.readFileSync(fullPath, 'utf8');

    return JSON.parse(file);
  } catch {
    return [];
  }
};

export const setCache = <T>(dir: string, file: string, data: T) => {
  const fullPath = getCachePath(dir, file);

  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
};
