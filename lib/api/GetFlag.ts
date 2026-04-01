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

import { StorageDecorator } from '../decorators/StorageDecorator';
import { ApiEnum } from '../enums/ApiEnum';
import { CampaignTypeEnum } from '../enums/CampaignTypeEnum';
import { DebugLogMessagesEnum, InfoLogMessagesEnum } from '../enums/log-messages';
import { CampaignModel } from '../models/campaign/CampaignModel';
import { VariableModel } from '../models/campaign/VariableModel';
import { VariationModel } from '../models/campaign/VariationModel';
import { ContextModel } from '../models/user/ContextModel';
import { LogLevelEnum } from '../packages/logger';
import { StorageService } from '../services/StorageService';
import { getVariationFromCampaignKey, isFeatureIdPresentInSettings } from '../utils/CampaignUtil';
import { isObject, isArray } from '../utils/DataTypeUtil';
import { evaluateTrafficAndGetVariation } from '../utils/DecisionUtil';
import { getAllExperimentRules, getFeatureFromKey, getSpecificRulesBasedOnType } from '../utils/FunctionUtil';
import { buildMessage } from '../utils/LogMessageUtil';
import { Deferred } from '../utils/PromiseUtil';
import { evaluateRule } from '../utils/RuleEvaluationUtil';
import { extractDecisionKeys, sendDebugEventToVWO } from '../utils/DebuggerServiceUtil';
import { DebuggerCategoryEnum } from '../enums/DebuggerCategoryEnum';
import { Constants } from '../constants';
import { ServiceContainer } from '../services/ServiceContainer';
import { getApplicableHoldouts, getMatchedHoldouts, sendNetworkCallsForNotInHoldouts } from '../utils/HoldoutUtil';
import { sendImpressionForVariationShown, sendImpressionForVariationShownInBatch } from '../utils/ImpressionUtil';
import { EventEnum } from '../enums/EventEnum';
import { getTrackUserPayloadData } from '../utils/NetworkUtil';
export class Flag {
  private readonly enabled: boolean;
  private variation: VariationModel | Record<string, any> | undefined;
  private readonly sessionId: number;
  private readonly uuid: string;

