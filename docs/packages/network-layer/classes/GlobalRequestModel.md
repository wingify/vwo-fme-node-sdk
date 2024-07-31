[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [packages/network-layer](../README.md) / GlobalRequestModel

# Class: GlobalRequestModel

Represents a model for global HTTP requests configuration.
This class encapsulates all necessary details such as URL, query parameters, body, headers,
timeout settings, and development mode flag.

## Constructors

### new GlobalRequestModel()

> **new GlobalRequestModel**(`url`, `query`, `body`, `headers`): [`GlobalRequestModel`](GlobalRequestModel.md)

Constructs an instance of the GlobalRequestModel.

#### Parameters

• **url**: `string`

The base URL of the HTTP request.

• **query**: `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

Query parameters as a record of key-value pairs.

• **body**: `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

Body of the request as a record of key-value pairs.

• **headers**: `Record`\<`string`, `any`\>

HTTP headers as a record of key-value pairs.

#### Returns

[`GlobalRequestModel`](GlobalRequestModel.md)

#### Source

packages/network-layer/models/GlobalRequestModel.ts:38

## Properties

### body

> `private` **body**: `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

#### Source

packages/network-layer/models/GlobalRequestModel.ts:27

---

### headers

> `private` **headers**: `Record`\<`string`, `string`\>

#### Source

packages/network-layer/models/GlobalRequestModel.ts:28

---

### isDevelopmentMode

> `private` **isDevelopmentMode**: `boolean`

#### Source

packages/network-layer/models/GlobalRequestModel.ts:29

---

### query

> `private` **query**: `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

#### Source

packages/network-layer/models/GlobalRequestModel.ts:26

---

### timeout

> `private` **timeout**: `number` = `3000`

#### Source

packages/network-layer/models/GlobalRequestModel.ts:25

---

### url

> `private` **url**: `string`

#### Source

packages/network-layer/models/GlobalRequestModel.ts:24

## Methods

### getBaseUrl()

> **getBaseUrl**(): `string`

Retrieves the base URL of the HTTP request.

#### Returns

`string`

The base URL as a string.

#### Source

packages/network-layer/models/GlobalRequestModel.ts:94

---

### getBody()

> **getBody**(): `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

Retrieves the body of the HTTP request.

#### Returns

`Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

A record of key-value pairs representing the body content.

#### Source

packages/network-layer/models/GlobalRequestModel.ts:78

---

### getDevelopmentMode()

> **getDevelopmentMode**(): `boolean`

Retrieves the development mode status of the request.

#### Returns

`boolean`

Boolean indicating if the request is in development mode.

#### Source

packages/network-layer/models/GlobalRequestModel.ts:142

---

### getHeaders()

> **getHeaders**(): `Record`\<`string`, `string`\>

Retrieves the HTTP headers of the request.

#### Returns

`Record`\<`string`, `string`\>

A record of key-value pairs representing the HTTP headers.

#### Source

packages/network-layer/models/GlobalRequestModel.ts:126

---

### getQuery()

> **getQuery**(): `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

Retrieves the query parameters of the HTTP request.

#### Returns

`Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

A record of key-value pairs representing the query parameters.

#### Source

packages/network-layer/models/GlobalRequestModel.ts:62

---

### getTimeout()

> **getTimeout**(): `number`

Retrieves the timeout duration of the HTTP request.

#### Returns

`number`

Timeout in milliseconds.

#### Source

packages/network-layer/models/GlobalRequestModel.ts:110

---

### setBaseUrl()

> **setBaseUrl**(`url`): `void`

Sets the base URL of the HTTP request.

#### Parameters

• **url**: `string`

The base URL as a string.

#### Returns

`void`

#### Source

packages/network-layer/models/GlobalRequestModel.ts:86

---

### setBody()

> **setBody**(`body`): `void`

Sets the body of the HTTP request.

#### Parameters

• **body**: `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

A record of key-value pairs representing the body content.

#### Returns

`void`

#### Source

packages/network-layer/models/GlobalRequestModel.ts:70

---

### setDevelopmentMode()

> **setDevelopmentMode**(`isDevelopmentMode`): `void`

Sets the development mode status for the request.

#### Parameters

• **isDevelopmentMode**: `boolean`

Boolean flag indicating if the request is in development mode.

#### Returns

`void`

#### Source

packages/network-layer/models/GlobalRequestModel.ts:134

---

### setHeaders()

> **setHeaders**(`headers`): `void`

Sets the HTTP headers for the request.

#### Parameters

• **headers**: `Record`\<`string`, `string`\>

A record of key-value pairs representing the HTTP headers.

#### Returns

`void`

#### Source

packages/network-layer/models/GlobalRequestModel.ts:118

---

### setQuery()

> **setQuery**(`query`): `void`

Sets the query parameters for the HTTP request.

#### Parameters

• **query**: `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

A record of key-value pairs representing the query parameters.

#### Returns

`void`

#### Source

packages/network-layer/models/GlobalRequestModel.ts:54

---

### setTimeout()

> **setTimeout**(`timeout`): `void`

Sets the timeout duration for the HTTP request.

#### Parameters

• **timeout**: `number`

Timeout in milliseconds.

#### Returns

`void`

#### Source

packages/network-layer/models/GlobalRequestModel.ts:102
