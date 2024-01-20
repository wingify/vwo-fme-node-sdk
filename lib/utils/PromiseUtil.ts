import { dynamic } from '../types/common';

export function Deferred(): void {
  this.promise = new Promise((resolve: dynamic, reject: dynamic) => {
    this.resolve = resolve;
    this.reject = reject;
  });

  return this;
}
