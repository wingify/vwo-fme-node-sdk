import { ApiEnum } from '../enums/ApiEnum';
interface ISettingsService {
  sdkKey: string;
  getSettings(forceFetch: boolean): Promise<Record<any, any>>;
  fetchSettings(): Promise<Record<any, any>>;
}
export declare class SettingsService implements ISettingsService {
  sdkKey: string;
  accountId: number;
  expiry: number;
  networkTimeout: number;
  hostname: string;
  port: number;
  protocol: string;
  isGatewayServiceProvided: boolean;
  settingsFetchTime: number | undefined;
  private static instance;
  isSettingsValid: boolean;
  proxyProvided: boolean;
  isStorageServiceProvided: boolean;
  isEdgeEnvironment: boolean;
  gatewayServiceConfig: {
    hostname: string | null;
    protocol: string | null;
    port: number | null;
  };
  constructor(options: Record<string, any>);
  static get Instance(): SettingsService;
  normalizeSettings(settings: Record<any, any>): Promise<Record<any, any>>;
  fetchSettings(isViaWebhook?: boolean, apiName?: ApiEnum): Promise<Record<any, any>>;
  /**
     * Gets the settings, fetching them if not cached from storage or server.
     s* @returns {Promise<Record<any, any>>} A promise that resolves to the settings.
     */
  getSettings(): Promise<Record<any, any>>;
}
export {};
