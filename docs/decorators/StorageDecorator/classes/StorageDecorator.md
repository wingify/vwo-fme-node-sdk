[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [decorators/StorageDecorator](../README.md) / StorageDecorator

# Class: StorageDecorator

## Implements

- `IStorageDecorator`

## Constructors

### new StorageDecorator()

> **new StorageDecorator**(): [`StorageDecorator`](StorageDecorator.md)

#### Returns

[`StorageDecorator`](StorageDecorator.md)

## Methods

### getFeatureFromStorage()

> **getFeatureFromStorage**(`featureKey`, `context`, `storageService`): `Promise`\<`any`\>

Asynchronously retrieves a feature from storage based on the feature key and user.

#### Parameters

• **featureKey**: `any`

The key of the feature to retrieve.

• **context**: [`ContextModel`](../../../models/user/ContextModel/classes/ContextModel.md)

• **storageService**: [`IStorageService`](../../../services/StorageService/interfaces/IStorageService.md)

The storage service instance.

#### Returns

`Promise`\<`any`\>

A promise that resolves to the retrieved feature or relevant status.

#### Implementation of

`IStorageDecorator.getFeatureFromStorage`

#### Source

decorators/StorageDecorator.ts:55

---

### setDataInStorage()

> **setDataInStorage**(`data`, `storageService`): `Promise`\<[`VariationModel`](../../../models/campaign/VariationModel/classes/VariationModel.md)\>

Sets data in storage based on the provided data object.

#### Parameters

• **data**: `Record`\<`any`, `any`\>

The data to be stored, including feature key and user details.

• **storageService**: [`IStorageService`](../../../services/StorageService/interfaces/IStorageService.md)

The storage service instance.

#### Returns

`Promise`\<[`VariationModel`](../../../models/campaign/VariationModel/classes/VariationModel.md)\>

A promise that resolves when the data is successfully stored.

#### Implementation of

`IStorageDecorator.setDataInStorage`

#### Source

decorators/StorageDecorator.ts:91
