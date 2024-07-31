[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [packages/segmentation-evaluator](../README.md) / SegmentEvaluator

# Class: SegmentEvaluator

Interface for segmentation logic.
Provides a method to validate segmentation based on given parameters.

## Implements

- [`Segmentation`](../Segmentation/interfaces/Segmentation.md)

## Constructors

### new SegmentEvaluator()

> **new SegmentEvaluator**(): [`SegmentEvaluator`](SegmentEvaluator.md)

#### Returns

[`SegmentEvaluator`](SegmentEvaluator.md)

## Properties

### context

> **context**: [`ContextModel`](../../../models/user/ContextModel/classes/ContextModel.md)

#### Source

packages/segmentation-evaluator/evaluators/SegmentEvaluator.ts:30

---

### feature

> **feature**: [`FeatureModel`](../../../models/campaign/FeatureModel/classes/FeatureModel.md)

#### Source

packages/segmentation-evaluator/evaluators/SegmentEvaluator.ts:32

---

### settings

> **settings**: [`SettingsModel`](../../../models/settings/SettingsModel/classes/SettingsModel.md)

#### Source

packages/segmentation-evaluator/evaluators/SegmentEvaluator.ts:31

## Methods

### addLocationValuesToMap()

> **addLocationValuesToMap**(`dsl`, `locationMap`): `void`

Adds location values from a DSL node to a map.

#### Parameters

• **dsl**: `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

DSL node containing location data.

• **locationMap**: `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

Map to store location data.

#### Returns

`void`

#### Source

packages/segmentation-evaluator/evaluators/SegmentEvaluator.ts:178

---

### checkInUserStorage()

> **checkInUserStorage**(`settings`, `featureKey`, `context`): `Promise`\<`any`\>

Checks if the feature is enabled for the user by querying the storage.

#### Parameters

• **settings**: [`SettingsModel`](../../../models/settings/SettingsModel/classes/SettingsModel.md)

The settings model containing configuration.

• **featureKey**: `string`

The key of the feature to check.

• **context**: [`ContextModel`](../../../models/user/ContextModel/classes/ContextModel.md)

#### Returns

`Promise`\<`any`\>

A Promise resolving to a boolean indicating if the feature is enabled for the user.

#### Source

packages/segmentation-evaluator/evaluators/SegmentEvaluator.ts:239

---

### checkLocationPreSegmentation()

> **checkLocationPreSegmentation**(`locationMap`): `Promise`\<`boolean`\>

Checks if the user's location matches the expected location criteria.

#### Parameters

• **locationMap**: `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

Map of expected location values.

#### Returns

`Promise`\<`boolean`\>

A Promise resolving to a boolean indicating if the location matches.

#### Source

packages/segmentation-evaluator/evaluators/SegmentEvaluator.ts:196

---

### checkUserAgentParser()

> **checkUserAgentParser**(`uaParserMap`): `Promise`\<`boolean`\>

Checks if the user's device information matches the expected criteria.

#### Parameters

• **uaParserMap**: `Record`\<`string`, `string`[]\>

Map of expected user agent values.

#### Returns

`Promise`\<`boolean`\>

A Promise resolving to a boolean indicating if the user agent matches.

#### Source

packages/segmentation-evaluator/evaluators/SegmentEvaluator.ts:218

---

### checkValuePresent()

> **checkValuePresent**(`expectedMap`, `actualMap`): `Promise`\<`boolean`\>

Checks if the actual values match the expected values specified in the map.

#### Parameters

• **expectedMap**: `Record`\<`string`, `string`[]\>

A map of expected values for different keys.

• **actualMap**: `Record`\<`string`, `string`\>

A map of actual values to compare against.

#### Returns

`Promise`\<`boolean`\>

A Promise resolving to a boolean indicating if all actual values match the expected values.

#### Source

packages/segmentation-evaluator/evaluators/SegmentEvaluator.ts:262

---

### every()

> **every**(`dslNodes`, `customVariables`): `Promise`\<`boolean`\>

Evaluates all DSL nodes using the AND logic.

#### Parameters

• **dslNodes**: `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>[]

Array of DSL nodes to evaluate.

• **customVariables**: `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

Custom variables provided for evaluation.

#### Returns

`Promise`\<`boolean`\>

A Promise resolving to a boolean indicating if all nodes are valid.

#### Source

packages/segmentation-evaluator/evaluators/SegmentEvaluator.ts:148

---

### isSegmentationValid()

> **isSegmentationValid**(`dsl`, `properties`): `Promise`\<`boolean`\>

Validates if the segmentation defined in the DSL is applicable based on the provided properties.

#### Parameters

• **dsl**: `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

The domain-specific language defining the segmentation rules.

• **properties**: `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

The properties against which the DSL rules are evaluated.

#### Returns

`Promise`\<`boolean`\>

A Promise resolving to a boolean indicating if the segmentation is valid.

#### Implementation of

[`Segmentation`](../Segmentation/interfaces/Segmentation.md).[`isSegmentationValid`](../Segmentation/interfaces/Segmentation.md#issegmentationvalid)

#### Source

packages/segmentation-evaluator/evaluators/SegmentEvaluator.ts:40

---

### normalizeValue()

> **normalizeValue**(`value`): `any`

Normalizes a value to a consistent format for comparison.

#### Parameters

• **value**: `any`

The value to normalize.

#### Returns

`any`

The normalized value.

#### Source

packages/segmentation-evaluator/evaluators/SegmentEvaluator.ts:319

---

### some()

> **some**(`dslNodes`, `customVariables`): `Promise`\<`boolean`\>

Evaluates if any of the DSL nodes are valid using the OR logic.

#### Parameters

• **dslNodes**: `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>[]

Array of DSL nodes to evaluate.

• **customVariables**: `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

Custom variables provided for evaluation.

#### Returns

`Promise`\<`boolean`\>

A Promise resolving to a boolean indicating if any of the nodes are valid.

#### Source

packages/segmentation-evaluator/evaluators/SegmentEvaluator.ts:70

---

### valuesMatch()

> **valuesMatch**(`expectedLocationMap`, `userLocation`): `Promise`\<`boolean`\>

Compares expected location values with user's location to determine a match.

#### Parameters

• **expectedLocationMap**: `any`

A map of expected location values.

• **userLocation**: `any`

The user's actual location.

#### Returns

`Promise`\<`boolean`\>

A boolean indicating if the user's location matches the expected values.

#### Source

packages/segmentation-evaluator/evaluators/SegmentEvaluator.ts:299
