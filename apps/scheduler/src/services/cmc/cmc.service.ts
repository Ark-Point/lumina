import { CMCCryptoCurrency, CMCCryptoCurrencyRepository } from '@lumina-backend/database';
import { Injectable, Logger } from '@nestjs/common';
import Axios, { AxiosInstance } from 'axios';
import { DataSource } from 'typeorm';
import { CMCCryptoCurrencyResponseData, CMCCryptoCurrencySort } from './interfaces/cmc.response';

@Injectable()
export class CMCService {
  private readonly logger = new Logger(CMCService.name);
  private cmcApiInstance: AxiosInstance;
  private cmcApiBaseURL: string;

  constructor(
    private readonly cmcCryptocurrencyRepository: CMCCryptoCurrencyRepository,
    private readonly dataSource: DataSource,
  ) {
    this.cmcApiBaseURL = process.env.CMC_API_BASE_URL;
    this.cmcApiInstance = Axios.create({
      baseURL: this.cmcApiBaseURL,
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
      },
    });
  }

  //
  async getCryptocurrenciesCMC() {
    const endpoint = '/v1/cryptocurrency/listings/latest';

    const queryParams: {
      sort?: CMCCryptoCurrencySort;
      limit?: number;
    } = {
      sort: 'market_cap',
      limit: 500,
    };

    try {
      const getCryptocurrencies = await this.cmcApiInstance.get(endpoint, {
        params: queryParams,
      });

      this.logger.debug(
        `[${this.getCryptocurrenciesCMC.name}] ${endpoint}\n response: `,
        getCryptocurrencies?.data?.status,
      );
      const cmcCryptocurrencies: CMCCryptoCurrencyResponseData[] = getCryptocurrencies?.data?.data;

      const savedCMCCryptocurrencies = await this.saveAllCMCCryptocurrencies(cmcCryptocurrencies);

      this.logger.debug(
        `[${this.getCryptocurrenciesCMC.name}] Successfully saved ${savedCMCCryptocurrencies.length} cmcCryptocurrencies to database`,
      );
    } catch (error) {
      this.logger.error(`[${this.getCryptocurrenciesCMC.name}] error: \n`, error);
    }
  }

  async saveAllCMCCryptocurrencies(cmcCryptocurrencyDatas: CMCCryptoCurrencyResponseData[]) {
    try {
      const cmcCryptocurrencies: CMCCryptoCurrency[] = cmcCryptocurrencyDatas.map(
        (cryptoCurrency): CMCCryptoCurrency => ({
          cmcId: cryptoCurrency.id,
          name: cryptoCurrency.name,
          symbol: cryptoCurrency.symbol,
          slug: cryptoCurrency.slug,
          numMarketPairs: cryptoCurrency.num_market_pairs,
          dateAdded: cryptoCurrency.date_added,
          tags: cryptoCurrency.tags,
          maxSupply: cryptoCurrency.max_supply,
          circulatingSupply: cryptoCurrency.circulating_supply,
          totalSupply: cryptoCurrency.total_supply,
          infiniteSupply: cryptoCurrency.infinite_supply,
          platform: cryptoCurrency.platform,
          cmcRank: cryptoCurrency.cmc_rank,
          selfReportedCirculatingSupply: cryptoCurrency.self_reported_circulating_supply,
          selfReportedMarketCap: cryptoCurrency.self_reported_market_cap,
          tvlRatio: cryptoCurrency.tvl_ratio,
          lastUpdated: cryptoCurrency.last_updated,
          quote: cryptoCurrency.quote,
        }),
      );

      return await this.cmcCryptocurrencyRepository.saveMany(cmcCryptocurrencies);
    } catch (error) {
      this.logger.error(
        `[${this.saveAllCMCCryptocurrencies.name}] Error saving cmc-crypto-currencies to database:`,
        error,
      );
      throw error;
    }
  }
}
