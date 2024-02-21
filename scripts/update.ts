import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import prettier from 'prettier';
import { getUnixTime, subDays } from 'date-fns';
import { ByBitConnectorCreator } from '../app/connectors/ByBit';

const start = getUnixTime(subDays(new Date(), 120)) * 1000;
const end = getUnixTime(new Date()) * 1000;
const INTERVAL = '5';

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

const render = async () => {
  const content = await ejs.renderFile(
    path.resolve(process.cwd(), 'app/templates/data.ejs'),
    {
      dataFiles: LIST.map((symbol) => `${symbol}_${INTERVAL}`),
    },
  );

  const formatted = await prettier.format(content, {
    singleQuote: true,
    trailingComma: 'all',
    parser: 'typescript',
  });

  fs.writeFileSync(
    path.resolve(process.cwd(), 'app/utils/data.ts'),
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
      interval: INTERVAL,
      start,
      end,
    });
  }

  await render();
};

update();
