[**vwo-fme-node-sdk**](../../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../../modules.md) / [models/campaign/FeatureModel](../README.md) / FeatureModel

# Class: FeatureModel

## Constructors

### new FeatureModel()

> **new FeatureModel**(): [`FeatureModel`](FeatureModel.md)

#### Returns

[`FeatureModel`](FeatureModel.md)

## Properties

### id

> `private` **id**: `number`

#### Source

models/campaign/FeatureModel.ts:24

---

### impactCampaign

> `private` **impactCampaign**: [`ImpactCapmaignModel`](../../ImpactCampaignModel/classes/ImpactCapmaignModel.md) = `null`

#### Source

models/campaign/FeatureModel.ts:29

---

### isGatewayServiceRequired

> `private` **isGatewayServiceRequired**: `boolean` = `false`

#### Source

models/campaign/FeatureModel.ts:32

---

### key

> `private` **key**: `string`

#### Source

models/campaign/FeatureModel.ts:25

---

### m

> `private` **m**: [`MetricModel`](../../MetricModel/classes/MetricModel.md)[] = `[]`

#### Source

models/campaign/FeatureModel.ts:22

---

### metrics

> `private` **metrics**: [`MetricModel`](../../MetricModel/classes/MetricModel.md)[] = `[]`

#### Source

models/campaign/FeatureModel.ts:23

---

### name

> `private` **name**: `string`

#### Source

models/campaign/FeatureModel.ts:26

---

### rules

> `private` **rules**: [`RuleModel`](../../RuleModel/classes/RuleModel.md)[] = `[]`

#### Source

models/campaign/FeatureModel.ts:28

---

### rulesLinkedCampaign

> `private` **rulesLinkedCampaign**: [`CampaignModel`](../../CampaignModel/classes/CampaignModel.md)[] = `[]`

#### Source

models/campaign/FeatureModel.ts:31

---

### type

> `private` **type**: `string`

#### Source

models/campaign/FeatureModel.ts:27

## Methods

### getId()

> **getId**(): `number`

#### Returns

`number`

#### Source

models/campaign/FeatureModel.ts:80

---

### getImpactCampaign()

> **getImpactCampaign**(): [`ImpactCapmaignModel`](../../ImpactCampaignModel/classes/ImpactCapmaignModel.md)

#### Returns

[`ImpactCapmaignModel`](../../ImpactCampaignModel/classes/ImpactCapmaignModel.md)

#### Source

models/campaign/FeatureModel.ts:92

---

### getIsGatewayServiceRequired()

> **getIsGatewayServiceRequired**(): `boolean`

#### Returns

`boolean`

#### Source

models/campaign/FeatureModel.ts:108

---

### getKey()

> **getKey**(): `string`

#### Returns

`string`

#### Source

models/campaign/FeatureModel.ts:84

---

### getMetrics()

> **getMetrics**(): [`MetricModel`](../../MetricModel/classes/MetricModel.md)[]

#### Returns

[`MetricModel`](../../MetricModel/classes/MetricModel.md)[]

#### Source

models/campaign/FeatureModel.ts:104

---

### getName()

> **getName**(): `string`

#### Returns

`string`

#### Source

models/campaign/FeatureModel.ts:72

---

### getRules()

> **getRules**(): [`RuleModel`](../../RuleModel/classes/RuleModel.md)[]

#### Returns

[`RuleModel`](../../RuleModel/classes/RuleModel.md)[]

#### Source

models/campaign/FeatureModel.ts:88

---

### getRulesLinkedCampaign()

> **getRulesLinkedCampaign**(): [`CampaignModel`](../../CampaignModel/classes/CampaignModel.md)[]

#### Returns

[`CampaignModel`](../../CampaignModel/classes/CampaignModel.md)[]

#### Source

models/campaign/FeatureModel.ts:96

---

### getType()

> **getType**(): `string`

#### Returns

`string`

#### Source

models/campaign/FeatureModel.ts:76

---

### modelFromDictionary()

> **modelFromDictionary**(`feature`): `this`

#### Parameters

• **feature**: [`FeatureModel`](FeatureModel.md)

#### Returns

`this`

#### Source

models/campaign/FeatureModel.ts:34

---

### setIsGatewayServiceRequired()

> **setIsGatewayServiceRequired**(`isGatewayServiceRequired`): `void`

#### Parameters

• **isGatewayServiceRequired**: `boolean`

#### Returns

`void`

#### Source

models/campaign/FeatureModel.ts:112

---

### setRulesLinkedCampaign()

> **setRulesLinkedCampaign**(`rulesLinkedCampaign`): `void`

#### Parameters

• **rulesLinkedCampaign**: [`CampaignModel`](../../CampaignModel/classes/CampaignModel.md)[]

#### Returns

`void`

#### Source

models/campaign/FeatureModel.ts:100
