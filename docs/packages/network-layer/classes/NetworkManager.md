[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [packages/network-layer](../README.md) / NetworkManager

# Class: NetworkManager

## Constructors

### new NetworkManager()

> **new NetworkManager**(): [`NetworkManager`](NetworkManager.md)

#### Returns

[`NetworkManager`](NetworkManager.md)

## Properties

### client

> `private` **client**: [`NetworkClientInterface`](../interfaces/NetworkClientInterface.md)

#### Source

packages/network-layer/manager/NetworkManager.ts:25

---

### config

> `private` **config**: [`GlobalRequestModel`](GlobalRequestModel.md)

#### Source

packages/network-layer/manager/NetworkManager.ts:24

---

### instance

> `static` `private` **instance**: [`NetworkManager`](NetworkManager.md)

#### Source

packages/network-layer/manager/NetworkManager.ts:26

## Accessors

### Instance

> `get` `static` **Instance**(): [`NetworkManager`](NetworkManager.md)

Singleton accessor for the NetworkManager instance.

#### Returns

[`NetworkManager`](NetworkManager.md)

The singleton instance.

#### Source

packages/network-layer/manager/NetworkManager.ts:52

## Methods

### attachClient()

> **attachClient**(`client`?): `void`

Attaches a network client to the manager, or uses a default if none provided.

#### Parameters

• **client?**: [`NetworkClientInterface`](../interfaces/NetworkClientInterface.md)

The client to attach, optional.

#### Returns

`void`

#### Source

packages/network-layer/manager/NetworkManager.ts:32

---

### createRequest()

> **createRequest**(`request`): [`RequestModel`](RequestModel.md)

Creates a network request model by merging specific request data with global config.

#### Parameters

• **request**: [`RequestModel`](RequestModel.md)

The specific request data.

#### Returns

[`RequestModel`](RequestModel.md)

The merged request model.

#### Source

packages/network-layer/manager/NetworkManager.ts:78

---

### get()

> **get**(`request`): `Promise`\<[`ResponseModel`](ResponseModel.md)\>

Performs a GET request using the provided request model.

#### Parameters

• **request**: [`RequestModel`](RequestModel.md)

The request model.

#### Returns

`Promise`\<[`ResponseModel`](ResponseModel.md)\>

A promise that resolves to the response model.

#### Source

packages/network-layer/manager/NetworkManager.ts:88

---

### getConfig()

> **getConfig**(): [`GlobalRequestModel`](GlobalRequestModel.md)

Retrieves the current global configuration.

#### Returns

[`GlobalRequestModel`](GlobalRequestModel.md)

The current configuration.

#### Source

packages/network-layer/manager/NetworkManager.ts:69

---

### post()

> **post**(`request`): `Promise`\<[`ResponseModel`](ResponseModel.md)\>

Performs a POST request using the provided request model.

#### Parameters

• **request**: [`RequestModel`](RequestModel.md)

The request model.

#### Returns

`Promise`\<[`ResponseModel`](ResponseModel.md)\>

A promise that resolves to the response model.

#### Source

packages/network-layer/manager/NetworkManager.ts:113

---

### setConfig()

> **setConfig**(`config`): `void`

Sets the global configuration for network requests.

#### Parameters

• **config**: [`GlobalRequestModel`](GlobalRequestModel.md)

The configuration to set.

#### Returns

`void`

#### Source

packages/network-layer/manager/NetworkManager.ts:61
