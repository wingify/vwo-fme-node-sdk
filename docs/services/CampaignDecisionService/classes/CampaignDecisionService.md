[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [services/CampaignDecisionService](../README.md) / CampaignDecisionService

# Class: CampaignDecisionService

## Implements

- `ICampaignDecisionService`

## Constructors

### new CampaignDecisionService()

> **new CampaignDecisionService**(): [`CampaignDecisionService`](CampaignDecisionService.md)

#### Returns

[`CampaignDecisionService`](CampaignDecisionService.md)

## Methods

### bucketUserToVariation()

> **bucketUserToVariation**(`userId`, `accountId`, `campaign`): [`VariationModel`](../../../models/campaign/VariationModel/classes/VariationModel.md)

Validates the User ID and generates Variation into which the User is bucketed in.

#### Parameters

• **userId**: `any`

the unique ID assigned to User

• **accountId**: `any`

• **campaign**: [`CampaignModel`](../../../models/campaign/CampaignModel/classes/CampaignModel.md)

the Campaign of which User is a part of

#### Returns

[`VariationModel`](../../../models/campaign/VariationModel/classes/VariationModel.md)

variation data into which user is bucketed in or null if not

#### Implementation of

`ICampaignDecisionService.bucketUserToVariation`

#### Source

services/CampaignDecisionService.ts:109

---

### checkInRange()

> **checkInRange**(`variation`, `bucketValue`): [`VariationModel`](../../../models/campaign/VariationModel/classes/VariationModel.md)

#### Parameters

• **variation**: [`VariationModel`](../../../models/campaign/VariationModel/classes/VariationModel.md)

• **bucketValue**: `number`

#### Returns

[`VariationModel`](../../../models/campaign/VariationModel/classes/VariationModel.md)

#### Implementation of

`ICampaignDecisionService.checkInRange`

#### Source

services/CampaignDecisionService.ts:95

---

### getPreSegmentationDecision()

> **getPreSegmentationDecision**(`campaign`, `context`): `Promise`\<`boolean`\>

#### Parameters

• **campaign**: [`CampaignModel`](../../../models/campaign/CampaignModel/classes/CampaignModel.md)

• **context**: [`ContextModel`](../../../models/user/ContextModel/classes/ContextModel.md)

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`ICampaignDecisionService.getPreSegmentationDecision`

#### Source

services/CampaignDecisionService.ts:137

---

### getVariation()

> **getVariation**(`variations`, `bucketValue`): [`VariationModel`](../../../models/campaign/VariationModel/classes/VariationModel.md)

Returns the Variation by checking the Start and End Bucket Allocations of each Variation

#### Parameters

• **variations**: [`VariationModel`](../../../models/campaign/VariationModel/classes/VariationModel.md)[]

• **bucketValue**: `number`

the bucket Value of the user

#### Returns

[`VariationModel`](../../../models/campaign/VariationModel/classes/VariationModel.md)

variation data allotted to the user or null if not

#### Implementation of

`ICampaignDecisionService.getVariation`

#### Source

services/CampaignDecisionService.ts:84

---

### getVariationAlloted()

> **getVariationAlloted**(`userId`, `accountId`, `campaign`): [`VariationModel`](../../../models/campaign/VariationModel/classes/VariationModel.md)

#### Parameters

• **userId**: `any`

• **accountId**: `any`

• **campaign**: [`CampaignModel`](../../../models/campaign/CampaignModel/classes/CampaignModel.md)

#### Returns

[`VariationModel`](../../../models/campaign/VariationModel/classes/VariationModel.md)

#### Implementation of

`ICampaignDecisionService.getVariationAlloted`

#### Source

services/CampaignDecisionService.ts:186

---

### isUserPartOfCampaign()

> **isUserPartOfCampaign**(`userId`, `campaign`): `boolean`

Calculate if this user should become part of the campaign or not

#### Parameters

• **userId**: `any`

the unique ID assigned to a user

• **campaign**: [`CampaignModel`](../../../models/campaign/CampaignModel/classes/CampaignModel.md)

fot getting the value of traffic allotted to the campaign

#### Returns

`boolean`

if User is a part of Campaign or not

#### Implementation of

`ICampaignDecisionService.isUserPartOfCampaign`

#### Source

services/CampaignDecisionService.ts:48
