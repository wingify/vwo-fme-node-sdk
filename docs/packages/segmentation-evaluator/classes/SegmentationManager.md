[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [packages/segmentation-evaluator](../README.md) / SegmentationManager

# Class: SegmentationManager

## Constructors

### new SegmentationManager()

> **new SegmentationManager**(): [`SegmentationManager`](SegmentationManager.md)

#### Returns

[`SegmentationManager`](SegmentationManager.md)

## Properties

### evaluator

> **evaluator**: [`SegmentEvaluator`](SegmentEvaluator.md)

#### Source

packages/segmentation-evaluator/core/SegmentationManger.ts:30

---

### instance

> `static` `private` **instance**: [`SegmentationManager`](SegmentationManager.md)

#### Source

packages/segmentation-evaluator/core/SegmentationManger.ts:29

## Accessors

### Instance

> `get` `static` **Instance**(): [`SegmentationManager`](SegmentationManager.md)

Singleton pattern implementation for getting the instance of SegmentationManager.

#### Returns

[`SegmentationManager`](SegmentationManager.md)

The singleton instance.

#### Source

packages/segmentation-evaluator/core/SegmentationManger.ts:36

## Methods

### attachEvaluator()

> **attachEvaluator**(`evaluator`?): `void`

Attaches an evaluator to the manager, or creates a new one if none is provided.

#### Parameters

• **evaluator?**: [`SegmentEvaluator`](SegmentEvaluator.md)

Optional evaluator to attach.

#### Returns

`void`

#### Source

packages/segmentation-evaluator/core/SegmentationManger.ts:45

---

### setContextualData()

> **setContextualData**(`settings`, `feature`, `context`): `Promise`\<`void`\>

Sets the contextual data for the segmentation process.

#### Parameters

• **settings**: [`SettingsModel`](../../../models/settings/SettingsModel/classes/SettingsModel.md)

The settings data.

• **feature**: [`FeatureModel`](../../../models/campaign/FeatureModel/classes/FeatureModel.md)

The feature data including segmentation needs.

• **context**: [`ContextModel`](../../../models/user/ContextModel/classes/ContextModel.md)

The context data for the evaluation.

#### Returns

`Promise`\<`void`\>

#### Source

packages/segmentation-evaluator/core/SegmentationManger.ts:55

---

### validateSegmentation()

> **validateSegmentation**(`dsl`, `properties`): `Promise`\<`boolean`\>

Validates the segmentation against provided DSL and properties.

#### Parameters

• **dsl**: `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

The segmentation DSL.

• **properties**: `Record`\<`any`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

The properties to validate against.

#### Returns

`Promise`\<`boolean`\>

True if segmentation is valid, otherwise false.

#### Source

packages/segmentation-evaluator/core/SegmentationManger.ts:92
