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
  private static instance;
  proxyProvided: boolean;
  gatewayServiceConfig: {
    hostname: string | null;
    protocol: string | null;
    port: number | null;
  };
  constructor(options: Record<string, any>);
  static get Instance(): SettingsService;
  private setSettingsExpiry;
  private normalizeSettings;
  private handleBrowserEnvironment;
  private handleServerEnvironment;
  private fetchSettingsAndCacheInStorage;
  fetchSettings(isViaWebhook?: boolean): Promise<Record<any, any>>;
  getSettings(forceFetch?: boolean): Promise<Record<any, any>>;
}
export {};
