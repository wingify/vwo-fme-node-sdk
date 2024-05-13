import { Deferred } from '../../../lib/utils/PromiseUtil';

describe('Deferred', () => {
  let deferred: any;

  beforeEach(() => {
    deferred = new Deferred();
  });

  test('should create a Deferred object with a promise', () => {
    expect(deferred.promise).toBeInstanceOf(Promise);
  });

  test('should resolve the promise when resolve is called', async () => {
    const expectedResult = 'resolved value';
    setTimeout(() => deferred.resolve(expectedResult), 100);
    await expect(deferred.promise).resolves.toBe(expectedResult);
  });

  test('should reject the promise when reject is called', async () => {
    const expectedError = new Error('rejected');
    setTimeout(() => deferred.reject(expectedError), 100);
    await expect(deferred.promise).rejects.toThrow(expectedError);
  });
});
