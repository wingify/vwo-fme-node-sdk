import { SettingsModel } from '../../../models/settings/SettingsModel';
import { dynamic } from '../../../types/Common';
import { Segmentation } from '../Segmentation';
import { ContextModel } from '../../../models/user/ContextModel';
import { FeatureModel } from '../../../models/campaign/FeatureModel';
export declare class SegmentEvaluator implements Segmentation {
    context: ContextModel;
    settings: SettingsModel;
    feature: FeatureModel;
    /**
     * Validates if the segmentation defined in the DSL is applicable based on the provided properties.
     * @param dsl The domain-specific language defining the segmentation rules.
     * @param properties The properties against which the DSL rules are evaluated.
     * @returns A Promise resolving to a boolean indicating if the segmentation is valid.
     */
    isSegmentationValid(dsl: Record<string, dynamic>, properties: Record<string, dynamic>): Promise<boolean>;
    /**
     * Evaluates if any of the DSL nodes are valid using the OR logic.
     * @param dslNodes Array of DSL nodes to evaluate.
     * @param customVariables Custom variables provided for evaluation.
     * @returns A Promise resolving to a boolean indicating if any of the nodes are valid.
     */
    some(dslNodes: Array<Record<string, dynamic>>, customVariables: Record<string, dynamic>): Promise<boolean>;
    /**
     * Evaluates all DSL nodes using the AND logic.
     * @param dslNodes Array of DSL nodes to evaluate.
     * @param customVariables Custom variables provided for evaluation.
     * @returns A Promise resolving to a boolean indicating if all nodes are valid.
     */
    every(dslNodes: Array<Record<string, dynamic>>, customVariables: Record<string, dynamic>): Promise<boolean>;
    /**
     * Adds location values from a DSL node to a map.
     * @param dsl DSL node containing location data.
     * @param locationMap Map to store location data.
     */
    addLocationValuesToMap(dsl: Record<string, dynamic>, locationMap: Record<string, dynamic>): void;
    /**
     * Checks if the user's location matches the expected location criteria.
     * @param locationMap Map of expected location values.
     * @returns A Promise resolving to a boolean indicating if the location matches.
     */
    checkLocationPreSegmentation(locationMap: Record<string, dynamic>): Promise<boolean>;
    /**
     * Checks if the user's device information matches the expected criteria.
     * @param uaParserMap Map of expected user agent values.
     * @returns A Promise resolving to a boolean indicating if the user agent matches.
     */
    checkUserAgentParser(uaParserMap: Record<string, string[]>): Promise<boolean>;
    /**
     * Checks if the feature is enabled for the user by querying the storage.
     * @param settings The settings model containing configuration.
     * @param featureKey The key of the feature to check.
     * @param user The user object to check against.
     * @returns A Promise resolving to a boolean indicating if the feature is enabled for the user.
     */
    checkInUserStorage(settings: SettingsModel, featureKey: string, context: ContextModel): Promise<any>;
    /**
     * Checks if the actual values match the expected values specified in the map.
     * @param expectedMap A map of expected values for different keys.
     * @param actualMap A map of actual values to compare against.
     * @returns A Promise resolving to a boolean indicating if all actual values match the expected values.
     */
    checkValuePresent(expectedMap: Record<string, string[]>, actualMap: Record<string, string>): Promise<boolean>;
    /**
     * Compares expected location values with user's location to determine a match.
     * @param expectedLocationMap A map of expected location values.
     * @param userLocation The user's actual location.
     * @returns A boolean indicating if the user's location matches the expected values.
     */
    valuesMatch(expectedLocationMap: any, userLocation: any): Promise<boolean>;
    /**
     * Normalizes a value to a consistent format for comparison.
     * @param value The value to normalize.
     * @returns The normalized value.
     */
    normalizeValue(value: any): any;
}
