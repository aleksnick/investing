import { getUnixTime } from 'date-fns';
import { ByBitConnectorCreator } from '../connectors/ByBit';
import { config } from '../bots/config';

const bot = async () => {
  const byBitConnector = ByBitConnectorCreator({
    key: '',
    secret: '',
  });

  for await (const bot of config) {
    const timestamp = getUnixTime(new Date()) * 1000;

    const { symbol, strategy } = bot;

    await strategy(symbol, timestamp, byBitConnector);
  }

  console.log('done');
};

export default bot;
