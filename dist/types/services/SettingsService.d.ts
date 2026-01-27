import { LogManager } from '../packages/logger';
import { ApiEnum } from '../enums/ApiEnum';
import { ServiceContainer } from './ServiceContainer';
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
  isSettingsValid: boolean;
  proxyProvided: boolean;
  isStorageServiceProvided: boolean;
  isEdgeEnvironment: boolean;
  isSettingsProvidedInInit: boolean;
  startTimeForInit: number | undefined;
  logManager: LogManager;
  gatewayServiceConfig: {
    hostname: string | null;
    protocol: string | null;
    port: number | null;
  };
  private serviceContainer;
  constructor(options: Record<string, any>, logManager: LogManager);
  /**
   * Injects the service container into the settings service.
   * @param {ServiceContainer} serviceContainer - The service container to inject.
   */
  injectServiceContainer(serviceContainer: ServiceContainer): void;
  /**
   * Check if proxy is provided
   * @returns {boolean} - True if proxy is provided, false otherwise
   */
  isProxyProvided(): boolean;
  /**
   * Normalize the settings
   * @param settings - The settings to normalize
   * @returns {Record<any, any>} - The normalized settings
   */
  normalizeSettings(settings: Record<any, any>): Record<any, any>;
  fetchSettings(isViaWebhook?: boolean, apiName?: ApiEnum): Promise<Record<any, any>>;
  /**
     * Gets the settings, fetching them if not cached from storage or server.
     s* @returns {Promise<Record<any, any>>} A promise that resolves to the settings.
     */
  getSettings(): Promise<Record<any, any>>;
}
export {};
