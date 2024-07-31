[**vwo-fme-node-sdk**](../../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../../modules.md) / [models/settings/SettingsModel](../README.md) / SettingsModel

# Class: SettingsModel

## Constructors

### new SettingsModel()

> **new SettingsModel**(`settings`): [`SettingsModel`](SettingsModel.md)

#### Parameters

• **settings**: [`SettingsModel`](SettingsModel.md)

#### Returns

[`SettingsModel`](SettingsModel.md)

#### Source

models/settings/SettingsModel.ts:42

## Properties

### a?

> `private` `optional` **a**: `string`

#### Source

models/settings/SettingsModel.ts:35

---

### accountId

> `private` **accountId**: `string`

#### Source

models/settings/SettingsModel.ts:36

---

### c?

> `private` `optional` **c**: [`CampaignModel`](../../../campaign/CampaignModel/classes/CampaignModel.md)[] = `[]`

#### Source

models/settings/SettingsModel.ts:26

---

### cG?

> `private` `optional` **cG**: `Record`\<`string`, `number`\> = `{}`

#### Source

models/settings/SettingsModel.ts:30

---

### campaignGroups?

> `private` `optional` **campaignGroups**: `Record`\<`string`, `number`\> = `{}`

#### Source

models/settings/SettingsModel.ts:29

---

### campaigns

> `private` **campaigns**: [`CampaignModel`](../../../campaign/CampaignModel/classes/CampaignModel.md)[] = `[]`

#### Source

models/settings/SettingsModel.ts:27

---

### collectionPrefix?

> `private` `optional` **collectionPrefix**: `string`

#### Source

models/settings/SettingsModel.ts:40

---

### f?

> `private` `optional` **f**: [`FeatureModel`](../../../campaign/FeatureModel/classes/FeatureModel.md)[] = `[]`

#### Source

models/settings/SettingsModel.ts:23

---

### features

> `private` **features**: [`FeatureModel`](../../../campaign/FeatureModel/classes/FeatureModel.md)[] = `[]`

#### Source

models/settings/SettingsModel.ts:24

---

### g?

> `private` `optional` **g**: `Record`\<`string`, `any`\> = `{}`

#### Source

models/settings/SettingsModel.ts:33

---

### groups?

> `private` `optional` **groups**: `Record`\<`string`, `any`\> = `{}`

#### Source

models/settings/SettingsModel.ts:32

---

### sK?

> `private` `optional` **sK**: `string`

#### Source

models/settings/SettingsModel.ts:20

---

### sdkKey

> `private` **sdkKey**: `string`

#### Source

models/settings/SettingsModel.ts:21

---

### v?

> `private` `optional` **v**: `number`

#### Source

models/settings/SettingsModel.ts:38

---

### version

> `private` **version**: `number`

#### Source

models/settings/SettingsModel.ts:39

## Methods

### getAccountId()

> **getAccountId**(): `string`

#### Returns

`string`

#### Source

models/settings/SettingsModel.ts:90

---

### getCampaignGroups()

> **getCampaignGroups**(): `Record`\<`string`, `number`\>

#### Returns

`Record`\<`string`, `number`\>

#### Source

models/settings/SettingsModel.ts:102

---

### getCampaigns()

> **getCampaigns**(): [`CampaignModel`](../../../campaign/CampaignModel/classes/CampaignModel.md)[]

#### Returns

[`CampaignModel`](../../../campaign/CampaignModel/classes/CampaignModel.md)[]

#### Source

models/settings/SettingsModel.ts:82

---

### getCollectionPrefix()

> **getCollectionPrefix**(): `string`

#### Returns

`string`

#### Source

models/settings/SettingsModel.ts:98

---

### getFeatures()

> **getFeatures**(): [`FeatureModel`](../../../campaign/FeatureModel/classes/FeatureModel.md)[]

#### Returns

[`FeatureModel`](../../../campaign/FeatureModel/classes/FeatureModel.md)[]

#### Source

models/settings/SettingsModel.ts:78

---

### getGroups()

> **getGroups**(): `Record`\<`string`, `any`\>

#### Returns

`Record`\<`string`, `any`\>

#### Source

models/settings/SettingsModel.ts:106

---

### getSdkkey()

> **getSdkkey**(): `string`

#### Returns

`string`

#### Source

models/settings/SettingsModel.ts:86

---

### getVersion()

> **getVersion**(): `number`

#### Returns

`number`

#### Source

models/settings/SettingsModel.ts:94
