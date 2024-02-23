import _ from 'lodash';
import { SMA } from 'technicalindicators';
import { config as DEFAULT_CONFIG } from './config';
import { Strategy, StrategyCreator, StrategyConfig } from '../../types';

export const MaStrategyCreator: StrategyCreator = (baseConfig) => {
  const config = {
    ...DEFAULT_CONFIG,
    ...baseConfig,
  } as StrategyConfig & typeof DEFAULT_CONFIG;

  const strategy: Strategy = async (symbol, timestamp, connector) => {
    let data = await connector.kline({
      symbol,
      interval: '5',
      end: timestamp,
    });

    if (_.isEmpty(data)) {
      return;
    }

    const price = data[data.length - 1].close;

    if (!price) {
      return;
    }

    const order = await connector.getOrder(symbol);
    const orderExists = !_.isEmpty(order);

    const closesPrices = data.map((item) => item.close);

    const Line1 = SMA.calculate({
      period: config.PERIODS[0],
      values: closesPrices,
    }).pop();

    const Line2 = SMA.calculate({
      period: config.PERIODS[1],
      values: closesPrices,
    }).pop();

    if (!Line1 || !Line2) {
      return;
    }

    if (!orderExists && Line1 > Line2) {
      const qty = config.LIMIT / price;

      await connector.placeOrder({
        symbol,
        qty,
        price,
        timestamp,
        tpl: config.tpl,
      });
    }

    if (orderExists && Line1 < Line2) {
      await connector.cancelOrder({
        symbol,
        price,
        timestamp,
      });
    }
  };

  return strategy;
};
