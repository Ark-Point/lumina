export type CMCCryptoCurrencySort =
  | 'name'
  | 'symbol'
  | 'date_added'
  | 'market_cap'
  | 'market_cap_strict'
  | 'price'
  | 'circulating_supply'
  | 'total_supply'
  | 'max_supply'
  | 'num_market_pairs'
  | 'volume_24h'
  | 'percent_change_1h'
  | 'percent_change_24h'
  | 'percent_change_7d'
  | 'market_cap_by_total_supply_strict'
  | 'volume_7d'
  | 'volume_30d';

export interface CMCCryptoCurrencyResponseData {
  id?: number | null;
  name?: string | null;
  symbol?: string | null;
  slug?: string | null;
  num_market_pairs?: number | null;
  date_added?: Date | null;
  tags?: string[] | null;
  max_supply?: number | null;
  circulating_supply?: number | null;
  total_supply?: number | null;
  infinite_supply?: boolean | null;
  platform?: Record<string, unknown> | null;
  cmc_rank?: number | null;
  self_reported_circulating_supply?: number | null;
  self_reported_market_cap?: number | null;
  tvl_ratio?: number | null;
  last_updated?: Date | null;
  quote?: Record<string, Record<string, unknown>> | null;
}
