import {
  Chain,
  ChainRepository,
  DexInfo,
  DexInfoRepository,
  DexProtocol,
  DexProtocolRepository,
  FeeInfo,
  FeeInfoRepository,
  FeeProtocol,
  FeeProtocolRepository,
  Protocol,
  ProtocolRepository,
  StableCoin,
  StableCoinRepository,
  YieldPool,
  YieldPoolRepository,
} from '@lumina-backend/database';
import { Injectable, Logger } from '@nestjs/common';
import Axios, { AxiosInstance } from 'axios';
import { DataSource, EntityManager } from 'typeorm';
import {
  ChainResponse,
  DexInfoResponse,
  DexProtocolResponse,
  FeeInfoResponse,
  FeeProtocolResponse,
  ProtocolResponse,
  StableCoinResponse,
  YieldPoolResponse,
} from './interfaces/api.defillama.response';

@Injectable()
export class ApiDefiLlamaService {
  private readonly logger = new Logger(ApiDefiLlamaService.name);
  private defiLlamaApiInstance: AxiosInstance;

  constructor(
    private readonly chainRepository: ChainRepository,
    private readonly protocolRepository: ProtocolRepository,
    private readonly stableCoinRepository: StableCoinRepository,
    private readonly yieldPoolRepository: YieldPoolRepository,
    private readonly dexInfoRepository: DexInfoRepository,
    private readonly dexProtocolRepository: DexProtocolRepository,
    private readonly feeInfoRepository: FeeInfoRepository,
    private readonly feeProtocolRepository: FeeProtocolRepository,
    private readonly dataSource: DataSource,
  ) {
    const baseUrl = 'https://api.llama.fi';
    this.defiLlamaApiInstance = Axios.create({
      baseURL: baseUrl,
    });
  }

  // DefiLlama API 호출
  public async getAllChains() {
    const endpoint = '/v2/chains';

    const getAllChainResponse = await this.defiLlamaApiInstance.get(endpoint);

    const allChains: ChainResponse[] = getAllChainResponse.data;

    return allChains;
  }

  public async getAllProtocols() {
    const endpoint = '/protocols';

    const getAllProtocolResponse = await this.defiLlamaApiInstance.get(endpoint);

    const allProtocols: ProtocolResponse[] = getAllProtocolResponse.data;

    return allProtocols;
  }

  public async getStableCoins() {
    const baseURL = 'https://stablecoins.llama.fi';
    const endpoint = '/stablecoins';

    const getStableCoinsResponse = await Axios.get(`${baseURL}${endpoint}`);

    const baseStablecoins: StableCoinResponse[] = getStableCoinsResponse.data?.peggedAssets;

    // await this.saveStableCoins(stablecoins);

    return baseStablecoins;
  }

  public async getYieldPools() {
    const baseURL = `https://yields.llama.fi`;
    const endpoint = '/pools';

    const getYieldPoolsResponse = await Axios.get(`${baseURL}${endpoint}`);

    const baseYieldPools: YieldPoolResponse[] = getYieldPoolsResponse.data?.data;

    return baseYieldPools;
  }

  public async getDexInfo(chainName: string) {
    const endpoint = `/overview/dexs/${chainName}`;

    const getDexInfoResponse = await this.defiLlamaApiInstance.get(endpoint, {
      params: {
        excludeTotalDataChart: true,
        excludeTotalDataChartBreakdown: true,
      },
    });

    const dexInfoResponse: DexInfoResponse = getDexInfoResponse.data;
    const dexProtocols = dexInfoResponse.protocols;

    // DB Transaction For DexInfo , DexProtocol
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    this.logger.debug(`[${this.getDexInfo.name}] DB Transaction 생성.`);
    try {
      //
      const chain = await this.chainRepository.findByName(dexInfoResponse.chain);

      const dexInfo = await this.saveDexInfo(dexInfoResponse, chain, queryRunner.manager);

      const dexProtocolInfo = await this.saveDexProtocols(
        dexProtocols,
        dexInfo,
        queryRunner.manager,
      );

      this.logger.debug(`Successfully saved ${dexProtocols.length} dexProtocols to database`);

      await queryRunner.commitTransaction();

      this.logger.debug(`[${this.getDexInfo.name}] DB Transaction 커밋. `);

      return { dexInfo, dexProtocolInfo };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.debug(`[${this.getDexInfo.name}] DB Transaction rollback. `);
      this.logger.error(
        `[${this.getDexInfo.name}] DexInfo, DexProtocol DB Insert 실패 :\nmessage: ${error}  `,
      );
    } finally {
      await queryRunner.release();
    }
  }

