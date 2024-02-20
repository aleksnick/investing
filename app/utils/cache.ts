import fs from 'fs';
import path from 'path';

export const getCache = (dir: string, file: string): any => {
  const fullPath = path.join(process.cwd(), dir, file);

  if (!fs.existsSync(fullPath)) {
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
  const fullPath = path.join(process.cwd(), dir, file);

  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
};
