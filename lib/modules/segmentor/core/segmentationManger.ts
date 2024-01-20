import { SegmentEvaluator } from '../evaluators/segmentEvaluator';
import { dynamic } from '../../../types/common';

export class SegmentationManager {
  private static instance: SegmentationManager;
  evaluator: SegmentEvaluator;

  static get Instance(): SegmentationManager {
    this.instance = this.instance || new SegmentationManager();

    return this.instance;
  }

  attachEvaluator(evaluator?: SegmentEvaluator): void {
    this.evaluator = evaluator || new SegmentEvaluator();
  }

  validateSegmentation(dsl: Record<string, dynamic>, properties: Record<any, dynamic>): boolean {
    return this.evaluator.isSegmentationValid(dsl, properties);
  }
}
