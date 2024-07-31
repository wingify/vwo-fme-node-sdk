[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [packages/network-layer](../README.md) / ResponseModel

# Class: ResponseModel

Represents the response model for network operations.
This class encapsulates details about the HTTP response including status code, headers, data, and errors.

## Constructors

### new ResponseModel()

> **new ResponseModel**(): [`ResponseModel`](ResponseModel.md)

#### Returns

[`ResponseModel`](ResponseModel.md)

## Properties

### data

> `private` **data**: [`dynamic`](../../../types/Common/type-aliases/dynamic.md)

#### Source

packages/network-layer/models/ResponseModel.ts:26

---

### error

> `private` **error**: [`dynamic`](../../../types/Common/type-aliases/dynamic.md)

#### Source

packages/network-layer/models/ResponseModel.ts:24

---

### headers

> `private` **headers**: `Record`\<`string`, `string`\>

#### Source

packages/network-layer/models/ResponseModel.ts:25

---

### statusCode

> `private` **statusCode**: `number`

#### Source

packages/network-layer/models/ResponseModel.ts:23

## Methods

### getData()

> **getData**(): [`dynamic`](../../../types/Common/type-aliases/dynamic.md)

Retrieves the data payload of the response.

#### Returns

[`dynamic`](../../../types/Common/type-aliases/dynamic.md)

The data payload of the response

#### Source

packages/network-layer/models/ResponseModel.ts:72

---

### getError()

> **getError**(): [`dynamic`](../../../types/Common/type-aliases/dynamic.md)

Retrieves the error object of the response.

#### Returns

[`dynamic`](../../../types/Common/type-aliases/dynamic.md)

The error object if the request failed

#### Source

packages/network-layer/models/ResponseModel.ts:88

---

### getHeaders()

> **getHeaders**(): `Record`\<`string`, `string`\>

Retrieves the headers of the response.

#### Returns

`Record`\<`string`, `string`\>

The headers of the response

#### Source

packages/network-layer/models/ResponseModel.ts:64

---

### getStatusCode()

> **getStatusCode**(): `number`

Retrieves the status code of the response.

#### Returns

`number`

The HTTP status code

#### Source

packages/network-layer/models/ResponseModel.ts:80

---

### setData()

> **setData**(`data`): `void`

Sets the data of the response.

#### Parameters

• **data**: [`dynamic`](../../../types/Common/type-aliases/dynamic.md)

The data payload of the response

#### Returns

`void`

#### Source

packages/network-layer/models/ResponseModel.ts:48

---

### setError()

> **setError**(`error`): `void`

Sets the error object of the response.

#### Parameters

• **error**: [`dynamic`](../../../types/Common/type-aliases/dynamic.md)

The error object if the request failed

#### Returns

`void`

#### Source

packages/network-layer/models/ResponseModel.ts:56

---

### setHeaders()

> **setHeaders**(`headers`): `void`

Sets the headers of the response.

#### Parameters

• **headers**: `Record`\<`string`, `string`\>

The headers of the response

#### Returns

`void`

#### Source

packages/network-layer/models/ResponseModel.ts:40

---

### setStatusCode()

> **setStatusCode**(`statusCode`): `void`

Sets the status code of the response.

#### Parameters

• **statusCode**: `number`

The HTTP status code

#### Returns

`void`

#### Source

packages/network-layer/models/ResponseModel.ts:32
