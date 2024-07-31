[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [models/VWOOptionsModel](../README.md) / VWOOptionsModel

# Class: VWOOptionsModel

## Implements

- [`IVWOOptions`](../interfaces/IVWOOptions.md)

## Constructors

### new VWOOptionsModel()

> **new VWOOptionsModel**(): [`VWOOptionsModel`](VWOOptionsModel.md)

#### Returns

[`VWOOptionsModel`](VWOOptionsModel.md)

## Properties

### accountId

> **accountId**: `string`

#### Implementation of

[`IVWOOptions`](../interfaces/IVWOOptions.md).[`accountId`](../interfaces/IVWOOptions.md#accountid)

#### Source

models/VWOOptionsModel.ts:49

---

### gatewayService?

> `optional` **gatewayService**: [`IGatewayService`](../../GatewayServiceModel/interfaces/IGatewayService.md)

#### Implementation of

[`IVWOOptions`](../interfaces/IVWOOptions.md).[`gatewayService`](../interfaces/IVWOOptions.md#gatewayservice)

#### Source

models/VWOOptionsModel.ts:53

---

### integrations?

> `optional` **integrations**: `IIntegrationOptions`

#### Implementation of

[`IVWOOptions`](../interfaces/IVWOOptions.md).[`integrations`](../interfaces/IVWOOptions.md#integrations)

#### Source

models/VWOOptionsModel.ts:57

---

### isDevelopmentMode?

> `optional` **isDevelopmentMode**: `boolean`

#### Implementation of

[`IVWOOptions`](../interfaces/IVWOOptions.md).[`isDevelopmentMode`](../interfaces/IVWOOptions.md#isdevelopmentmode)

#### Source

models/VWOOptionsModel.ts:51

---

### logger?

> `optional` **logger**: [`ILogManager`](../../../packages/logger/interfaces/ILogManager.md)

#### Implementation of

[`IVWOOptions`](../interfaces/IVWOOptions.md).[`logger`](../interfaces/IVWOOptions.md#logger)

#### Source

models/VWOOptionsModel.ts:55

---

### network?

> `optional` **network**: `INetworkOptions`

#### Implementation of

[`IVWOOptions`](../interfaces/IVWOOptions.md).[`network`](../interfaces/IVWOOptions.md#network)

#### Source

models/VWOOptionsModel.ts:58

---

### pollInterval?

> `optional` **pollInterval**: `number`

#### Implementation of

[`IVWOOptions`](../interfaces/IVWOOptions.md).[`pollInterval`](../interfaces/IVWOOptions.md#pollinterval)

#### Source

models/VWOOptionsModel.ts:54

---

### sdkKey

> **sdkKey**: `string`

#### Implementation of

[`IVWOOptions`](../interfaces/IVWOOptions.md).[`sdkKey`](../interfaces/IVWOOptions.md#sdkkey)

#### Source

models/VWOOptionsModel.ts:50

---

### segmentation?

> `optional` **segmentation**: [`SegmentEvaluator`](../../../packages/segmentation-evaluator/classes/SegmentEvaluator.md)

#### Implementation of

[`IVWOOptions`](../interfaces/IVWOOptions.md).[`segmentation`](../interfaces/IVWOOptions.md#segmentation)

#### Source

models/VWOOptionsModel.ts:56

---

### storage?

> `optional` **storage**: `Record`\<`any`, `any`\> \| [`Connector`](../../../packages/storage/Connector/classes/Connector.md)

#### Implementation of

[`IVWOOptions`](../interfaces/IVWOOptions.md).[`storage`](../interfaces/IVWOOptions.md#storage)

#### Source

models/VWOOptionsModel.ts:52

---

### vwoBuilder?

> `optional` **vwoBuilder**: [`IVWOBuilder`](../../../VWOBuilder/interfaces/IVWOBuilder.md)

#### Implementation of

[`IVWOOptions`](../interfaces/IVWOOptions.md).[`vwoBuilder`](../interfaces/IVWOOptions.md#vwobuilder)

#### Source

models/VWOOptionsModel.ts:60

## Methods

### getAccountId()

> **getAccountId**(): `string`

#### Returns

`string`

#### Source

models/VWOOptionsModel.ts:94

---

### getGatewayService()

> **getGatewayService**(): [`IGatewayService`](../../GatewayServiceModel/interfaces/IGatewayService.md)

#### Returns

[`IGatewayService`](../../GatewayServiceModel/interfaces/IGatewayService.md)

#### Source

models/VWOOptionsModel.ts:110

---

### getIsDevelopmentMode()

> **getIsDevelopmentMode**(): `boolean`

#### Returns

`boolean`

#### Source

models/VWOOptionsModel.ts:102

---

### getLogger()

> **getLogger**(): [`ILogManager`](../../../packages/logger/interfaces/ILogManager.md)

#### Returns

[`ILogManager`](../../../packages/logger/interfaces/ILogManager.md)

#### Source

models/VWOOptionsModel.ts:118

---

### getNetwork()

> **getNetwork**(): `INetworkOptions`

#### Returns

`INetworkOptions`

#### Source

models/VWOOptionsModel.ts:126

---

### getPollInterval()

> **getPollInterval**(): `number`

#### Returns

`number`

#### Source

models/VWOOptionsModel.ts:114

---

### getSdkKey()

> **getSdkKey**(): `string`

#### Returns

`string`

#### Source

models/VWOOptionsModel.ts:98

---

### getSegmentation()

> **getSegmentation**(): [`SegmentEvaluator`](../../../packages/segmentation-evaluator/classes/SegmentEvaluator.md)

#### Returns

[`SegmentEvaluator`](../../../packages/segmentation-evaluator/classes/SegmentEvaluator.md)

#### Source

models/VWOOptionsModel.ts:122

---

### getStorageService()

> **getStorageService**(): `Record`\<`any`, `any`\> \| [`Connector`](../../../packages/storage/Connector/classes/Connector.md)

#### Returns

`Record`\<`any`, `any`\> \| [`Connector`](../../../packages/storage/Connector/classes/Connector.md)

#### Source

models/VWOOptionsModel.ts:106

---

### getVWOBuilder()

> **getVWOBuilder**(): [`IVWOBuilder`](../../../VWOBuilder/interfaces/IVWOBuilder.md)

#### Returns

[`IVWOBuilder`](../../../VWOBuilder/interfaces/IVWOBuilder.md)

#### Source

models/VWOOptionsModel.ts:130

---

### modelFromDictionary()

> **modelFromDictionary**(`options`): `this`

#### Parameters

• **options**: [`VWOOptionsModel`](VWOOptionsModel.md)

#### Returns

`this`

#### Source

models/VWOOptionsModel.ts:62