  constructor(
    isEnabled: boolean,
    sessionId: number,
    uuid: string,
    variation?: VariationModel | Record<string, any> | undefined,
  ) {
    this.enabled = isEnabled;
    this.variation = variation;
    this.sessionId = sessionId;
    this.uuid = uuid;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getSessionId(): number {
    return this.sessionId;
  }

  getUUID(): string {
    return this.uuid;
  }

  getVariables(): Record<string, unknown>[] {
    return this.variation?.getVariables() || [];
  }

  // Overloads to give correct return types
  getVariable<T = unknown>(key: string): T | undefined;
  getVariable<T = unknown>(key: string, defaultValue: T): T;

  getVariable<T = unknown>(key: string, defaultValue?: T): T | undefined {
    const value = this.variation
      ?.getVariables()
      .find((variable) => VariableModel.modelFromDictionary(variable).getKey() === key)
      ?.getValue();

    return value !== undefined ? (value as T) : defaultValue;
  }
}

export class FlagApi {
  static async get(featureKey: string, context: ContextModel, serviceContainer: ServiceContainer): Promise<Flag> {
    let isEnabled = false;
    let rolloutVariationToReturn = null;
    let experimentVariationToReturn = null;
    let shouldCheckForExperimentsRules = false;

    const passedRulesInformation = {}; // for storing and integration callback
    const deferredObject = new Deferred();
    const evaluatedFeatureMap: Map<string, any> = new Map();
    const notInHoldoutIds: Array<string | number> = [];

    const batchPayload: any[] = [];

    // get feature object from feature key
    const feature = getFeatureFromKey(serviceContainer.getSettings(), featureKey);
    const decision = {
      featureName: feature?.getName(),
      featureId: feature?.getId(),
      featureKey: feature?.getKey(),
      userId: context?.getId(),
      api: ApiEnum.GET_FLAG,
      holdoutIDs: [],
      isPartOfHoldout: false,
      isHoldoutPresent: false,
      isUserPartOfCampaign: false,
    };

    // create debug event props
    const debugEventProps: Record<string, any> = {
      an: ApiEnum.GET_FLAG,
      uuid: context.getUuid(),
      fk: feature?.getKey(),
      sId: context.getSessionId(),
    };

    const storageService = new StorageService(serviceContainer);
    const storedData: Record<any, any> = await new StorageDecorator().getFeatureFromStorage(
      featureKey,
      context,
      storageService,
      serviceContainer,
    );

    // if storedData has isInHoldoutId, then check if the settings stil contain atleast 1 holdoutGroup that is present in the storedData
    const storedIsInHoldoutId = storedData?.isInHoldoutId ?? storedData?.holdoutGroupId;
    const storedNotInHoldoutId = storedData?.notInHoldoutId ?? [];
    if (storedIsInHoldoutId && (isArray(storedIsInHoldoutId) ? storedIsInHoldoutId.length > 0 : true)) {
      // get all appicable holdouts for the feature
      const applicableHoldouts = getApplicableHoldouts(serviceContainer.getSettings(), feature.getId());
      if (applicableHoldouts.length > 0) {
        for (const holdout of applicableHoldouts) {
          // if the holdout id is present in the storedData, then return the disabled flag
          if (storedIsInHoldoutId.includes(holdout.getId())) {
            serviceContainer.getLogManager().info(
              buildMessage(InfoLogMessagesEnum.STORED_HOLDOUT_DECISION_FOUND, {
                featureKey,
                userId: context.getId(),
                holdoutId: storedIsInHoldoutId,
              }),
            );

            // evaluate the new holdouts in settings file and send the impression for them
            const { matchedHoldouts, notMatchedHoldouts, holdoutPayloads } = await getMatchedHoldouts(
              serviceContainer,
              feature,
              context,
              storedData,
            );

            // updatedHoldoutIds is the array of holdout ids for which user became part of the holdouts
            const updatedHoldoutIds = [...storedIsInHoldoutId, ...matchedHoldouts.map((holdout) => holdout.getId())];
            const updatedNotInHoldoutIds = [
              ...storedNotInHoldoutId,
              ...notMatchedHoldouts.map((holdout) => holdout.getId()),
            ];
            // store the updated holdout ids in storage and push the updated not in holdout ids to the notInHoldoutIds array
            new StorageDecorator().setDataInStorage(
              {
                featureKey,
                context,
                isInHoldoutId: updatedHoldoutIds,
                notInHoldoutId: updatedNotInHoldoutIds,
              },
              storageService,
              serviceContainer,
            );

            // send the impression for the new holdouts
            if (serviceContainer.getSettingsService().isGatewayServiceProvided) {
              for (const payload of holdoutPayloads) {
                sendImpressionForVariationShown(
                  serviceContainer,
                  payload.d.event.props.id,
                  payload.d.event.props.variation,
                  context,
                  featureKey,
                  payload,
                );
              }
            } else if (serviceContainer.getBatchEventsQueue()) {
              for (const payload of holdoutPayloads) {
                serviceContainer.getBatchEventsQueue().enqueue(payload);
              }
            } else {
              if (serviceContainer.getShouldWaitForTrackingCalls()) {
                await sendImpressionForVariationShownInBatch(serviceContainer, holdoutPayloads);
              } else {
                sendImpressionForVariationShownInBatch(serviceContainer, holdoutPayloads);
              }
            }

            deferredObject.resolve(new Flag(false, context.getSessionId(), context.getUuid(), new VariationModel()));
            return deferredObject.promise;
          }
        }
      }
    }

    if (storedData?.featureId && isFeatureIdPresentInSettings(serviceContainer.getSettings(), storedData.featureId)) {
      if (storedData?.experimentVariationId) {
        if (storedData.experimentKey) {
          const variation: VariationModel = getVariationFromCampaignKey(
            serviceContainer.getSettings(),
            storedData.experimentKey,
            storedData.experimentVariationId,
          );

          if (variation) {
            serviceContainer.getLogManager().info(
              buildMessage(InfoLogMessagesEnum.STORED_VARIATION_FOUND, {
                variationKey: variation.getKey(),
                userId: context.getId(),
                experimentType: 'experiment',
                experimentKey: storedData.experimentKey,
              }),
            );
            decision.isUserPartOfCampaign = true;

            // network calls for holdouts that are newly added in settings and are not present in storage
            await sendNetworkCallsForNotInHoldouts(
              serviceContainer,
              feature,
              context,
              decision,
              storedData,
              storageService,
            );

            deferredObject.resolve(new Flag(true, context.getSessionId(), context.getUuid(), variation));
            return deferredObject.promise;
          }
        }
      } else if (storedData?.rolloutKey && storedData?.rolloutId) {
        const variation: VariationModel = getVariationFromCampaignKey(
          serviceContainer.getSettings(),
          storedData.rolloutKey,
          storedData.rolloutVariationId,
        );
        if (variation) {
          serviceContainer.getLogManager().info(
            buildMessage(InfoLogMessagesEnum.STORED_VARIATION_FOUND, {
              variationKey: variation.getKey(),
              userId: context.getId(),
              experimentType: 'rollout',
              experimentKey: storedData.rolloutKey,
            }),
          );

          decision.isUserPartOfCampaign = true;

          serviceContainer.getLogManager().debug(
            buildMessage(DebugLogMessagesEnum.EXPERIMENTS_EVALUATION_WHEN_ROLLOUT_PASSED, {
              userId: context.getId(),
            }),
          );

          // network calls for holdouts that are newly added in settings and are not present in storage
          // and return the updated not in holdout ids
          const updatedNotInHoldoutIds = await sendNetworkCallsForNotInHoldouts(
            serviceContainer,
            feature,
            context,
            decision,
            storedData,
            storageService,
          );
          // push the updated not in holdout ids to the notInHoldoutIds array
          notInHoldoutIds.push(...updatedNotInHoldoutIds);

          isEnabled = true;
          shouldCheckForExperimentsRules = true;
          rolloutVariationToReturn = variation;
          const featureInfo = {
            rolloutId: storedData.rolloutId,
            rolloutKey: storedData.rolloutKey,
            rolloutVariationId: storedData.rolloutVariationId,
          };
          evaluatedFeatureMap.set(featureKey, featureInfo);
          Object.assign(passedRulesInformation, featureInfo);
        }
      }
    }

    if (!isObject(feature) || feature === undefined) {
      serviceContainer.getLogManager().errorLog(
        'FEATURE_NOT_FOUND',
        {
          featureKey,
        },
        debugEventProps,
      );

      deferredObject.reject({});

      return deferredObject.promise;
    }

    await serviceContainer.getSegmentationManager().setContextualData(serviceContainer, feature, context);

    if (!isEnabled) {
      // Holdout group exclusion: if user falls into any holdout group for this feature, return disabled
      const { matchedHoldouts, notMatchedHoldouts, holdoutPayloads } = await getMatchedHoldouts(
        serviceContainer,
        feature,
        context,
        storedData,
      );

      decision.isPartOfHoldout = matchedHoldouts !== null && matchedHoldouts.length > 0;
      if (
        (matchedHoldouts !== null && matchedHoldouts.length > 0) ||
        (notMatchedHoldouts !== null && notMatchedHoldouts.length > 0)
      ) {
        decision.isHoldoutPresent = true;
      }

      if (matchedHoldouts !== null && matchedHoldouts.length > 0) {
        const qualifiedHoldoutNames = matchedHoldouts.map((holdout) => holdout.getName()).join(',');
        decision.holdoutIDs = matchedHoldouts.map((holdout) => holdout.getId());

        serviceContainer.getLogManager().info(
          buildMessage(InfoLogMessagesEnum.USER_IN_HOLDOUT_GROUP, {
            userId: context.getId(),
            holdoutGroupName: qualifiedHoldoutNames,
            featureKey,
          }),
        );

        // Store holdout decision in storage
        new StorageDecorator().setDataInStorage(
          {
            featureKey,
            context,
            isInHoldoutId: matchedHoldouts.map((holdout) => holdout.getId()),
            notInHoldoutId: notMatchedHoldouts.map((holdout) => holdout.getId()),
          },
          storageService,
          serviceContainer,
        );

        decision['isEnabled'] = false;

        serviceContainer.getHooksService().set(decision);
        serviceContainer.getHooksService().execute(serviceContainer.getHooksService().get());

        if (serviceContainer.getSettingsService().isGatewayServiceProvided) {
          for (const payload of holdoutPayloads) {
            sendImpressionForVariationShown(
              serviceContainer,
              payload.d.event.props.id,
              payload.d.event.props.variation,
              context,
              featureKey,
              payload,
            );
          }
        } else if (serviceContainer.getBatchEventsQueue()) {
          for (const payload of holdoutPayloads) {
            serviceContainer.getBatchEventsQueue().enqueue(payload);
          }
        } else {
          if (serviceContainer.getShouldWaitForTrackingCalls()) {
            await sendImpressionForVariationShownInBatch(serviceContainer, holdoutPayloads);
          } else {
            sendImpressionForVariationShownInBatch(serviceContainer, holdoutPayloads);
          }
        }

        deferredObject.resolve(new Flag(false, context.getSessionId(), context.getUuid(), new VariationModel()));
        return deferredObject.promise;
      } else {
        serviceContainer.getLogManager().info(
          buildMessage(InfoLogMessagesEnum.USER_NOT_EXCLUDED_DUE_TO_HOLDOUT, {
            featureKey,
            userId: context.getId(),
          }),
        );
        notInHoldoutIds.push(...notMatchedHoldouts.map((holdout) => holdout.getId()));

        if (serviceContainer.getSettingsService().isGatewayServiceProvided) {
          for (const payload of holdoutPayloads) {
            sendImpressionForVariationShown(
              serviceContainer,
              payload.d.event.props.id,
              payload.d.event.props.variation,
              context,
              featureKey,
              payload,
            );
          }
        } else if (serviceContainer.getBatchEventsQueue()) {
          for (const payload of holdoutPayloads) {
            serviceContainer.getBatchEventsQueue().enqueue(payload);
          }
        } else {
          batchPayload.push(...holdoutPayloads);
        }
      }
    }

    const rollOutRules = getSpecificRulesBasedOnType(feature, CampaignTypeEnum.ROLLOUT); // get all rollout rules

    if (rollOutRules.length > 0 && !isEnabled) {
      const rolloutRulesToEvaluate = [];

      for (const rule of rollOutRules) {
        const { preSegmentationResult, updatedDecision, payload } = await evaluateRule(
          serviceContainer,
          feature,
          rule,
          context,
          evaluatedFeatureMap,
          null,
          storageService,
          decision,
        );

        Object.assign(decision, updatedDecision);

        if (preSegmentationResult) {
          // if pre segment passed, then break the loop and check the traffic allocation
          rolloutRulesToEvaluate.push(rule);

          if (serviceContainer.getShouldWaitForTrackingCalls()) {
            if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
              await sendImpressionForVariationShown(
                serviceContainer,
                rule.getId(),
                rule.getVariations()[0]?.getId(),
                context,
                featureKey,
                payload,
              );
            } else {
              if (payload != null) {
                batchPayload.push(payload);
              }
            }
          } else {
            if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
              sendImpressionForVariationShown(
                serviceContainer,
                rule.getId(),
                rule.getVariations()[0]?.getId(),
                context,
                featureKey,
                payload,
              );
            } else {
              if (payload != null) {
                batchPayload.push(payload);
              }
            }
          }

          evaluatedFeatureMap.set(featureKey, {
            rolloutId: rule.getId(),
            rolloutKey: rule.getKey(),
            rolloutVariationId: rule.getVariations()[0]?.getId(),
          });

          break;
        }

        continue; // if rule does not satisfy, then check for other ROLLOUT rules
      }

