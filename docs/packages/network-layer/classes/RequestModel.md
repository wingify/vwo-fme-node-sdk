[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [packages/network-layer](../README.md) / RequestModel

# Class: RequestModel

Represents a model for HTTP requests.
This class encapsulates all necessary details such as URL, method, path, query parameters, body, headers,
scheme, port, and timeout settings.

## Constructors

### new RequestModel()

> **new RequestModel**(`url`, `method`, `path`, `query`, `body`, `headers`, `scheme`, `port`): [`RequestModel`](RequestModel.md)

Constructs an instance of the RequestModel.

#### Parameters

• **url**: `string`

The base URL of the HTTP request.

• **method**: `string`= `HttpMethodEnum.GET`

HTTP method, default is 'GET'.

• **path**: `string`

URL path.

• **query**: `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

Query parameters as a record of key-value pairs.

• **body**: `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

Body of the request as a record of key-value pairs.

• **headers**: `Record`\<`string`, `string`\>

HTTP headers as a record of key-value pairs.

• **scheme**: `string`= `HTTPS`

Protocol scheme, default is 'http'.

• **port**: `number`

Port number, default is 80.

#### Returns

[`RequestModel`](RequestModel.md)

#### Source

packages/network-layer/models/RequestModel.ts:47

## Properties

### body

> `private` **body**: `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

#### Source

packages/network-layer/models/RequestModel.ts:33

---

### headers

> `private` **headers**: `Record`\<`string`, `string`\>

#### Source

packages/network-layer/models/RequestModel.ts:34

---

### method

> `private` **method**: `string`

#### Source

packages/network-layer/models/RequestModel.ts:27

---

### path

> `private` **path**: `string`

#### Source

packages/network-layer/models/RequestModel.ts:30

---

### port

> `private` **port**: `number`

#### Source

packages/network-layer/models/RequestModel.ts:29

---

### query

> `private` **query**: `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

#### Source

packages/network-layer/models/RequestModel.ts:31

---

### scheme

> `private` **scheme**: `string`

#### Source

packages/network-layer/models/RequestModel.ts:28

---

### timeout

> `private` **timeout**: `number`

#### Source

packages/network-layer/models/RequestModel.ts:32

---

### url

> `private` **url**: `string`

#### Source

packages/network-layer/models/RequestModel.ts:26

## Methods

### getBody()

> **getBody**(): `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

Retrieves the body of the HTTP request.

#### Returns

`Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

A record of key-value pairs representing the body content.

#### Source

packages/network-layer/models/RequestModel.ts:87

---

### getHeaders()

> **getHeaders**(): `Record`\<`string`, `string`\>

Retrieves the HTTP headers of the request.

#### Returns

`Record`\<`string`, `string`\>

A record of key-value pairs representing the HTTP headers.

#### Source

packages/network-layer/models/RequestModel.ts:128

---

### getMethod()

> **getMethod**(): `string`

Retrieves the HTTP method.

#### Returns

`string`

The HTTP method as a string.

#### Source

packages/network-layer/models/RequestModel.ts:71

---

### getOptions()

> **getOptions**(): `Record`\<`string`, `any`\>

Constructs the options for the HTTP request based on the current state of the model.
This method is used to prepare the request options for execution.

#### Returns

`Record`\<`string`, `any`\>

A record containing all relevant options for the HTTP request.

#### Source

packages/network-layer/models/RequestModel.ts:222

---

### getPath()

> **getPath**(): `string`

Retrieves the path of the HTTP request.

#### Returns

`string`

The path as a string.

#### Source

packages/network-layer/models/RequestModel.ts:204

---

### getPort()

> **getPort**(): `number`

Retrieves the port number of the HTTP request.

#### Returns

`number`

The port number as an integer.

#### Source

packages/network-layer/models/RequestModel.ts:187

---

### getQuery()

> **getQuery**(): `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

Retrieves the query parameters of the HTTP request.

#### Returns

`Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

A record of key-value pairs representing the query parameters.

#### Source

packages/network-layer/models/RequestModel.ts:111

---

### getScheme()

> **getScheme**(): `string`

Retrieves the scheme of the HTTP request.

#### Returns

`string`

The scheme as a string.

#### Source

packages/network-layer/models/RequestModel.ts:170

---

### getTimeout()

> **getTimeout**(): `number`

Retrieves the timeout duration of the HTTP request.

#### Returns

`number`

Timeout in milliseconds.

#### Source

packages/network-layer/models/RequestModel.ts:145

---

### getUrl()

> **getUrl**(): `string`

Retrieves the base URL of the HTTP request.

#### Returns

`string`

The base URL as a string.

#### Source

packages/network-layer/models/RequestModel.ts:153

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

packages/network-layer/models/RequestModel.ts:95

---

### setHeaders()

> **setHeaders**(`headers`): `this`

Sets the HTTP headers for the request.

#### Parameters

• **headers**: `Record`\<`string`, `string`\>

A record of key-value pairs representing the HTTP headers.

#### Returns

`this`

#### Source

packages/network-layer/models/RequestModel.ts:119

---

### setMethod()

> **setMethod**(`method`): `void`

Sets the HTTP method.

#### Parameters

• **method**: `string`

The HTTP method to set.

#### Returns

`void`

#### Source

packages/network-layer/models/RequestModel.ts:79

---

### setPath()

> **setPath**(`path`): `this`

Sets the path of the HTTP request.

#### Parameters

• **path**: `string`

The path to set.

#### Returns

`this`

#### Source

packages/network-layer/models/RequestModel.ts:212

---

### setPort()

> **setPort**(`port`): `this`

Sets the port number for the HTTP request.

#### Parameters

• **port**: `number`

The port number to set.

#### Returns

`this`

#### Source

packages/network-layer/models/RequestModel.ts:195

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

packages/network-layer/models/RequestModel.ts:103

---

### setScheme()

> **setScheme**(`scheme`): `this`

Sets the scheme of the HTTP request.

#### Parameters

• **scheme**: `string`

The scheme to set (http or https).

#### Returns

`this`

#### Source

packages/network-layer/models/RequestModel.ts:178

---

### setTimeout()

> **setTimeout**(`timeout`): `this`

Sets the timeout duration for the HTTP request.

#### Parameters

• **timeout**: `number`

Timeout in milliseconds.

#### Returns

`this`

#### Source

packages/network-layer/models/RequestModel.ts:136

---

### setUrl()

> **setUrl**(`url`): `this`

Sets the base URL of the HTTP request.

#### Parameters

• **url**: `string`

The base URL as a string.

#### Returns

`this`

#### Source

packages/network-layer/models/RequestModel.ts:161