  public async getFeeInfo(chainName: string) {
    const endpoint = `/overview/fees/${chainName}`;

    const getFeeInfoResponse = await this.defiLlamaApiInstance.get(endpoint, {
      params: {
        excludeTotalDataChart: true,
        excludeTotalDataChartBreakdown: true,
      },
    });

    const feeInfoResponse: FeeInfoResponse = getFeeInfoResponse.data;
    const feeProtocols = feeInfoResponse.protocols;

    // DB Transaction For Fee DB
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    this.logger.debug(`[${this.getFeeInfo.name}] DB Transaction 생성.`);
    try {
      //
      const chain = await this.chainRepository.findByName(feeInfoResponse.chain);
      const feeInfo = await this.saveFeeInfo(feeInfoResponse, chain, queryRunner.manager);
      const feeProtocolInfo = await this.saveFeeProtocols(
        feeProtocols,
        feeInfo,
        queryRunner.manager,
      );
      this.logger.debug(`Successfully saved ${feeProtocols.length} feeProtocols to database`);
      await queryRunner.commitTransaction();
      this.logger.debug(`[${this.getFeeInfo.name}] DB Transaction 커밋. `);
      return { feeInfo, feeProtocolInfo };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.debug(`[${this.getFeeInfo.name}] DB Transaction rollback. `);
      this.logger.error(`[${this.getFeeInfo.name}]  DB Insert 실패 :\nmessage: ${error}  `);
    } finally {
      await queryRunner.release();
    }
  }

  // DB insert
  /**
   * 모든 Chain 데이터를 가져와서 DB에 저장합니다.
   */
  public async saveAllChains(chains: ChainResponse[]): Promise<void> {
    try {
      // API 응답 데이터를 DB 엔티티 형식으로 변환
      const chainEntities: Chain[] = chains.map(
        (chain): Chain => ({
          geckoId: chain.gecko_id,
          tvl: chain.tvl,
          tokenSymbol: chain.tokenSymbol,
          cmcId: chain.cmcId,
          name: chain.name,
          chainId: chain.chainId,
        }),
      );

      // Repository의 saveMany 메서드 사용
      await this.chainRepository.saveMany(chainEntities);

      this.logger.debug(`Successfully saved ${chains.length} chains to database`);
    } catch (error) {
      this.logger.error('Error saving chains to database:', error);
      throw error;
    }
  }

  /**
   * 모든 Protocol 데이터를 가져와서 DB에 저장합니다.
   */
  public async saveAllProtocols(protocols: ProtocolResponse[]): Promise<void> {
    try {
      // API 응답 데이터를 DB 엔티티 형식으로 변환
      const protocolEntities: Protocol[] = protocols.map(
        (protocol): Protocol => ({
          protocolId: protocol.id, // API의 id를 protocolId로 매핑
          name: protocol.name,
          symbol: protocol.symbol,
          category: protocol.category,
          chains: protocol.chains,
          tvl: protocol.tvl,
          chainTvls: protocol.chainTvls,
          change_1d: protocol.change_1d,
          change_7d: protocol.change_7d,
        }),
      );

      // Repository의 saveMany 메서드 사용
      await this.protocolRepository.saveMany(protocolEntities);

      this.logger.debug(`Successfully saved ${protocols.length} protocols to database`);
    } catch (error) {
      this.logger.error('Error saving protocols to database:', error);
      throw error;
    }
  }

