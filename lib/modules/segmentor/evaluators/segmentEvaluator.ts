import { getKeyValue } from '../utils/SegmentUtil';
import { SegmentOperandEvaluator } from './segmentOperandEvaluator';
import { SegmentOperatorValueEnum } from '../enums/segmentOperatorValueEnum';
import { Segmentation } from '../segmentation';
import { dynamic } from '../../../types/common';

export class SegmentEvaluator implements Segmentation {
  isSegmentationValid(dsl: Record<string, dynamic>, properties: Record<string, dynamic>): boolean {
    const { key, value } = getKeyValue(dsl);
    const operator = key;
    const subDsl = value;

    if (operator === SegmentOperatorValueEnum.NOT) {
      return !this.isSegmentationValid(subDsl, properties);
    } else if (operator === SegmentOperatorValueEnum.AND) {
      return this.every(subDsl, properties);
    } else if (operator === SegmentOperatorValueEnum.OR) {
      return this.some(subDsl, properties);
    } else if (operator === SegmentOperatorValueEnum.CUSTOM_VARIABLE) {
      return new SegmentOperandEvaluator().evaluateCustomVariableDSL(subDsl, properties);
    } else if (operator === SegmentOperatorValueEnum.USER) {
      return new SegmentOperandEvaluator().evaluateUserDSL(subDsl, properties);
    }
    return false;
  }

  some(dslNodes: Array<Record<string, dynamic>>, customVariables: Record<string, dynamic>): boolean {
    for (const dsl of dslNodes) {
      if (this.isSegmentationValid(dsl, customVariables)) {
        return true;
      }
    }
    return false;
  }

  every(dslNodes: Array<Record<string, dynamic>>, customVariables: Record<string, dynamic>): boolean {
    for (const dsl of dslNodes) {
      if (!this.isSegmentationValid(dsl, customVariables)) {
        return false;
      }
    }
    return true;
  }
}
