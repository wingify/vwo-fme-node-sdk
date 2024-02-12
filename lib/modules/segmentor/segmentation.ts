import { SettingsModel } from '../../models/SettingsModel';
import { dynamic } from '../../types/common';

export interface Segmentation {
  isSegmentationValid(dsl: Record<string, dynamic>, properties: Record<string, dynamic>, settings: SettingsModel): boolean | Promise<any>;
}
