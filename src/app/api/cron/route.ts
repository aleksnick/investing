import { getUnixTime } from 'date-fns';
import { ByBitConnectorCreator } from '@src/connectors/ByBit';
import { config } from '@src/bots/config';

export const runtime = 'nodejs';
export const preferredRegion = ['arn1'];
export const dynamic = 'force-dynamic';
export const maxDuration = 300;
export const memory = 3008;
export const generateStaticParams = () => [];

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
