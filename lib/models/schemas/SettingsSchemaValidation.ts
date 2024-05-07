import { Struct, array, boolean, number, object, optional, string, union, validate } from 'superstruct';
import { dynamic } from '../../types/Common';
import { SettingsModel } from '../SettingsModel';

export class SettingsSchema {
  private campaignGoalSchema: Struct<dynamic>;
  private variableObjectSchema: Struct<dynamic>;
  private campaignVariationSchema: Struct<dynamic>;
  private campaignObjectSchema: Struct<dynamic>;
  private settingsFileSchema: Struct<dynamic>;
  private campaignGroupSchema: Struct<dynamic>;
  private featureSchema: Struct<dynamic>;

  constructor() {
    this.initializeSchemas();
  }

  private initializeSchemas(): void {
    this.campaignGoalSchema = object({
      id: union([number(), string()]),
      key: string(),
      type: string()
    });

    this.variableObjectSchema = object({
      id: union([number(), string()]),
      type: string(),
      key: string(),
      value: union([number(), string(), boolean()])
    });

    this.campaignVariationSchema = object({
      id: union([number(), string()]),
      key: string(),
      weight: union([number(), string()]),
      segments: optional(object()),
      variables: optional(array(this.variableObjectSchema)),
      startRangeVariation: optional(number()),
      endRangeVariation: optional(number())
    });

    this.campaignObjectSchema = object({
      id: union([number(), string()]),
      type: string(),
      key: string(),
      featureId: optional(number()),
      featureKey: optional(string()),
      percentTraffic: number(),
      metrics: array(this.campaignGoalSchema),
      variations: array(this.campaignVariationSchema),
      variables: optional(array(this.variableObjectSchema)),
      segments: object(),
      isForcedVariationEnabled: optional(boolean())
    });

    this.featureSchema = object({
      id: union([number(), string()]),
      key: string(),
      variables: optional(array(this.variableObjectSchema)),
      campaigns: array(this.campaignObjectSchema)
    });

    this.settingsFileSchema = object({
      sdkKey: optional(string()),
      version: union([number(), string()]),
      accountId: union([number(), string()]),
      features: optional(array(this.featureSchema))
    });

    this.campaignGroupSchema = object({
      id: number(),
      campaigns: array(number())
    });
  }

  isSettingsValid(settings: SettingsModel): boolean {
    const [error] = validate(settings, this.settingsFileSchema);
    return !error;
  }
}
