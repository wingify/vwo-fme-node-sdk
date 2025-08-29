/**
 * Sends an init called event to VWO.
 * This event is triggered when the init function is called.
 * @param {number} settingsFetchTime - Time taken to fetch settings in milliseconds.
 * @param {number} sdkInitTime - Time taken to initialize the SDK in milliseconds.
 */
export declare function sendSdkInitEvent(settingsFetchTime?: number, sdkInitTime?: number): Promise<void>;
/**
 * Sends a usage stats event to VWO.
 * This event is triggered when the SDK is initialized.
 * @returns A promise that resolves to the response from the server.
 */
export declare function sendSDKUsageStatsEvent(usageStatsAccountId: number): Promise<void>;
