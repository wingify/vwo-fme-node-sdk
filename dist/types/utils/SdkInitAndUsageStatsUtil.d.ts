import { ServiceContainer } from '../services/ServiceContainer';
import { UsageStatsUtil } from './UsageStatsUtil';
/**
 * Sends an init called event to VWO.
 * This event is triggered when the init function is called.
 * @param {number} settingsFetchTime - Time taken to fetch settings in milliseconds.
 * @param {number} sdkInitTime - Time taken to initialize the SDK in milliseconds.
 * @param {ServiceContainer} serviceContainer - The service container instance.
 */
export declare function sendSdkInitEvent(
  settingsFetchTime: number,
  sdkInitTime: number,
  serviceContainer: ServiceContainer,
): Promise<void>;
/**
 * Sends a usage stats event to VWO.
 * This event is triggered when the SDK is initialized.
 * @returns A promise that resolves to the response from the server.
 */
export declare function sendSDKUsageStatsEvent(
  usageStatsAccountId: number,
  serviceContainer: ServiceContainer,
  usageStatsUtil: UsageStatsUtil,
): Promise<void>;
