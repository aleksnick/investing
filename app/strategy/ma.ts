import _ from 'lodash';
import { SMA } from 'technicalindicators';
import { diffRel } from '../utils/math';
import { Strategy, StrategyCreator } from '../types';

const DEFAULT_CONFIG = {
  PERIODS: [3, 99],
  LIMIT: 100,
  TAKE_PROFIT: 10,
};

export const MaStrategyCreator: StrategyCreator = (baseConfig) => {
  let ALLLOW_BUY = false;

  const config = {
    ...DEFAULT_CONFIG,
    ...baseConfig,
  } as typeof DEFAULT_CONFIG;

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

    const currentOrder = await connector.getOrder(symbol);

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

    if (ALLLOW_BUY && !currentOrder && Line1 > Line2) {
      const qty = Math.floor(config.LIMIT / price);

      await connector.placeOrder({
        symbol,
        qty,
        limit: config.LIMIT,
        price,
        timestamp,
      });

      ALLLOW_BUY = false;
    }

    if (
      currentOrder &&
      diffRel(currentOrder.price, price) > config.TAKE_PROFIT
    ) {
      await connector.cancelOrder({
        symbol,
        qty: currentOrder.qty,
        price,
        timestamp,
      });
    }

    if (Line1 < Line2) {
      ALLLOW_BUY = true;
    }

    if (currentOrder && Line1 < Line2) {
      await connector.cancelOrder({
        symbol,
        qty: currentOrder.qty,
        price,
        timestamp,
      });
    }
  };

  return strategy;
};
