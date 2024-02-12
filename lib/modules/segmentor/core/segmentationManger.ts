import { SegmentEvaluator } from '../evaluators/segmentEvaluator';
import { dynamic } from '../../../types/common';
import { SettingsModel } from '../../../models/SettingsModel';

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

  async validateSegmentation(dsl: Record<string, dynamic>, properties: Record<any, dynamic>, settings: SettingsModel, context?:any): Promise<boolean> {
    return await this.evaluator.isSegmentationValid(dsl, properties, settings, context);
  }
}
