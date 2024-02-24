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
          rate: 0.33,
          profit: 0.05,
        },
        {
          rate: 0.33,
          profit: 0.1,
        },
        {
          rate: 0.33,
          profit: 0.15,
        },
      ],
    }),
  },
];