      if (rolloutRulesToEvaluate.length > 0) {
        const passedRolloutCampaign = new CampaignModel().modelFromDictionary(rolloutRulesToEvaluate[0]);
        const variation = evaluateTrafficAndGetVariation(serviceContainer, passedRolloutCampaign, context);

        if (isObject(variation) && Object.keys(variation).length > 0) {
          isEnabled = true;
          shouldCheckForExperimentsRules = true;
          rolloutVariationToReturn = variation;
          decision['isUserPartOfCampaign'] = true;

          _updateIntegrationsDecisionObject(passedRolloutCampaign, variation, passedRulesInformation, decision);

          const payload = getTrackUserPayloadData(
            serviceContainer,
            EventEnum.VWO_VARIATION_SHOWN,
            passedRolloutCampaign.getId(),
            variation.getId(),
            context,
          );

          if (serviceContainer.getShouldWaitForTrackingCalls()) {
            if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
              await sendImpressionForVariationShown(
                serviceContainer,
                passedRolloutCampaign.getId(),
                variation.getId(),
                context,
                featureKey,
                payload,
              );
            } else {
              if (payload != null) {
                batchPayload.push(payload);
              }
            }
          } else {
            if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
              sendImpressionForVariationShown(
                serviceContainer,
                passedRolloutCampaign.getId(),
                variation.getId(),
                context,
                featureKey,
                payload,
              );
            } else {
              if (payload != null) {
                batchPayload.push(payload);
              }
            }
          }
        }
      }
    } else if (rollOutRules.length === 0) {
      serviceContainer.getLogManager().debug(DebugLogMessagesEnum.EXPERIMENTS_EVALUATION_WHEN_NO_ROLLOUT_PRESENT);
      shouldCheckForExperimentsRules = true;
    }

    if (shouldCheckForExperimentsRules) {
      const experimentRulesToEvaluate = [];

      // if rollout rule is passed, get all ab and Personalize rules
      const experimentRules = getAllExperimentRules(feature);
      const megGroupWinnerCampaigns: Map<number, any> = new Map();

      for (const rule of experimentRules) {
        const { preSegmentationResult, whitelistedObject, updatedDecision } = await evaluateRule(
          serviceContainer,
          feature,
          rule,
          context,
          evaluatedFeatureMap,
          megGroupWinnerCampaigns,
          storageService,
          decision,
        );

        Object.assign(decision, updatedDecision);

        if (preSegmentationResult) {
          if (whitelistedObject === null) {
            // whitelistedObject will be null if pre segment passed but whitelisting failed
            experimentRulesToEvaluate.push(rule);
          } else {
            isEnabled = true;
            decision['isUserPartOfCampaign'] = true;
            experimentVariationToReturn = whitelistedObject.variation;
            Object.assign(passedRulesInformation, {
              experimentId: rule.getId(),
              experimentKey: rule.getKey(),
              experimentVariationId: whitelistedObject.variationId,
            });
          }

          break;
        }
        continue;
      }

      if (experimentRulesToEvaluate.length > 0) {
        const campaign = new CampaignModel().modelFromDictionary(experimentRulesToEvaluate[0]);
        const variation = evaluateTrafficAndGetVariation(serviceContainer, campaign, context);

        if (isObject(variation) && Object.keys(variation).length > 0) {
          isEnabled = true;
          decision['isUserPartOfCampaign'] = true;
          experimentVariationToReturn = variation;

          _updateIntegrationsDecisionObject(campaign, variation, passedRulesInformation, decision);
          const payload = getTrackUserPayloadData(
            serviceContainer,
            EventEnum.VWO_VARIATION_SHOWN,
            campaign.getId(),
            variation.getId(),
            context,
          );

          if (serviceContainer.getShouldWaitForTrackingCalls()) {
            if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
              await sendImpressionForVariationShown(
                serviceContainer,
                campaign.getId(),
                variation.getId(),
                context,
                featureKey,
                payload,
              );
            } else {
              if (payload != null) {
                batchPayload.push(payload);
              }
            }
          } else {
            if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
              sendImpressionForVariationShown(
                serviceContainer,
                campaign.getId(),
                variation.getId(),
                context,
                featureKey,
                payload,
              );
            } else {
              if (payload != null) {
                batchPayload.push(payload);
              }
            }
          }
        }
      }
    }

    // If flag is enabled, store it in data
    if (isEnabled) {
      // set storage data
      new StorageDecorator().setDataInStorage(
        {
          featureKey,
          featureId: feature.getId(),
          context,
          ...passedRulesInformation,
          notInHoldoutId: notInHoldoutIds,
        },
        storageService,
        serviceContainer,
      );
    } else {
      new StorageDecorator().setDataInStorage(
        {
          featureKey,
          context,
          notInHoldoutId: notInHoldoutIds,
        },
        storageService,
        serviceContainer,
      );
    }

    // call integration callback, if defined
    serviceContainer.getHooksService().set(decision);
    serviceContainer.getHooksService().execute(serviceContainer.getHooksService().get());

    // send debug event, if debugger is enabled
    if (feature.getIsDebuggerEnabled()) {
      debugEventProps.cg = DebuggerCategoryEnum.DECISION;
      debugEventProps.lt = LogLevelEnum.INFO.toString();
      debugEventProps.msg_t = Constants.FLAG_DECISION_GIVEN;
      // update debug event props with decision keys
      _updateDebugEventProps(debugEventProps, decision);

      // send debug event
      sendDebugEventToVWO(serviceContainer, debugEventProps);
    }

    // Send data for Impact Campaign, if defined
    if (feature.getImpactCampaign()?.getCampaignId()) {
      serviceContainer.getLogManager().info(
        buildMessage(InfoLogMessagesEnum.IMPACT_ANALYSIS, {
          userId: context.getId(),
          featureKey,
          status: isEnabled ? 'enabled' : 'disabled',
        }),
      );
      const payload = getTrackUserPayloadData(
        serviceContainer,
        EventEnum.VWO_VARIATION_SHOWN,
        feature.getImpactCampaign()?.getCampaignId(),
        isEnabled ? 2 : 1,
        context,
      );
      if (serviceContainer.getShouldWaitForTrackingCalls()) {
        if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
          await sendImpressionForVariationShown(
            serviceContainer,
            feature.getImpactCampaign()?.getCampaignId(),
            isEnabled ? 2 : 1,
            context,
            featureKey,
            payload,
          );
        } else {
          if (payload != null) {
            batchPayload.push(payload);
          }
        }
      } else {
        if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
          sendImpressionForVariationShown(
            serviceContainer,
            feature.getImpactCampaign()?.getCampaignId(),
            isEnabled ? 2 : 1,
            context,
            featureKey,
            payload,
          );
        } else {
          if (payload != null) {
            batchPayload.push(payload);
          }
        }
      }
    }

    deferredObject.resolve(
      new Flag(
        isEnabled,
        context.getSessionId(),
        context.getUuid(),
        new VariationModel().modelFromDictionary(experimentVariationToReturn ?? rolloutVariationToReturn),
      ),
    );

    if (!serviceContainer.getSettingsService().isGatewayServiceProvided && batchPayload.length > 0) {
      if (serviceContainer.getShouldWaitForTrackingCalls()) {
        await sendImpressionForVariationShownInBatch(serviceContainer, batchPayload);
      } else {
        sendImpressionForVariationShownInBatch(serviceContainer, batchPayload);
      }
    }

    return deferredObject.promise;
  }
}

