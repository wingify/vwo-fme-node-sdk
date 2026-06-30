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
import { ApiEnum } from '../../../enums/ApiEnum';
import { getType, isArray, isNull, isObject, isString, isUndefined } from '../../../utils/DataTypeUtil';

/**
 * Normalizes Web Testing campaign map keys and variation values to strings.
 * @param {Record<string, unknown>} rawAssignments - The raw assignments map from the context.
 * @returns {Record<string, string>} - The normalized assignments map with campaignId as key and variationId as value.
 */
export function normalizeWebTestingCampaignsMap(rawAssignments: Record<string, unknown>): Record<string, string> {
  // Turn the raw assignments map into a simple string map for regex matching.
  const campaignIdToVariationId: Record<string, string> = {};
  for (const campaignId of Object.keys(rawAssignments)) {
    const assignedVariationId = rawAssignments[campaignId];
    if (
      !isUndefined(assignedVariationId) &&
      !isNull(assignedVariationId) &&
      String(campaignId).length > 0
      // Ignore empty keys; null/undefined variations mean nothing assigned for that id.
    ) {
      campaignIdToVariationId[String(campaignId)] = String(assignedVariationId);
    }
  }
  return campaignIdToVariationId;
}

/**
 * Parses `context.platformVariables.webTestingCampaigns` (JSON string or plain object).
 * @param {ContextModel} context - The context model containing platform variables for the evaluation.
 * @param {ServiceContainer} serviceContainer - The service container for accessing services like the log manager.
 * @returns {Record<string, string> | null} A record mapping campaign IDs to variation IDs, or null if invalid/missing.
 */
export function parseWebTestingCampaignsFromContext(
  context: ContextModel,
  serviceContainer: ServiceContainer,
): Record<string, string> | null {
  const webTestingCampaignsInput = context.getPlatformVariables()?.webTestingCampaigns;
  // No payload from the integration means empty assignments map.
  if (isNull(webTestingCampaignsInput) || isUndefined(webTestingCampaignsInput)) {
    return null;
  }

  // SDK already forwarded a plain campaignId -> variationId object.
  if (isObject(webTestingCampaignsInput)) {
    return normalizeWebTestingCampaignsMap(webTestingCampaignsInput as Record<string, unknown>);
  }

  // Some stacks pass JSON text (cookie, SSR prop, tag); parse it only if it's an object.
  if (isString(webTestingCampaignsInput)) {
    const trimmedWebTestingCampaignsJson = webTestingCampaignsInput.trim();
    if (trimmedWebTestingCampaignsJson === '') {
      // Empty JSON string is invalid.
      return null;
    }
    try {
      // extract all "key": tokens and check for duplicates before parsing swallows them
      const allCampaignIdTokens = trimmedWebTestingCampaignsJson.match(/"([^"\\]*)"\s*:/g);
      if (allCampaignIdTokens) {
        const campaignIds = allCampaignIdTokens.map((token) => token.replace(/"\s*:$/, '').slice(1));
        const hasDuplicateCampaignId = campaignIds.length !== new Set(campaignIds).size;
        if (hasDuplicateCampaignId) {
          serviceContainer
            .getLogManager()
            .errorLog(
              'INVALID_WEB_TESTING_CAMPAIGNS_DUPLICATE_KEY',
              {},
              { an: ApiEnum.GET_FLAG, uuid: context.getUuid(), sId: context.getSessionId() },
            );
        }
      }
      // Parse the JSON string into an object.
      const parsedAssignments: unknown = JSON.parse(trimmedWebTestingCampaignsJson);
      if (isObject(parsedAssignments)) {
        return normalizeWebTestingCampaignsMap(parsedAssignments as Record<string, unknown>);
      }
      // Parsed fine but it's an array/string/etc. Invalid shape.
      serviceContainer
        .getLogManager()
        .errorLog(
          'INVALID_WEB_TESTING_CAMPAIGNS_JSON',
          {},
          { an: ApiEnum.GET_FLAG, uuid: context.getUuid(), sId: context.getSessionId() },
        );
    } catch {
      // Malformed JSON; treat like missing assignments.
      serviceContainer
        .getLogManager()
        .errorLog(
          'INVALID_WEB_TESTING_CAMPAIGNS_JSON',
          {},
          { an: ApiEnum.GET_FLAG, uuid: context.getUuid(), sId: context.getSessionId() },
        );
    }
    return null;
  }

  // Booleans/numbers/other odd types are invalid.
  if (!isUndefined(webTestingCampaignsInput) && !isNull(webTestingCampaignsInput)) {
    const kind = isArray(webTestingCampaignsInput) ? 'array' : getType(webTestingCampaignsInput).toLowerCase();
    serviceContainer
      .getLogManager()
      .errorLog(
        'INVALID_WEB_TESTING_CAMPAIGNS_TYPE',
        { kind },
        { an: ApiEnum.GET_FLAG, uuid: context.getUuid(), sId: context.getSessionId() },
      );
  }
  return null;
}

/**
 * Evaluates campaignVariation operand encoding:
 * - "!C" — user is not in campaign C (no entry in map)
 * - "C_!V" — user is in campaign C and assigned variation is not V
 * - "C_V" — user is in campaign C with variation V
 * - "C" (digits only) — user is in campaign C (any variation)
 */
export function evaluateWebTestingCampaignVariation(
  campaignVariationOperand: string,
  assignedVariationsByCampaignId: Record<string, string> | null,
): { result: boolean; invalidFormat: boolean } {
  // Null means empty assignments map.
  const assignments = assignedVariationsByCampaignId ?? {};

  // !123 — user should not be in campaign 123.
  let match = /^!(\d+)$/.exec(campaignVariationOperand);
  if (match) {
    const campaignId = match[1];
    return { result: !Object.prototype.hasOwnProperty.call(assignments, campaignId), invalidFormat: false };
  }

  // 123_!4 — in campaign 123 but not the variation 4.
  match = /^(\d+)_!(\d+)$/.exec(campaignVariationOperand);
  if (match) {
    const campaignId = match[1];
    const variationId = match[2];
    if (!Object.prototype.hasOwnProperty.call(assignments, campaignId)) {
      return { result: false, invalidFormat: false };
    }
    return { result: assignments[campaignId] !== variationId, invalidFormat: false };
  }

  // 123_4 — must be exactly that campaign and variation.
  match = /^(\d+)_(\d+)$/.exec(campaignVariationOperand);
  if (match) {
    const campaignId = match[1];
    const variationId = match[2];
    if (!Object.prototype.hasOwnProperty.call(assignments, campaignId)) {
      return { result: false, invalidFormat: false };
    }
    return { result: assignments[campaignId] === variationId, invalidFormat: false };
  }

  // 123 — in the campaign, any variation counts.
  match = /^(\d+)$/.exec(campaignVariationOperand);
  if (match) {
    const campaignId = match[1];
    return { result: Object.prototype.hasOwnProperty.call(assignments, campaignId), invalidFormat: false };
  }

  // Invalid format.
  return { result: false, invalidFormat: true };
}
