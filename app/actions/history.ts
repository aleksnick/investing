'use server';

import { OrderLogData } from '../types';
import { getCache } from '../utils/cache';

export const history = async (id: string, symbol: string) => {
  const data = getCache('history', `${symbol}-${id}.json`) as OrderLogData;

  return data;
};
