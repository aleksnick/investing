'use server';

import fs from 'fs';
import path from 'path';

export const getCache = (file: string): any => {
  const fullPath = path.resolve(process.cwd(), file);
  console.log(
    'path',
    __dirname,
    process.cwd(),
    fullPath,
    fs.existsSync(fullPath),
  );

  if (!fs.existsSync(fullPath)) {
    return [];
  }

  try {
    const file = fs.readFileSync(fullPath).toString();

    return JSON.parse(file);
  } catch {
    return [];
  }
};

export const setCache = <T>(path: string, data: T) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};
