/**
 * Copyright 2024-2025 Wingify Software Pvt. Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Manages usage statistics for the SDK.
 * Tracks various features and configurations being used by the client.
 * Implements Singleton pattern to ensure a single instance.
 */
export declare class UsageStatsUtil {
  /** Singleton instance */
  private static instance;
  /** Internal storage for usage statistics data */
  private usageStatsData;
  /** Private constructor to prevent direct instantiation */
  private constructor();
  /**
   * Provides access to the singleton instance of UsageStatsUtil.
   *
   * @returns The single instance of UsageStatsUtil
   */
  static getInstance(): UsageStatsUtil;
  /**
   * Sets usage statistics based on provided options.
   * Maps various SDK features and configurations to boolean flags.
   *
   * @param options - Configuration options for the SDK
   * @param options.storage - Storage service configuration
   * @param options.logger - Logger configuration
   * @param options.eventBatching - Event batching configuration
   * @param options.integrations - Integrations configuration
   * @param options.pollingInterval - Polling interval configuration
   * @param options.sdkName - SDK name configuration
   */
  setUsageStats(options: any): void;
  /**
   * Retrieves the current usage statistics.
   *
   * @returns Record containing boolean flags for various SDK features in use
   */
  getUsageStats(): Record<string, boolean | string | number>;
  /**
   * Clears the usage statistics data.
   */
  clearUsageStats(): void;
}
