import { dynamic } from '../types/Common';

export function Deferred(): void {
  this.promise = new Promise((resolve: dynamic, reject: dynamic) => {
    this.resolve = resolve;
    this.reject = reject;
  });

  return this;
}
