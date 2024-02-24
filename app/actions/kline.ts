'use server';

import { ByBitConnectorCreator } from '../connectors/ByBit';
import { Kline } from '../types';

export const kline: Kline = async (options) => {
  const byBitConnector = ByBitConnectorCreator({
    key: '',
    secret: '',
  });

  return await byBitConnector.kline(options);
};
