import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import prettier from 'prettier';
import { getUnixTime, subDays } from 'date-fns';
import { ByBitConnectorCreator } from '../app/connectors/ByBit';

const start = getUnixTime(subDays(new Date(), 120)) * 1000;
const end = getUnixTime(new Date()) * 1000;

const LIST = [
  'BTCUSDT',
  'ETHUSDT',
  'NEARUSDT',
  'MATICUSDT',
  'OPUSDT',
  'APTUSDT',
  'AVAXUSDT',
  'SOLUSDT',
  'SUIUSDT',
  'SEIUSDT',
  'TIAUSDT',
];

const IGNORE_FILES = ['.gitignore'];

const filterFiles = (files: string[]) =>
  files
    .filter((file) => !IGNORE_FILES.includes(file))
    .map((file) => file.split('.')[0]);

const render = async () => {
  const dataFiles = filterFiles(
    fs.readdirSync(path.resolve(process.cwd(), 'app/data')),
  );

  const historyFiles = filterFiles(
    fs.readdirSync(path.resolve(process.cwd(), 'app/history')),
  );

  const content = await ejs.renderFile(
    path.resolve(process.cwd(), 'app/templates/store.ejs'),
    {
      dataFiles,
      historyFiles,
    },
  );

  const formatted = await prettier.format(content, {
    singleQuote: true,
    trailingComma: 'all',
    parser: 'typescript',
  });

  fs.writeFileSync(
    path.resolve(process.cwd(), 'app/utils/store.ts'),
    formatted,
    'utf-8',
  );
};

const update = async () => {
  const byBitConnector = ByBitConnectorCreator({
    key: '',
    secret: '',
  });

  for await (const symbol of LIST) {
    await byBitConnector.kline({
      symbol,
      interval: '5',
      start,
      end,
    });
  }

  await render();
};

update();
