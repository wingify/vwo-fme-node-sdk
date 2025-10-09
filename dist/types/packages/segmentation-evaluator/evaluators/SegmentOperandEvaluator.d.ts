import { SegmentOperandValueEnum } from '../enums/SegmentOperandValueEnum';
import { SegmentOperatorValueEnum } from '../enums/SegmentOperatorValueEnum';
import { dynamic } from '../../../types/Common';
import { ContextModel } from '../../../models/user/ContextModel';
/**
 * SegmentOperandEvaluator class provides methods to evaluate different types of DSL (Domain Specific Language)
 * expressions based on the segment conditions defined for custom variables, user IDs, and user agents.
 */
export declare class SegmentOperandEvaluator {
    private static readonly NON_NUMERIC_PATTERN;
    /**
     * Evaluates a custom variable DSL expression.
     * @param {Record<string, dynamic>} dslOperandValue - The DSL expression for the custom variable.
     * @param {Record<string, dynamic>} properties - The properties object containing the actual values to be matched against.
     * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the DSL condition is met.
     */
    evaluateCustomVariableDSL(dslOperandValue: Record<string, dynamic>, properties: Record<string, dynamic>): Promise<boolean>;
    /**
     * Evaluates a user DSL expression to check if a user ID is in a specified list.
     * @param {Record<string, any>} dslOperandValue - The DSL expression containing user IDs.
     * @param {Record<string, dynamic>} properties - The properties object containing the actual user ID to check.
     * @returns {boolean} - True if the user ID is in the list, otherwise false.
     */
    evaluateUserDSL(dslOperandValue: Record<string, any>, properties: Record<string, dynamic>): boolean;
    /**
     * Evaluates a user agent DSL expression.
     * @param {Record<string, any>} dslOperandValue - The DSL expression for the user agent.
     * @param {any} context - The context object containing the user agent string.
     * @returns {boolean} - True if the user agent matches the DSL condition, otherwise false.
     */
    evaluateUserAgentDSL(dslOperandValue: Record<string, any>, context: ContextModel): boolean;
    /**
     * Pre-processes the tag value to ensure it is in the correct format for evaluation.
     * @param {any} tagValue - The value to be processed.
     * @returns {string | boolean} - The processed tag value, either as a string or a boolean.
     */
    preProcessTagValue(tagValue: any): string | boolean;
    /**
     * Pre-processes the operand value to determine its type and extract the value based on regex matches.
     * @param {any} operand - The operand to be processed.
     * @returns {Record<string, any>} - An object containing the operand type and value.
     */
    preProcessOperandValue(operand: any): Record<string, any>;
    /**
     * Extracts the operand value from a string based on a specified regex pattern.
     * @param {any} operand - The operand string to extract from.
     * @param {string} regex - The regex pattern to use for extraction.
     * @returns {string} - The extracted value.
     */
    extractOperandValue(operand: any, regex: string): string;
    /**
     * Processes numeric values from operand and tag values, converting them to strings.
     * @param {any} operandValue - The operand value to process.
     * @param {any} tagValue - The tag value to process.
     * @returns {Record<string, dynamic>} - An object containing the processed operand and tag values as strings.
     */
    processValues(operandValue: any, tagValue: any, operandType?: SegmentOperatorValueEnum): Record<string, dynamic>;
    /**
     * Extracts the result of the evaluation based on the operand type and values.
     * @param {SegmentOperandValueEnum} operandType - The type of the operand.
     * @param {any} operandValue - The value of the operand.
     * @param {any} tagValue - The value of the tag to compare against.
     * @returns {boolean} - The result of the evaluation.
     */
    extractResult(operandType: SegmentOperandValueEnum, operandValue: any, tagValue: any): boolean;
    /**
     * Evaluates a given string tag value against a DSL operand value.
     * @param {any} dslOperandValue - The DSL operand string (e.g., "contains(\"value\")").
     * @param {ContextModel} context - The context object containing the value to evaluate.
     * @param {SegmentOperatorValueEnum} operandType - The type of operand being evaluated (ip_address, browser_version, os_version).
     * @returns {boolean} - True if tag value matches DSL operand criteria, false otherwise.
     */
    evaluateStringOperandDSL(dslOperandValue: any, context: ContextModel, operandType: SegmentOperatorValueEnum): boolean;
    /**
     * Gets the appropriate tag value based on the operand type.
     * @param {ContextModel} context - The context object.
     * @param {SegmentOperatorValueEnum} operandType - The type of operand.
     * @returns {string | null} - The tag value or null if not available.
     */
    getTagValueForOperandType(context: ContextModel, operandType: SegmentOperatorValueEnum): string | null;
    /**
     * Gets browser version from context.
     * @param {ContextModel} context - The context object.
     * @returns {string | null} - The browser version or null if not available.
     */
    getBrowserVersionFromContext(context: ContextModel): string | null;
    /**
     * Gets OS version from context.
     * @param {ContextModel} context - The context object.
     * @returns {string | null} - The OS version or null if not available.
     */
    getOsVersionFromContext(context: ContextModel): string | null;
    /**
     * Logs appropriate error message for missing context.
     * @param {SegmentOperatorValueEnum} operandType - The type of operand.
     */
    logMissingContextError(operandType: SegmentOperatorValueEnum): void;
    /**
     * Checks if a string appears to be a version string (contains only digits and dots).
     * @param {string} str - The string to check.
     * @returns {boolean} - True if the string appears to be a version string.
     */
    isVersionString(str: string): boolean;
    /**
     * Compares two version strings using semantic versioning rules.
     * Supports formats like "1.2.3", "1.0", "2.1.4.5", etc.
     * @param {string} version1 - First version string.
     * @param {string} version2 - Second version string.
     * @returns {number} - -1 if version1 < version2, 0 if equal, 1 if version1 > version2.
     */
    compareVersions(version1: string, version2: string): number;
}