  /**
   * 모든 StableCoin 데이터를 가져와서 DB에 저장합니다.
   */
  public async saveStableCoins(stableCoins: StableCoinResponse[]): Promise<void> {
    try {
      // API 응답 데이터를 DB 엔티티 형식으로 변환
      const stableCoinEntities: StableCoin[] = stableCoins.map(
        (stableCoin): StableCoin => ({
          geckoId: stableCoin.geckoId,
          name: stableCoin.name,
          symbol: stableCoin.symbol,
          pegType: stableCoin.pegType,
          priceSource: stableCoin.priceSource,
          pegMechanism: stableCoin.pegMechanism,
          circulatingPeggedUSD: stableCoin.circulating.peggedUSD,
          circulatingPrevDayPeggedUSD: stableCoin.circulatingPrevDay.peggedUSD,
          circulatingPrevWeekPeggedUSD: stableCoin.circulatingPrevWeek.peggedUSD,
          circulatingPrevMonthPeggedUSD: stableCoin.circulatingPrevMonth.peggedUSD,
          chainCirculating: stableCoin.chainCirculating,
          chains: stableCoin.chains,
          price: stableCoin.price,
        }),
      );

      // Repository의 saveMany 메서드 사용
      await this.stableCoinRepository.saveMany(stableCoinEntities);

      this.logger.debug(`Successfully saved ${stableCoins.length} stableCoins to database`);
    } catch (error) {
      this.logger.error('Error saving stableCoins to database:', error);
      throw error;
    }
  }

  /**
   * 모든 YieldPool 데이터를 가져와서 DB에 저장합니다.
   */
  public async saveYieldPools(yieldPools: YieldPoolResponse[]): Promise<void> {
    try {
      // API 응답 데이터를 DB 엔티티 형식으로 변환
      const yieldPoolEntities: YieldPool[] = yieldPools.map(
        (yieldPool): YieldPool => ({
          chain: yieldPool.chain,
          project: yieldPool.project,
          symbol: yieldPool.symbol,
          tvlUsd: yieldPool.tvlUsd,
          apyBase: yieldPool.apyBase,
          apyReward: yieldPool.apyReward,
          apy: yieldPool.apy,
          rewardTokens: yieldPool.rewardTokens,
          pool: yieldPool.pool,
          apyPct1D: yieldPool.apyPct1D,
          apyPct7D: yieldPool.apyPct7D,
          apyPct30D: yieldPool.apyPct30D,
          stablecoin: yieldPool.stablecoin,
          ilRisk: yieldPool.ilRisk,
          exposure: yieldPool.exposure,
          predictions: yieldPool.predictions,
          poolMeta: yieldPool.poolMeta,
          mu: yieldPool.mu,
          sigma: yieldPool.sigma,
          count: yieldPool.count,
          outlier: yieldPool.outlier,
          underlyingTokens: yieldPool.underlyingTokens,
          il7d: yieldPool.il7d,
          apyBase7d: yieldPool.apyBase7d,
          apyMean30d: yieldPool.apyMean30d,
          volumeUsd1d: yieldPool.volumeUsd1d,
          volumeUsd7d: yieldPool.volumeUsd7d,
          apyBaseInception: yieldPool.apyBaseInception,
        }),
      );

      // Repository의 saveMany 메서드 사용
      await this.yieldPoolRepository.saveMany(yieldPoolEntities);

      this.logger.debug(`Successfully saved ${yieldPools.length} yieldPools to database`);
    } catch (error) {
      this.logger.error('Error saving yieldPools to database:', error);
      throw error;
    }
  }

