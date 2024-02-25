import { MaStrategyCreator } from '../strategy/MA';
import { BotConfig } from '../types';

export const config: BotConfig = [
  {
    symbol: 'SUIUSDT',
    strategy: MaStrategyCreator({
      PERIODS: [2, 50],
      LIMIT: 200,
      tpl: [
        {
          rate: 0.3,
          profit: 0.02,
        },
        {
          rate: 0.3,
          profit: 0.04,
        },
        {
          rate: 0.3,
          profit: 0.08,
        },
      ],
    }),
  },
  {
    symbol: 'SEIUSDT',
    strategy: MaStrategyCreator({
      PERIODS: [2, 99],
      LIMIT: 200,
      tpl: [
        {
          rate: 0.3,
          profit: 0.04,
        },
        {
          rate: 0.3,
          profit: 0.08,
        },
        {
          rate: 0.3,
          profit: 0.16,
        },
      ],
    }),
  },
];
