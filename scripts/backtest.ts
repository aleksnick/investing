const ListIt = require('list-it');
import chalk from 'chalk';
import { getUnixTime } from 'date-fns';
import { testing } from '../app/utils/testing';
import { MaStrategyCreator, config } from '../app/strategy/MA';
import { TestConfig } from '../app/types';

const start = getUnixTime(new Date('2024-01-01')) * 1000;
const end = getUnixTime(new Date('2024-01-31')) * 1000;

const TEST_CONFIG: TestConfig = [
  {
    options: {
      symbol: 'SUIUSDT',
      start,
      end,
    },
    strategyConfig: {
      ...config,
      tpl: [
        {
          rate: 0.33,
          profit: 0.5,
        },
        {
          rate: 0.33,
          profit: 0.9,
        },
        {
          rate: 0.33,
          profit: 0.13,
        },
      ],
    },
  },
  {
    options: {
      symbol: 'SUIUSDT',
      start,
      end,
    },
    strategyConfig: {
      ...config,
      tpl: [
        {
          rate: 0.33,
          profit: 0.7,
        },
        {
          rate: 0.33,
          profit: 0.11,
        },
        {
          rate: 0.33,
          profit: 0.13,
        },
      ],
    },
  },
];

const HEADERS = [
  chalk.blue('id'),
  chalk.yellow('symbol'),
  chalk.green('profit'),
  chalk.red('low'),
  chalk.cyan('orders'),
];

const backTest = async () => {
  let num = 1;
  const results: string[][] = [];

  for await (const test of TEST_CONFIG) {
    const stat = await testing(
      num.toString(),
      MaStrategyCreator,
      test.options,
      test.strategyConfig,
    );

    results.push([
      chalk.blue(`#${num.toString()}`),
      chalk.yellow(test.options.symbol),
      chalk.green(`${stat.amount.toFixed(2)}$`),
      chalk.red(`${stat.minAmount.toFixed(2)}$`),
      chalk.cyan(stat.orders),
    ]);

    num++;
  }

  const listit = new ListIt({
    autoAlign: true,
    headerUnderline: true,
  });

  console.log(listit.setHeaderRow(HEADERS).d(results).toString());
};

backTest();
