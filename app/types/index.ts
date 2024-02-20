import { KlineIntervalV3 } from 'bybit-api';

export type Interval = KlineIntervalV3;

export interface KlineChartItem {
  dt: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  turnover: number;
}

export type KlineChartData = Array<KlineChartItem>;

export interface KlineRequest {
  symbol: string;
  interval: Interval;
  start?: number;
  end: number;
}

export type Strategy = (
  symbol: string,
  timestamp: number,
  connector: Connector,
) => Promise<void>;

export type StrategyCreator = (config: StrategyConfig) => Strategy;

export type TestingOptions = Omit<KlineRequest, 'interval'>;

export type StrategyConfig = Record<string, string | number | number[]>;

export type TestingBox = (
  id: string,
  strategyCreator: StrategyCreator,
  options: TestingOptions,
  config: StrategyConfig,
) => Promise<ConnectorStat>;

export type TestConfig = {
  options: TestingOptions;
  strategyConfig: StrategyConfig;
}[];

export type Order = {
  symbol: string;
  qty: number;
  limit?: number;
  price: number;
  timestamp: number;
};

export type OrderLog = Order & {
  type: 'BUY' | 'SELL';
};

export type OrderLogData = OrderLog[];

export interface ConnectorStat {
  amount: number;
  orders: number;
  minAmount: number;
}

export type ConnectorCreator = (config: ConnectorConfig) => Connector;

export interface ConnectorConfig {
  key: string;
  secret: string;
}

export interface Connector {
  getStat: () => ConnectorStat;
  saveStat?: (symbol: string, id: string) => void;
  kline: (options: KlineRequest) => Promise<KlineChartData>;
  getOrder: (symbol: string) => Promise<Order | null>;
  placeOrder: (order: Order) => Promise<boolean>;
  cancelOrder: (order: Order) => Promise<boolean>;
}
