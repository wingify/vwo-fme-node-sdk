// storageMap.ts

type StorageData = {
    rolloutKey: string;
    rolloutVariationId: string;
    experimentKey: string;
    experimentVariationId: string;
  };
  
  type StorageMap = {
    storage: Record<string, StorageData>;
    get: (featureKey: string, userId: string) => Promise<StorageData>;
    set: (data: { featureKey: string; user: string } & StorageData) => Promise<void>;
  };
  
  const storageMap: StorageMap = {
    storage: {},
  
    // create a get function
    get: async function (featureKey: string, userId: string){
      // create the full key
      const key = featureKey + '_' + userId;
  
      // Check if the key exists in the storage
      if (Object.prototype.hasOwnProperty.call(this.storage, key)) {
        return this.storage[key];
      }
      return null;
    },
  
    // create a set function
    set: async function (data: { featureKey: string; user: string } & StorageData){
      // create a key
      const key = data.featureKey + '_' + data.user;
  
      // Set the data in the storage
      this.storage[key] = {
        rolloutKey: data.rolloutKey,
        rolloutVariationId: data.rolloutVariationId,
        experimentKey: data.experimentKey,
        experimentVariationId: data.experimentVariationId,
      };
    },
  };
  
  export default storageMap;
  