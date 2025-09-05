import { SegmentOperandValueEnum } from '../enums/SegmentOperandValueEnum';
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
  evaluateCustomVariableDSL(
    dslOperandValue: Record<string, dynamic>,
    properties: Record<string, dynamic>,
  ): Promise<boolean>;
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
  processValues(operandValue: any, tagValue: any): Record<string, dynamic>;
  /**
   * Extracts the result of the evaluation based on the operand type and values.
   * @param {SegmentOperandValueEnum} operandType - The type of the operand.
   * @param {any} operandValue - The value of the operand.
   * @param {any} tagValue - The value of the tag to compare against.
   * @returns {boolean} - The result of the evaluation.
   */
  extractResult(operandType: SegmentOperandValueEnum, operandValue: any, tagValue: any): boolean;
}
