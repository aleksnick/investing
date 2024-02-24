import { getUnixTime } from 'date-fns';
import { ByBitConnectorCreator } from '../../connectors/ByBit';
import { config } from '../../bots/config';

export async function GET() {
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

  return Response.json({ res: 'done' });
}
