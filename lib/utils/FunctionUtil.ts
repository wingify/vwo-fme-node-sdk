import { dynamic } from '../types/common';

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

export function getRandomNumber(): number {
  return Math.random();
}