  /**
   * DexInfo 데이터를 가져와서 DB에 저장합니다.
   */
  public async saveDexInfo(dexInfo: DexInfoResponse, chain: Chain, entityManager?: EntityManager) {
    const dexInfoEntity: DexInfo = {
      allChains: dexInfo.allChains,
      total24h: dexInfo.total24h,
      total48hto24h: dexInfo.total48hto24h,
      total7d: dexInfo.total7d,
      total14dto7d: dexInfo.total14dto7d,
      total60dto30d: dexInfo.total60dto30d,
      total30d: dexInfo.total30d,
      total1y: dexInfo.total1y,
      totalAllTime: dexInfo.totalAllTime,
      change_1d: dexInfo.change_1d,
      change_7d: dexInfo.change_7d,
      change_1m: dexInfo.change_1m,
      change_7dover7d: dexInfo.change_7dover7d,
      change_30dover30d: dexInfo.change_30dover30d,
      total7DaysAgo: dexInfo.total7DaysAgo,
      total30DaysAgo: dexInfo.total30DaysAgo,
      breakdown24h: dexInfo.breakdown24h,
      breakdown30d: dexInfo.breakdown30d,
      chain,
    };
    return await this.dexInfoRepository.saveOrUpdate(dexInfoEntity, entityManager);
  }

  /**
   * DexProtocol 데이터를 가져와서 DB에 저장합니다.
   */

  public async saveDexProtocols(
    dexProtocols: DexProtocolResponse[],
    dexInfo: DexInfo,
    entityManager?: EntityManager,
  ) {
    const dexProtocolEntities: DexProtocol[] = dexProtocols.map(
      (dexProtocol): DexProtocol => ({
        dexInfo: dexInfo,
        defillamaId: dexProtocol.defillamaId,
        name: dexProtocol.name,
        displayName: dexProtocol.displayName,
        module: dexProtocol.module,
        category: dexProtocol.category,
        logo: dexProtocol.logo,
        chains: dexProtocol.chains,
        protocolType: dexProtocol.protocolType,
        methodologyURL: dexProtocol.methodologyURL,
        methodology: dexProtocol.methodology,
        parentProtocol: dexProtocol.parentProtocol,
        slug: dexProtocol.slug,
        linkedProtocols: dexProtocol.linkedProtocols,
        id: dexProtocol.id,
        total24h: dexProtocol.total24h,
        total48hto24h: dexProtocol.total48hto24h,
        total7d: dexProtocol.total7d,
        total14dto7d: dexProtocol.total14dto7d,
        total60dto30d: dexProtocol.total60dto30d,
        total30d: dexProtocol.total30d,
        total1y: dexProtocol.total1y,
        totalAllTime: dexProtocol.totalAllTime,
        average1y: dexProtocol.average1y,
        monthlyAverage1y: dexProtocol.monthlyAverage1y,
        change_1d: dexProtocol.change_1d,
        change_7d: dexProtocol.change_7d,
        change_1m: dexProtocol.change_1m,
        change_7dover7d: dexProtocol.change_7dover7d,
        change_30dover30d: dexProtocol.change_30dover30d,
        total7DaysAgo: dexProtocol.total7DaysAgo,
        total30DaysAgo: dexProtocol.total30DaysAgo,
      }),
    );

    // Repository의 saveMany 메서드 사용
    return await this.dexProtocolRepository.saveMany(dexProtocolEntities, entityManager);
  }

