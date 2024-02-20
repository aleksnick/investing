'use server';

import { ByBitConnectorCreator } from '../connectors/ByBit';
import { KlineRequest } from '../types';

export const kline = async (options: KlineRequest) => {
  const byBitConnector = ByBitConnectorCreator({
    key: '',
    secret: '',
  });

  return await byBitConnector.kline(options);
};