// Not PRIVATE methods but helper methods. If need be, move them to some util file to be reused by other API(s)

function _updateIntegrationsDecisionObject(
  campaign: CampaignModel,
  variation: VariationModel,
  passedRulesInformation: any,
  decision: any,
): void {
  if (campaign.getType() === CampaignTypeEnum.ROLLOUT) {
    Object.assign(passedRulesInformation, {
      rolloutId: campaign.getId(),
      rolloutKey: campaign.getKey(),
      rolloutVariationId: variation.getId(),
    });
  } else {
    Object.assign(passedRulesInformation, {
      experimentId: campaign.getId(),
      experimentKey: campaign.getKey(),
      experimentVariationId: variation.getId(),
    });
  }
  Object.assign(decision, passedRulesInformation);
}

/**
 * Update debug event props with decision keys
 * @param debugEventProps - Debug event props
 * @param decision - Decision
 */
function _updateDebugEventProps(debugEventProps: Record<string, any>, decision: any) {
  const decisionKeys = extractDecisionKeys(decision);
  let message = `Flag decision given for feature:${decision.featureKey}.`;
  if (decision.rolloutKey && decision.rolloutVariationId) {
    message += ` Got rollout:${decision.rolloutKey.substring((decision.featureKey + '_').length)} with variation:${decision.rolloutVariationId}`;
  }
  if (decision.experimentKey && decision.experimentVariationId) {
    message += ` and experiment:${decision.experimentKey.substring((decision.featureKey + '_').length)} with variation:${decision.experimentVariationId}`;
  }
  debugEventProps.msg = message;
  Object.assign(debugEventProps, decisionKeys);
}
