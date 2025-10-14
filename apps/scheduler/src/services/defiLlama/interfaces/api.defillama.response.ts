export interface ChainResponse {
  gecko_id: string;
  tvl: number;
  tokenSymbol: string;
  cmcId: string;
  name: string;
  chainId: string;
}

export interface ProtocolResponse {
  id: string;
  name: string;
  symbol: string;
  category: string;
  chains: string[];
  tvl: number;
  chainTvls: { [propertyName: string]: number };
  change_1d: number;
  change_7d: number;
}

export interface StableCoinResponse {
  id: string;
  geckoId: string;
  name: string;
  symbol: string;
  pegType: string;
  priceSource: string;
  pegMechanism: string;
  circulating: { peggedUSD: number };
  circulatingPrevDay: { peggedUSD: number };
  circulatingPrevWeek: { peggedUSD: number };
  circulatingPrevMonth: { peggedUSD: number };
  chainCirculating: {
    [propertyName: string]: {
      current: { peggedUSD: number };
      circulatingPrevDay: { peggedUSD: number };
      circulatingPrevWeek: { peggedUSD: number };
      circulatingPrevMonth: { peggedUSD: number };
    };
  };
  chains: string[];
  price: number;
}

export interface YieldPoolResponse {
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apyBase: number;
  apyReward: null;
  apy: number;
  rewardTokens: string[];
  pool: string;
  apyPct1D: number;
  apyPct7D: number;
  apyPct30D: number;
  stablecoin: false;
  ilRisk: string;
  exposure: string;
  predictions: {
    predictedClass: string;
    predictedProbability: number;
    binnedConfidence: number;
  };
  poolMeta: string;
  mu: number;
  sigma: number;
  count: number;
  outlier: boolean;
  underlyingTokens: string[];
  il7d: any; // 최근 7일간 발생한 비영구적 손실?
  apyBase7d: number;
  apyMean30d: number;
  volumeUsd1d: number;
  volumeUsd7d: number;
  apyBaseInception: any; // null 값이기에 타입을 특정할 수 없어 임시로 any 처리
}
export interface DexProtocolResponse {
  total24h: string;
  total48hto24h: string;
  total7d: string;
  total14dto7d: string;
  total60dto30d: string;
  total30d: string;
  total1y: string;
  totalAllTime: string;
  average1y: number;
  monthlyAverage1y: number;
  change_1d: number;
  change_7d: number;
  change_1m: number;
  change_7dover7d: number;
  change_30dover30d: number;
  total7DaysAgo: number;
  total30DaysAgo: number;
  defillamaId: string;
  name: string;
  displayName: string;
  module: string;
  category: string;
  logo: string;
  chains: string[];
  protocolType: string;
  methodologyURL: string;
  methodology: {
    UserFees: string;
    Fees: string;
    Revenue: string;
    ProtocolRevenue: string;
    HoldersRevenue: string;
    SupplySideRevenue: string;
  };
  parentProtocol: string;
  slug: string;
  linkedProtocols: string[];
  id: string;
}

export interface DexInfoResponse {
  breakdown24h: any;
  breakdown30d: any;
  chain: string;
  allChains: string[];
  total24h: string;
  total48hto24h: string;
  total7d: string;
  total14dto7d: string;
  total60dto30d: string;
  total30d: string;
  total1y: string;
  change_1d: number;
  change_7d: number;
  change_1m: number;
  change_7dover7d: number;
  change_30dover30d: number;
  total7DaysAgo: string;
  total30DaysAgo: string;
  totalAllTime: string;
  protocols: DexProtocolResponse[];
}

export interface FeeProtocolResponse {
  total24h: string;
  total48hto24h: string;
  total7d: string;
  total14dto7d: string;
  total60dto30d: string;
  total30d: string;
  total1y: string;
  totalAllTime: string;
  average1y: number;
  monthlyAverage1y: number;
  change_1d: number;
  change_7d: number;
  change_1m: number;
  change_7dover7d: number;
  change_30dover30d: number;
  total7DaysAgo: number;
  total30DaysAgo: number;
  defillamaId: string;
  name: string;
  displayName: string;
  module: string;
  category: string;
  logo: string;
  chains: string[];
  protocolType: string;
  methodologyURL: string;
  methodology: {
    UserFees: string;
    Fees: string;
    Revenue: string;
    ProtocolRevenue: string;
    HoldersRevenue: string;
    SupplySideRevenue: string;
  };
  parentProtocol: string;
  slug: string;
  linkedProtocols: string[];
  id: string;
}

export interface FeeInfoResponse {
  breakdown24h: any;
  breakdown30d: any;
  chain: string;
  allChains: string[];
  total24h: string;
  total48hto24h: string;
  total7d: string;
  total14dto7d: string;
  total60dto30d: string;
  total30d: string;
  total1y: string;
  change_1d: number;
  change_7d: number;
  change_1m: number;
  change_7dover7d: number;
  change_30dover30d: number;
  total7DaysAgo: string;
  total30DaysAgo: string;
  totalAllTime: string;
  protocols: FeeProtocolResponse[];
}

export interface PerpProtocolResponse {
  total24h: string;
  total48hto24h: string;
  total7d: string;
  total14dto7d: string;
  total60dto30d: string;
  total30d: string;
  total1y: string;
  average1y: number;
  monthlyAverage1y: number;
  change_30dover30d: number;
  breakdown24h: { [propertyName: string]: { [propertyName: string]: number } };
  breakdown30d: { [propertyName: string]: { [propertyName: string]: number } };
  total7DaysAgo: number;
  total30DaysAgo: number;
  defillamaId: string;
  name: string;
  displayName: string;
  module: string;
  category: string;
  logo: string;
  chains: string[];
  protocolType: string;
  methodologyURL: string;
  methodology: {
    UserFees: string;
    Fees: string;
    Revenue: string;
    ProtocolRevenue: string;
    HoldersRevenue: string;
    SupplySideRevenue: string;
  };
  parentProtocol: string;
  slug: string;
  linkedProtocols: string[];
  id: string;
}

export interface PerpInfoResponse {
  breakdown24h: Record<string, unknown> | null;
  breakdown30d: Record<string, unknown> | null;
  chain: string | null;
  allChains: string[];
  total24h: string;
  total48hto24h: string;
  total7d: string;
  total14dto7d: string;
  total60dto30d: string;
  total30d: string;
  total1y: string;
  change_1d: number;
  change_7d: number;
  change_1m: number;
  change_7dover7d: number;
  change_30dover30d: number;
  total7DaysAgo: string;
  total30DaysAgo: string;
  totalAllTime: string;
  protocols: PerpProtocolResponse[];
}
