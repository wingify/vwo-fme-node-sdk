[**vwo-fme-node-sdk**](../../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../../modules.md) / [models/campaign/CampaignModel](../README.md) / CampaignModel

# Class: CampaignModel

## Constructors

### new CampaignModel()

> **new CampaignModel**(): [`CampaignModel`](CampaignModel.md)

#### Returns

[`CampaignModel`](CampaignModel.md)

## Properties

### campaignId

> `private` **campaignId**: `number`

#### Source

models/campaign/CampaignModel.ts:34

---

### id

> `private` **id**: `number`

#### Source

models/campaign/CampaignModel.ts:22

---

### isForcedVariationEnabled

> `private` **isForcedVariationEnabled**: `boolean`

#### Source

models/campaign/CampaignModel.ts:29

---

### isUserListEnabled

> `private` **isUserListEnabled**: `boolean`

#### Source

models/campaign/CampaignModel.ts:25

---

### key

> `private` **key**: `string`

#### Source

models/campaign/CampaignModel.ts:26

---

### metrics

> `private` **metrics**: [`MetricModel`](../../MetricModel/classes/MetricModel.md)[] = `[]`

#### Source

models/campaign/CampaignModel.ts:31

---

### name

> `private` **name**: `string`

#### Source

models/campaign/CampaignModel.ts:28

---

### percentTraffic

> `private` **percentTraffic**: `number`

#### Source

models/campaign/CampaignModel.ts:24

---

### ruleKey

> `private` **ruleKey**: `string`

#### Source

models/campaign/CampaignModel.ts:35

---

### segments

> `private` **segments**: `Record`\<`string`, [`dynamic`](../../../../types/Common/type-aliases/dynamic.md)\>

#### Source

models/campaign/CampaignModel.ts:23

---

### type

> `private` **type**: `string`

#### Source

models/campaign/CampaignModel.ts:27

---

### variables

> `private` **variables**: [`VariableModel`](../../VariableModel/classes/VariableModel.md)[] = `[]`

#### Source

models/campaign/CampaignModel.ts:32

---

### variationId

> `private` **variationId**: `number`

#### Source

models/campaign/CampaignModel.ts:33

---

### variations

> `private` **variations**: [`VariationModel`](../../VariationModel/classes/VariationModel.md)[] = `[]`

#### Source

models/campaign/CampaignModel.ts:30

## Methods

### copy()

> **copy**(`campaignModel`): `void`

#### Parameters

• **campaignModel**: [`CampaignModel`](CampaignModel.md)

#### Returns

`void`

#### Source

models/campaign/CampaignModel.ts:37

---

### getId()

> **getId**(): `number`

#### Returns

`number`

#### Source

models/campaign/CampaignModel.ts:109

---

### getIsForcedVariationEnabled()

> **getIsForcedVariationEnabled**(): `boolean`

#### Returns

`boolean`

#### Source

models/campaign/CampaignModel.ts:129

---

### getIsUserListEnabled()

> **getIsUserListEnabled**(): `boolean`

#### Returns

`boolean`

#### Source

models/campaign/CampaignModel.ts:133

---

### getKey()

> **getKey**(): `string`

#### Returns

`string`

#### Source

models/campaign/CampaignModel.ts:137

---

### getMetrics()

> **getMetrics**(): [`MetricModel`](../../MetricModel/classes/MetricModel.md)[]

#### Returns

[`MetricModel`](../../MetricModel/classes/MetricModel.md)[]

#### Source

models/campaign/CampaignModel.ts:141

---

### getName()

> **getName**(): `string`

#### Returns

`string`

#### Source

models/campaign/CampaignModel.ts:113

---

### getRuleKey()

> **getRuleKey**(): `string`

#### Returns

`string`

#### Source

models/campaign/CampaignModel.ts:153

---

### getSegments()

> **getSegments**(): `Record`\<`string`, [`dynamic`](../../../../types/Common/type-aliases/dynamic.md)\>

#### Returns

`Record`\<`string`, [`dynamic`](../../../../types/Common/type-aliases/dynamic.md)\>

#### Source

models/campaign/CampaignModel.ts:117

---

### getTraffic()

> **getTraffic**(): `number`

#### Returns

`number`

#### Source

models/campaign/CampaignModel.ts:121

---

### getType()

> **getType**(): `string`

#### Returns

`string`

#### Source

models/campaign/CampaignModel.ts:125

---

### getVariables()

> **getVariables**(): [`VariableModel`](../../VariableModel/classes/VariableModel.md)[]

#### Returns

[`VariableModel`](../../VariableModel/classes/VariableModel.md)[]

#### Source

models/campaign/CampaignModel.ts:149

---

### getVariations()

> **getVariations**(): [`VariationModel`](../../VariationModel/classes/VariationModel.md)[]

#### Returns

[`VariationModel`](../../VariationModel/classes/VariationModel.md)[]

#### Source

models/campaign/CampaignModel.ts:145

---

### modelFromDictionary()

> **modelFromDictionary**(`campaign`): `this`

#### Parameters

• **campaign**: [`CampaignModel`](CampaignModel.md)

#### Returns

`this`

#### Source

models/campaign/CampaignModel.ts:44

---

### processCampaignKeys()

> **processCampaignKeys**(`campaign`): `void`

#### Parameters

• **campaign**: [`CampaignModel`](CampaignModel.md)

#### Returns

`void`

#### Source

models/campaign/CampaignModel.ts:94

---

### processCampaignProperties()

> **processCampaignProperties**(`campaign`): `void`

#### Parameters

• **campaign**: [`CampaignModel`](CampaignModel.md)

#### Returns

`void`

#### Source

models/campaign/CampaignModel.ts:50
