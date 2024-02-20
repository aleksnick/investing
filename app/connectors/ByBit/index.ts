'use server';

import _ from 'lodash';
import { getClient } from './client';
import { mapKlineToChartData } from './utils';
import {
  getItemTimestamp,
  getDataTimestamp,
  formatUnix,
} from '../../utils/timestamp';
import { getCache, setCache } from '../../utils/cache';
import { mergeData } from '../../utils/array';
import { KlineChartData, KlineRequest, Interval, ConnectorCreator } from '../../types';

const getCachePath = (symbol: string, interval: Interval) =>
  `data/${symbol}-${interval}.json`;

export const ByBitConnectorCreator: ConnectorCreator = (config) => {
  const request = async ({ symbol, interval, start, end }: KlineRequest) => {
    try {
      const client = getClient(config);

      const kline = await client.getKline({
        category: 'linear',
        symbol,
        interval,
        start,
        end,
        limit: 1000,
      });

      console.log(
        formatUnix(Number.parseInt(kline.result.list[0][0])),
        kline.result.list.length,
      );

      return mapKlineToChartData(kline.result.list.reverse());
    } catch (error) {
      console.error('request kline: ', error);

      return [];
    }
  };

  return {
    kline: async ({
      symbol,
      interval,
      start: defaultStart,
      end: defaultEnd,
    }: KlineRequest) => {
      let data = getCache(getCachePath(symbol, interval)) as KlineChartData;
      let loadedData = [] as KlineChartData;
      const cacheTimestamp = getDataTimestamp(data);

      let end = defaultEnd;
      const start = cacheTimestamp || defaultStart;
      let fulfilled = start && end && end <= start;

      const getPartData = async () => {
        const partData = await request({
          symbol,
          interval,
          start,
          end,
        });

        if (_.isEmpty(partData)) {
          fulfilled = true;
          return;
        }

        loadedData = mergeData(partData, loadedData);

        if (partData.length < 2) {
          fulfilled = true;
        }

        end = getItemTimestamp(partData[0]);
      };

      while (!fulfilled) {
        await getPartData();
      }

      data = mergeData(data, loadedData);

      setCache(getCachePath(symbol, interval), data);

      data = data.filter((item) => {
        const currentTimestamp = getItemTimestamp(item);

        return (
          currentTimestamp >= (defaultStart || 0) &&
          currentTimestamp <= (defaultEnd || Infinity)
        );
      });

      return data;
    },
    getStat: () => {
      return {
        amount: 0,
        minAmount: 0,
        orders: 0,
      };
    },
    getOrder: () => {
      return new Promise(() => null);
    },
    placeOrder: (order) => {
      return new Promise(() => true);
    },
    cancelOrder: () => {
      return new Promise(() => true);
    },
  };
};
