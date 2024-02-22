'use server';

import { OrderLogData } from '../types';
import { getCache } from '../utils/cache';

export const history = async (
  id: string,
  symbol: string,
): Promise<OrderLogData> => {
  const data = getCache('history', `${symbol}_${id}`) as OrderLogData;

  return new Promise((resolve) => resolve(data));
};
