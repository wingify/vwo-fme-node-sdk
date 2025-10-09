import { SettingsModel } from '../settings/SettingsModel';
export declare class SettingsSchema {
    private campaignMetricSchema;
    private variableObjectSchema;
    private campaignVariationSchema;
    private campaignObjectSchema;
    private settingsSchema;
    private featureSchema;
    private ruleSchema;
    constructor();
    private initializeSchemas;
    isSettingsValid(settings: any | SettingsModel): boolean;
}
