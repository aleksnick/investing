'use server';

import _ from 'lodash';
import { evaluate } from 'mathjs';
import { ByBitConnectorCreator } from '../ByBit';
import { getUnixTime } from 'date-fns';
import { setCache } from '../../utils/cache';
import {
  ConnectorCreator,
  KlineRequest,
  Order,
  OrderLogData,
  KlineChartData,
  Tpl,
} from '../../types';

export const TestConnectorCreator: ConnectorCreator = (config) => {
  let CURRENT_ORDER: Order | null = null;
  let ORIGINAL_QTY = 0;
  let AMOUNT = 100;
  let MIN_AMOUT = AMOUNT;
  let ORDERS = 0;
  let TPL: Tpl[] = [];
  const ORDER_LOG: OrderLogData = [];
  let LOADED_DATA: KlineChartData = [];

  const byBitConnector = ByBitConnectorCreator(config);

  const loadData = async (options: KlineRequest) => {
    const end = getUnixTime(new Date()) * 1000;

    const data = await byBitConnector.kline({
      symbol: options.symbol,
      interval: options.interval,
      end,
    });

    LOADED_DATA = data;
  };

  const kline = async (options: KlineRequest) => {
    if (LOADED_DATA.length < 1) {
      await loadData(options);
    }

    const res = LOADED_DATA.filter((item) => item.timestamp <= options.end);

    return res;
  };

  return {
    kline,
    getStat: () => {
      return {
        amount: AMOUNT,
        minAmount: MIN_AMOUT,
        orders: ORDERS,
      };
    },
    saveStat: (symbol: string, id: string) => {
      setCache('history', `${symbol}_${id}`, ORDER_LOG);
    },
    getOrder: () => {
      return new Promise((resolve) =>
        resolve(CURRENT_ORDER ? [CURRENT_ORDER] : null),
      );
    },
    checkTpl: async (symbol: string, timestamp: number) => {
      if (
        _.isEmpty(TPL) ||
        !ORIGINAL_QTY ||
        !CURRENT_ORDER ||
        _.isEmpty(CURRENT_ORDER)
      ) {
        return;
      }

      let data = await kline({
        symbol,
        interval: '5',
        end: timestamp,
      });

      if (_.isEmpty(data)) {
        return;
      }

      const price = data.pop()?.high;

      if (!price) {
        return;
      }

      TPL = TPL.filter(({ done }) => !done).map((tpl, i) => {
        if (!CURRENT_ORDER || price < CURRENT_ORDER.price * (1 + tpl.profit)) {
          return tpl;
        }

        const qty = ORIGINAL_QTY * tpl.rate;

        const summ = evaluate(`(${price} - ${CURRENT_ORDER.price}) * ${qty}`);

        AMOUNT = evaluate(`${AMOUNT} + ${summ}`);
        CURRENT_ORDER.qty = evaluate(`${CURRENT_ORDER.qty} - ${qty}`);

        ORDER_LOG.push({
          ...CURRENT_ORDER,
          timestamp,
          qty,
          price,
          type: 'SELL',
        });

        return {
          ...tpl,
          done: true,
        };
      });
    },
    placeOrder: ({ tpl, ...order }) => {
      TPL = tpl;

      CURRENT_ORDER = {
        ...order,
      };
      ORIGINAL_QTY = order.qty;

      ORDER_LOG.push({
        ...order,
        type: 'BUY',
      });

      return new Promise((resolve) => resolve(true));
    },
    cancelOrder: (order) => {
      if (!CURRENT_ORDER || _.isEmpty(CURRENT_ORDER)) {
        return new Promise((resolve) => resolve(false));
      }

      const summ = evaluate(
        `(${order.price} - ${CURRENT_ORDER.price}) * ${CURRENT_ORDER.qty}`,
      );

      AMOUNT = evaluate(`${AMOUNT} + ${summ}`);

      MIN_AMOUT = _.min([MIN_AMOUT, AMOUNT]) || MIN_AMOUT;
      ORDERS++;
      ORDER_LOG.push({
        ...CURRENT_ORDER,
        ...order,
        type: 'SELL',
      });

      TPL = [];
      ORIGINAL_QTY = 0;
      CURRENT_ORDER = null;

      return new Promise((resolve) => resolve(true));
    },
  };
};
