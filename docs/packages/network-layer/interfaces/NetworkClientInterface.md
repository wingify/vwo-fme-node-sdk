[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [packages/network-layer](../README.md) / NetworkClientInterface

# Interface: NetworkClientInterface

## Methods

### GET()

> **GET**(`request`): `Promise`\<[`ResponseModel`](../classes/ResponseModel.md)\>

Sends a GET request to the server.

#### Parameters

• **request**: [`RequestModel`](../classes/RequestModel.md)

The RequestModel containing the URL and parameters for the GET request.

#### Returns

`Promise`\<[`ResponseModel`](../classes/ResponseModel.md)\>

A Promise that resolves to a ResponseModel containing the response data.

#### Source

packages/network-layer/client/NetworkClientInterface.ts:25

---

### POST()

> **POST**(`request`): `Promise`\<[`ResponseModel`](../classes/ResponseModel.md)\>

Sends a POST request to the server.

#### Parameters

• **request**: [`RequestModel`](../classes/RequestModel.md)

The RequestModel containing the URL, headers, and body of the POST request.

#### Returns

`Promise`\<[`ResponseModel`](../classes/ResponseModel.md)\>

A Promise that resolves to a ResponseModel containing the response data.

#### Source

packages/network-layer/client/NetworkClientInterface.ts:32
