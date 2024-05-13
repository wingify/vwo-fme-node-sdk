import { DecisionMaker } from '../../../../lib/modules/decision-maker';

xdescribe('DecisionMaker', () => {
  let decisionMaker: DecisionMaker;

  beforeEach(() => {
    decisionMaker = new DecisionMaker();
  });

  describe('generateBucketValue', () => {
    it('should generate a correct bucket value', () => {
      const hashValue = 2147483647; // Example hash value
      const maxValue = 100;
      const multiplier = 1;
      const expectedBucketValue = Math.floor((maxValue * (hashValue / Math.pow(2, 32)) + 1) * multiplier);
      const bucketValue = decisionMaker.generateBucketValue(hashValue, maxValue, multiplier);
      expect(bucketValue).toBe(expectedBucketValue);
    });
  });

  describe('getBucketValueForUser', () => {
    it('should return a valid bucket value for a user ID', () => {
      const userId = 'user123';
      const maxValue = 100;
      const mockHashValue = 123456789; // Mocked hash value
      jest.spyOn(decisionMaker, 'generateHashValue').mockReturnValue(mockHashValue);
      const expectedBucketValue = decisionMaker.generateBucketValue(mockHashValue, maxValue);
      const bucketValue = decisionMaker.getBucketValueForUser(userId, maxValue);
      expect(bucketValue).toBe(expectedBucketValue);
    });
  });

  describe('calculateBucketValue', () => {
    it('should calculate the correct bucket value for a string', () => {
      const str = "testString";
      const multiplier = 1;
      const maxValue = 10000;
      const mockHashValue = 987654321; // Mocked hash value
      jest.spyOn(decisionMaker, 'generateHashValue').mockReturnValue(mockHashValue);
      const expectedBucketValue = decisionMaker.generateBucketValue(mockHashValue, maxValue, multiplier);
      const bucketValue = decisionMaker.calculateBucketValue(str, multiplier, maxValue);
      expect(bucketValue).toBe(expectedBucketValue);
    });
  });

  describe('generateHashValue', () => {
    it('should generate a consistent hash value for a given key', () => {
      const hashKey = 'key123';
      const expectedHashValue = 123456789; // Expected hash value (this should be determined by actual hash function behavior)
      const hashValue = decisionMaker.generateHashValue(hashKey);
      expect(hashValue).toBe(expectedHashValue);
    });
  });
});
