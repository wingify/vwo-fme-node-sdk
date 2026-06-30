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
import { ContextModel } from '../../../models/user/ContextModel';
import { ServiceContainer } from '../../../services/ServiceContainer';
/**
 * Normalizes Web Testing campaign map keys and variation values to strings.
 * @param {Record<string, unknown>} rawAssignments - The raw assignments map from the context.
 * @returns {Record<string, string>} - The normalized assignments map with campaignId as key and variationId as value.
 */
export declare function normalizeWebTestingCampaignsMap(
  rawAssignments: Record<string, unknown>,
): Record<string, string>;
/**
 * Parses `context.platformVariables.webTestingCampaigns` (JSON string or plain object).
 * @param {ContextModel} context - The context model containing platform variables for the evaluation.
 * @param {ServiceContainer} serviceContainer - The service container for accessing services like the log manager.
 * @returns {Record<string, string> | null} A record mapping campaign IDs to variation IDs, or null if invalid/missing.
 */
export declare function parseWebTestingCampaignsFromContext(
  context: ContextModel,
  serviceContainer: ServiceContainer,
): Record<string, string> | null;
/**
 * Evaluates campaignVariation operand encoding:
 * - "!C" — user is not in campaign C (no entry in map)
 * - "C_!V" — user is in campaign C and assigned variation is not V
 * - "C_V" — user is in campaign C with variation V
 * - "C" (digits only) — user is in campaign C (any variation)
 */
export declare function evaluateWebTestingCampaignVariation(
  campaignVariationOperand: string,
  assignedVariationsByCampaignId: Record<string, string> | null,
): {
  result: boolean;
  invalidFormat: boolean;
};
