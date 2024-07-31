[**vwo-fme-node-sdk**](../../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../../modules.md) / [models/user/ContextModel](../README.md) / ContextModel

# Class: ContextModel

## Constructors

### new ContextModel()

> **new ContextModel**(): [`ContextModel`](ContextModel.md)

#### Returns

[`ContextModel`](ContextModel.md)

## Properties

### \_vwo?

> `private` `optional` **\_vwo**: [`ContextVWOModel`](../../ContextVWOModel/classes/ContextVWOModel.md)

#### Source

models/user/ContextModel.ts:25

---

### customVariables?

> `private` `optional` **customVariables**: `Record`\<`string`, `any`\>

#### Source

models/user/ContextModel.ts:23

---

### id

> `private` **id**: `string` \| `number`

#### Source

models/user/ContextModel.ts:20

---

### ipAddress?

> `private` `optional` **ipAddress**: `string`

#### Source

models/user/ContextModel.ts:22

---

### userAgent?

> `private` `optional` **userAgent**: `string`

#### Source

models/user/ContextModel.ts:21

---

### variationTargetingVariables?

> `private` `optional` **variationTargetingVariables**: `Record`\<`string`, [`dynamic`](../../../../types/Common/type-aliases/dynamic.md)\>

#### Source

models/user/ContextModel.ts:24

## Methods

### getCustomVariables()

> **getCustomVariables**(): `Record`\<`string`, `any`\>

#### Returns

`Record`\<`string`, `any`\>

#### Source

models/user/ContextModel.ts:55

---

### getId()

> **getId**(): `string`

#### Returns

`string`

#### Source

models/user/ContextModel.ts:43

---

### getIpAddress()

> **getIpAddress**(): `string`

#### Returns

`string`

#### Source

models/user/ContextModel.ts:51

---

### getUserAgent()

> **getUserAgent**(): `string`

#### Returns

`string`

#### Source

models/user/ContextModel.ts:47

---

### getVariationTargetingVariables()

> **getVariationTargetingVariables**(): `Record`\<`string`, [`dynamic`](../../../../types/Common/type-aliases/dynamic.md)\>

#### Returns

`Record`\<`string`, [`dynamic`](../../../../types/Common/type-aliases/dynamic.md)\>

#### Source

models/user/ContextModel.ts:63

---

### getVwo()

> **getVwo**(): [`ContextVWOModel`](../../ContextVWOModel/classes/ContextVWOModel.md)

#### Returns

[`ContextVWOModel`](../../ContextVWOModel/classes/ContextVWOModel.md)

#### Source

models/user/ContextModel.ts:71

---

### modelFromDictionary()

> **modelFromDictionary**(`context`): `this`

#### Parameters

• **context**: `Record`\<`string`, `any`\>

#### Returns

`this`

#### Source

models/user/ContextModel.ts:27

---

### setCustomVariables()

> **setCustomVariables**(`customVariables`): `void`

#### Parameters

• **customVariables**: `Record`\<`string`, `any`\>

#### Returns

`void`

#### Source

models/user/ContextModel.ts:59

---

### setVariationTargetingVariables()

> **setVariationTargetingVariables**(`variationTargetingVariables`): `void`

#### Parameters

• **variationTargetingVariables**: `Record`\<`string`, [`dynamic`](../../../../types/Common/type-aliases/dynamic.md)\>

#### Returns

`void`

#### Source

models/user/ContextModel.ts:67

---

### setVwo()

> **setVwo**(`_vwo`): `void`

#### Parameters

• **\_vwo**: [`ContextVWOModel`](../../ContextVWOModel/classes/ContextVWOModel.md)

#### Returns

`void`

#### Source

models/user/ContextModel.ts:75