  /**
   * FeeInfo 데이터를 가져와서 DB에 저장합니다.
   */
  public async saveFeeInfo(feeInfo: FeeInfoResponse, chain: Chain, entityManager?: EntityManager) {
    const feeInfoEntity: FeeInfo = {
      allChains: feeInfo.allChains,
      total24h: feeInfo.total24h,
      total48hto24h: feeInfo.total48hto24h,
      total7d: feeInfo.total7d,
      total14dto7d: feeInfo.total14dto7d,
      total60dto30d: feeInfo.total60dto30d,
      total30d: feeInfo.total30d,
      total1y: feeInfo.total1y,
      totalAllTime: feeInfo.totalAllTime,
      change_1d: feeInfo.change_1d,
      change_7d: feeInfo.change_7d,
      change_1m: feeInfo.change_1m,
      change_7dover7d: feeInfo.change_7dover7d,
      change_30dover30d: feeInfo.change_30dover30d,
      total7DaysAgo: feeInfo.total7DaysAgo,
      total30DaysAgo: feeInfo.total30DaysAgo,
      breakdown24h: feeInfo.breakdown24h,
      breakdown30d: feeInfo.breakdown30d,
      chain,
    };
    return await this.feeInfoRepository.saveOrUpdate(feeInfoEntity, entityManager);
  }

  /**
   * FeeProtocol 데이터를 가져와서 DB에 저장합니다.
   */

  public async saveFeeProtocols(
    feeProtocols: FeeProtocolResponse[],
    feeInfo: FeeInfo,
    entityManager?: EntityManager,
  ) {
    const feeProtocolEntities: FeeProtocol[] = feeProtocols.map(
      (feeProtocol): FeeProtocol => ({
        feeInfo: feeInfo,
        defillamaId: feeProtocol.defillamaId,
        name: feeProtocol.name,
        displayName: feeProtocol.displayName,
        module: feeProtocol.module,
        category: feeProtocol.category,
        logo: feeProtocol.logo,
        chains: feeProtocol.chains,
        protocolType: feeProtocol.protocolType,
        methodologyURL: feeProtocol.methodologyURL,
        methodology: feeProtocol.methodology,
        parentProtocol: feeProtocol.parentProtocol,
        slug: feeProtocol.slug,
        linkedProtocols: feeProtocol.linkedProtocols,
        id: feeProtocol.id,
        total24h: feeProtocol.total24h,
        total48hto24h: feeProtocol.total48hto24h,
        total7d: feeProtocol.total7d,
        total14dto7d: feeProtocol.total14dto7d,
        total60dto30d: feeProtocol.total60dto30d,
        total30d: feeProtocol.total30d,
        total1y: feeProtocol.total1y,
        totalAllTime: feeProtocol.totalAllTime,
        average1y: feeProtocol.average1y,
        monthlyAverage1y: feeProtocol.monthlyAverage1y,
        change_1d: feeProtocol.change_1d,
        change_7d: feeProtocol.change_7d,
        change_1m: feeProtocol.change_1m,
        change_7dover7d: feeProtocol.change_7dover7d,
        change_30dover30d: feeProtocol.change_30dover30d,
        total7DaysAgo: feeProtocol.total7DaysAgo,
        total30DaysAgo: feeProtocol.total30DaysAgo,
      }),
    );

    // Repository의 saveMany 메서드 사용
    return await this.feeProtocolRepository.saveMany(feeProtocolEntities, entityManager);
  }

  // call by scheduler
  public async queryDefiLlamaApiForBaseMainnet() {
    const chains = await this.getAllChains();
    const baseMainnet = chains.find((chain) => chain.name === 'Base');
    await this.saveAllChains([baseMainnet]);

    const protocols = await this.getAllProtocols();

    const baseProtocols = protocols.filter((protocol) =>
      protocol.chains.find((chain) => chain === 'Base'),
    );

    await this.saveAllProtocols(baseProtocols);

    const stableCoins = await this.getStableCoins();

    const baseStableCoins = stableCoins.filter((stableCoin) =>
      stableCoin.chains.find((chain) => chain === 'Base'),
    );
    await this.saveStableCoins(baseStableCoins);

    const yieldPools = await this.getYieldPools();

    // console.log('yieldPools: ', yieldPools);

    const baseYieldPools = yieldPools.filter((yieldPool) => yieldPool.chain === 'Base');

    await this.saveYieldPools(baseYieldPools);

    await this.getDexInfo(baseMainnet.name);

    await this.getFeeInfo(baseMainnet.name);
  }
}
