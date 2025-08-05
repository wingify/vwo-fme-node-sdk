/**
 * Sends an init called event to VWO.
 * This event is triggered when the init function is called.
 * @param {number} settingsFetchTime - Time taken to fetch settings in milliseconds.
 * @param {number} sdkInitTime - Time taken to initialize the SDK in milliseconds.
 */
export declare function sendSdkInitEvent(settingsFetchTime?: number, sdkInitTime?: number): Promise<void>;
