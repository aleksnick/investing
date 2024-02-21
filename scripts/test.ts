import 'dotenv/config';
import fs from 'fs';
import { RestClientV5 } from 'bybit-api';
import { getUnixTime, addDays } from 'date-fns';

const API_KEY = process.env.BYBIT_API_KEY;
const API_SECRET = process.env.BYBIT_API_SECRET;
const useTestnet = false;

const client = new RestClientV5({
  key: API_KEY,
  secret: API_SECRET,
  testnet: useTestnet,
});

const run = async () => {
  // const book = await client.getOrderbook({
  //   category: 'linear',
  //   symbol: 'SEIUSDT',
  // });

  // const info = await client.getPositionInfo({
  //   category: 'linear',
  // });

  const order = await client.submitOrder({
    category: 'linear',
    symbol: 'SEIUSDT',
    side: 'Buy',
    orderType: 'Market',
    qty: '0.1',
    price: '15600',
    timeInForce: 'PostOnly',
    orderLinkId: 'spot-test-postonly',
    orderFilter: 'Order',
  });

  // const kline = await client.getKline({
  //   category: 'linear',
  //   symbol: 'SEIUSDT',
  //   interval: '15',
  //   start: getUnixTime(addDays(new Date(), -2)) * 1000,
  //   end: getUnixTime(new Date()) * 1000,
  // });

  // console.log('info', info);
  // fs.writeFileSync('kline', JSON.stringify(kline, null, 2));
};

run();
