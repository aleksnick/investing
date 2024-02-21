import fs from 'fs';
import path from 'path';
import { store } from './store';

const getCachePath = (dir: string, file: string) =>
  path.join(process.cwd(), 'app', dir, `${file}.json`);

export const getCache = (dir: string, file: string): [] => {
  return store[`${dir}_${file}`] || [];
};

export const setCache = <T>(dir: string, file: string, data: T) => {
  const fullPath = getCachePath(dir, file);

  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
};
