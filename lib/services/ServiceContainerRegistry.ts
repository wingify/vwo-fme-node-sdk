/**
 * Copyright 2024-2026 Wingify Software Pvt. Ltd.
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
import { ServiceContainer } from './ServiceContainer';

const registeredServiceContainers = new Set<ServiceContainer>();

/**
 * Tracks every initialized SDK client so consent withdrawal can clear storage on all of them.
 */
export const ServiceContainerRegistry = {
  /**
   * Adds a client container when init completes.
   *
   * @param serviceContainer - Container for one initialized client instance.
   * @returns {void}
   */
  register(serviceContainer: ServiceContainer): void {
    // Consent withdrawal later walks every live client, so init must record this one.
    registeredServiceContainers.add(serviceContainer);
  },

  /**
   * Removes a client container when shutdown completes.
   *
   * @param serviceContainer - Container that is shutting down.
   * @returns {void}
   */
  unregister(serviceContainer: ServiceContainer): void {
    // A shut-down client must not receive later storage deletes.
    registeredServiceContainers.delete(serviceContainer);
  },

  /**
   * Returns all live client containers in this process.
   *
   * @returns {ServiceContainer[]} Array of registered service containers.
   */
  getAll(): ServiceContainer[] {
    // Copy the set so callers cannot mutate the registry by editing the array.
    return Array.from(registeredServiceContainers);
  },

  /**
   * Clears the registry. Used by tests only.
   *
   * @returns {void}
   */
  clearForTests(): void {
    // Tests share one process, so leftover clients would leak into the next case.
    registeredServiceContainers.clear();
  },
};
