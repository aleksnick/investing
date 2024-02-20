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
} from '../../types';

const FEE = 0.0005;

export const TestConnectorCreator: ConnectorCreator = (config) => {
  let CURRENT_ORDER: Order | null = null;
  let AMOUNT = 100;
  let MIN_AMOUT = AMOUNT;
  let ORDERS = 0;
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

  return {
    kline: async (options: KlineRequest) => {
      if (LOADED_DATA.length < 1) {
        await loadData(options);
      }

      const res = LOADED_DATA.filter((item) => item.timestamp <= options.end);

      return res;
    },
    getStat: () => {
      return {
        amount: AMOUNT,
        minAmount: MIN_AMOUT,
        orders: ORDERS,
      };
    },
    saveStat: (symbol: string, id: string) => {
      setCache('history', `${symbol}-${id}.json`, ORDER_LOG);
    },
    getOrder: () => {
      return new Promise((resolve) => resolve(CURRENT_ORDER));
    },
    placeOrder: (order) => {
      CURRENT_ORDER = {
        ...order,
      };

      ORDER_LOG.push({
        ...order,
        type: 'BUY',
      });

      return new Promise((resolve) => resolve(true));
    },
    cancelOrder: (order) => {
      const summ = evaluate(
        `(${order.price} - (${CURRENT_ORDER?.price} * (${1 + FEE}))) * ${
          CURRENT_ORDER?.qty
        }`,
      );

      AMOUNT = evaluate(`${AMOUNT} + ${summ}`);
      MIN_AMOUT = _.min([MIN_AMOUT, AMOUNT]) || MIN_AMOUT;
      ORDERS++;
      CURRENT_ORDER = null;
      ORDER_LOG.push({
        ...order,
        type: 'SELL',
      });

      return new Promise((resolve) => resolve(true));
    },
  };
};
