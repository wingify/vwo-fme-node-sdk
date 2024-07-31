[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [services/StorageService](../README.md) / StorageService

# Class: StorageService

## Implements

- [`IStorageService`](../interfaces/IStorageService.md)

## Constructors

### new StorageService()

> **new StorageService**(): [`StorageService`](StorageService.md)

#### Returns

[`StorageService`](StorageService.md)

## Properties

### storageData

> `private` **storageData**: `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\> = `{}`

#### Source

services/StorageService.ts:32

## Methods

### getDataInStorage()

> **getDataInStorage**(`featureKey`, `context`): `Promise`\<`Record`\<`any`, `any`\>\>

Retrieves data from storage based on the feature key and user ID.

#### Parameters

• **featureKey**: `any`

The key to identify the feature data.

• **context**: [`ContextModel`](../../../models/user/ContextModel/classes/ContextModel.md)

#### Returns

`Promise`\<`Record`\<`any`, `any`\>\>

A promise that resolves to the data retrieved or an error/storage status enum.

#### Implementation of

[`IStorageService`](../interfaces/IStorageService.md).[`getDataInStorage`](../interfaces/IStorageService.md#getdatainstorage)

#### Source

services/StorageService.ts:40

---

### setDataInStorage()

> **setDataInStorage**(`data`): `Promise`\<`void`\>

Stores data in the storage.

#### Parameters

• **data**: `Record`\<`any`, `any`\>

The data to be stored as a record.

#### Returns

`Promise`\<`void`\>

A promise that resolves to true if data is successfully stored, otherwise false.

#### Implementation of

[`IStorageService`](../interfaces/IStorageService.md).[`setDataInStorage`](../interfaces/IStorageService.md#setdatainstorage)

#### Source

services/StorageService.ts:72
