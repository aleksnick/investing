import { getUnixTime } from 'date-fns';
import { ByBitConnectorCreator } from '../app/connectors/ByBit';
import { config } from '../app/bots/config';

const byBitConnector = ByBitConnectorCreator({
  key: '',
  secret: '',
});

const run = async () => {
  for await (const bot of config) {
    const timestamp = getUnixTime(new Date()) * 1000;

    const { symbol, strategy } = bot;

    strategy(symbol, timestamp, byBitConnector);
  }
};
