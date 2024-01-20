import { VariationModel } from '../models/VariationModel';
import { VariableModel } from '../models/VariableModel';
import { Constants } from '../constants';

export function setVariationAllocation(
  variationList: Array<VariationModel>,
  variables: Array<VariableModel> = undefined
): void {
  let stepFactor = 0;
  let currentAllocation = 0;

  // assign rangel values to variations based on their weight
  variationList.forEach((variation: VariationModel) => {
    // TODO: need to optimize the code here by creating a featureVariableMap and then run a loop on variation variables.
    if (variables) {
      copyVariableData(variation.getVariables(), variables);
    }
    stepFactor = assignRangeValues(variation, currentAllocation);
    currentAllocation += stepFactor;
  });
}

function copyVariableData(variationVariable: Array<VariableModel>, featureVariable: Array<VariableModel>): void {
  // create a featureVariableMap
  const featureVariableMap: Record<number, VariableModel> = {};
  featureVariable.forEach((variable: VariableModel) => {
    featureVariableMap[variable.getId()] = variable;
  });
  variationVariable.forEach((variable: VariableModel) => {
    const featureVariable: VariableModel = featureVariableMap[variable.getId()];
    if (featureVariable) {
      variable.setKey(featureVariable.getKey());
      variable.setType(featureVariable.getType());
    }
  });
}

function assignRangeValues(data: VariationModel, currentAllocation: number) {
  const stepFactor: number = getVariationBucketRange(data.getWeight());

  if (stepFactor) {
    data.setStartRange(currentAllocation + 1);
    data.setEndRange(currentAllocation + stepFactor);
  } else {
    data.setStartRange(-1);
    data.setEndRange(-1);
  }
  return stepFactor;
}

function getVariationBucketRange(variationWeight: number) {
  if (!variationWeight || variationWeight === 0) {
    return 0;
  }

  const startRange = Math.ceil(variationWeight * 100);

  return Math.min(startRange, Constants.MAX_TRAFFIC_VALUE);
}
