'use client';

import _ from 'lodash';
import { registerIndicator, Chart } from 'klinecharts';
import { history } from '../../../actions/history';

export const History = async (chart: Chart, symbol: string, id = '1') => {
  const historyData = await history(id, symbol);

  if (_.isEmpty(historyData)) {
    return;
  }

  registerIndicator({
    name: 'History',
    figures: [{ key: 'history' }],
    calc: (kLineDataList) => {
      return kLineDataList.map((kLineData) => {
        const order = historyData.find(
          (item) => item.timestamp === kLineData.timestamp,
        );

        if (!order) {
          return {};
        }

        return {
          text: order.type === 'BUY' ? '🍏' : '🍎',
          history: order.price,
        };
      });
    },
    draw: ({ ctx, visibleRange, indicator, xAxis, yAxis }) => {
      const { from, to } = visibleRange;

      ctx.font = '14px' + ' Helvetica Neue';
      ctx.textAlign = 'center';
      const result = indicator.result;
      for (let i = from; i < to; i++) {
        const data = result[i];

        if (data?.history) {
          const x = xAxis.convertToPixel(i);
          const y = yAxis.convertToPixel(data.history);
          ctx.fillText(data.text, x, y);
        }
      }
      return false;
    },
  });

  chart.createIndicator('History', true, { id: 'candle_pane' });
};
