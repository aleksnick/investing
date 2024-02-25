import fs from 'fs';
import path from 'path';
import { data } from './data';

const getCachePath = (dir: string, file: string) =>
  path.join(process.cwd(), 'src', dir, `${file}.json`);

export const getCache = (dir: string, file: string): [] => {
  if (dir !== 'backtest') {
    return data[`${dir}_${file}`] || [];
  }

  const fullPath = getCachePath(dir, file);

  if (!fs.existsSync(fullPath)) {
    console.error(`${fullPath} not found`);
    return [];
  }

  try {
    const file = fs.readFileSync(fullPath, 'utf8');

    return JSON.parse(file);
  } catch (e) {
    console.error('failed file cache', e);
    return [];
  }
};

export const setCache = <T>(dir: string, file: string, data: T) => {
  const fullPath = getCachePath(dir, file);

  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
};
