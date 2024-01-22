import { dynamic } from '../types/common';
import { isString } from './DataTypeUtil';

export function cloneObject(obj: dynamic): any {
  if (!obj) {
    return obj;
  }
  const clonedObj = JSON.parse(JSON.stringify(obj));
  return clonedObj;
}

export function getCurrentUnixTimestamp(): number {
  return Math.ceil(+new Date() / 1000);
}

export function getCurrentUnixTimestampInMillis(): number {
  return +new Date();
}

export function getRandomNumber(): number {
  return Math.random();
}

export function getSpecificRulesBasedOnType(settingsFile, featureKey, type = null) {
  let feature = settingsFile.features.find(feature => feature.key === featureKey);
  if (type && isString(type)){
    return feature.rulesLinkedCampaign.filter(rule => rule.type === type);
  }
  return feature.rulesLinkedCampaign;
}