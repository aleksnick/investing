'use client';

import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { init, Chart, dispose } from 'klinecharts';
import { getUnixTime, subDays } from 'date-fns';
import { kline } from '../../actions/kline';
import { KlineChartData } from '../../types';
import { MaIndicator } from './indicators/MA';
import { EmaIndicator } from './indicators/EMA';
import { WmaIndicator } from './indicators/WMA';
import { VolIndicator } from './indicators/VOL';
import { Backtest } from './indicators/Backtest';

const SYMBOL = 'SUIUSDT';
const INTERVAL = '5';

export const KlineChart = () => {
  const [data, setData] = useState<KlineChartData>();

  const updateData = async () => {
    const start = getUnixTime(subDays(new Date(), 30)) * 1000;
    const end = getUnixTime(new Date()) * 1000;

    const newData = await kline({
      symbol: SYMBOL,
      interval: INTERVAL,
      start,
      end,
    });

    setData(newData);
  };

  useEffect(() => {
    updateData();
  }, []);

  useEffect(() => {
    // initialize the chart
    if (!data || _.isEmpty(data)) {
      return () => null;
    }

    const chart = init('chart') as Chart;

    // add data to the chart
    chart.applyNewData(data);

    VolIndicator(chart);
    MaIndicator(chart, data, [2, 50]);
    // EmaIndicator(chart, data, [3, 30]);
    // WmaIndicator(chart, data, [3, 40]);
    Backtest(chart, SYMBOL, '1');

    // chart.createIndicator('SAR', true, { id: 'candle_pane' });

    return () => {
      // destroy chart
      dispose('chart');
    };
  }, [data]);

  return (
    <>
      <h1>{SYMBOL}</h1>
      <div id="chart" style={{ width: 1200, height: 800 }} />
    </>
  );
};
