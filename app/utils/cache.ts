'use server';

import fs from 'fs';

export const getCache = (path: string): any => {
  if (!fs.existsSync(path)) {
    return [];
  }

  try {
    const file = fs.readFileSync(path).toString();

    return JSON.parse(file);
  } catch {
    return [];
  }
};

export const setCache = <T>(path: string, data: T) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};
