const data_APTUSDT_5 = require('../data/APTUSDT_5') as [];
const data_AVAXUSDT_5 = require('../data/AVAXUSDT_5') as [];
const data_BTCUSDT_5 = require('../data/BTCUSDT_5') as [];
const data_SEIUSDT_5 = require('../data/SEIUSDT_5') as [];
const data_TIAUSDT_5 = require('../data/TIAUSDT_5') as [];

const history_SEIUSDT_1 = require('../history/SEIUSDT_1') as [];

export const store: Record<string, [] | null> = {
  data_APTUSDT_5,
  data_AVAXUSDT_5,
  data_BTCUSDT_5,
  data_SEIUSDT_5,
  data_TIAUSDT_5,

  history_SEIUSDT_1,
};
