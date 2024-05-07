import { SegmentEvaluator } from '../evaluators/SegmentEvaluator';
import { dynamic } from '../../../types/Common';
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

  setContextualData(settings, feature, context) {
    // Always new evalautor instance
    this.attachEvaluator();
    this.evaluator.settings = settings;
    this.evaluator.context = context;
    this.evaluator.context._vwo = context?._vwo || {};
    this.evaluator.feature = feature;

    // call to webservice /getLocation      if feature.segment.hasLocation = true
    // call to webservice /getUA            if feature.segment.hasUA = true
    // call to webservice /getLocationAndUA if feature.segment.hasLocation = true && feature.segment.hasUA = true

    // if featureId segment in this feature.segment.hasFeatureDep = true and feature.segment.
  }

  // TODO: modify this method and the following to be independent of settings and context
  async validateSegmentation(dsl: Record<string, dynamic>, properties: Record<any, dynamic>, settings: SettingsModel, context?:any): Promise<boolean> {
    return await this.evaluator.isSegmentationValid(dsl, properties);
  }
}
