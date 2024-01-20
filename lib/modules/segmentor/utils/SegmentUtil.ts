import { isObject } from '../../../utils/DataTypeUtil';
import { dynamic } from '../../../types/common';

export function getKeyValue(obj: Record<string, any>): Record<string, any> {
  if (!isObject(obj)) {
    return;
  }

  const key = Object.keys(obj)[0];
  const value = obj[key];
  return {
    key,
    value
  };
}

export function matchWithRegex(string: string, regex: string): RegExpMatchArray {
  try {
    return string.match(new RegExp(regex));
  } catch (err) {
    return null;
  }
}
