import { ServiceContainer } from '../services/ServiceContainer';
import { UsageStatsUtil } from './UsageStatsUtil';
/**
 * Sends an init called event to Wingify.
 * This event is triggered when the init function is called.
 * @param serviceContainer - The service container instance.
 */
export declare function sendSdkInitEvent(serviceContainer: ServiceContainer): Promise<void>;
/**
 * Sends a usage stats event to Wingify.
 * This event is triggered when the SDK is initialized.
 * @param usageStatsAccountId - The account ID used for usage-stats reporting.
 * @param serviceContainer - The service container instance.
 * @param usageStatsUtil - The usage-stats payload builder.
 */
export declare function sendSDKUsageStatsEvent(
  usageStatsAccountId: number,
  serviceContainer: ServiceContainer,
  usageStatsUtil: UsageStatsUtil,
  settingsFetchTime?: number,
  sdkInitTime?: number,
): Promise<void>;
