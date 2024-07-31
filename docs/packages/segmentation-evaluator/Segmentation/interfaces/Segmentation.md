[**vwo-fme-node-sdk**](../../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../../modules.md) / [packages/segmentation-evaluator/Segmentation](../README.md) / Segmentation

# Interface: Segmentation

Interface for segmentation logic.
Provides a method to validate segmentation based on given parameters.

## Methods

### isSegmentationValid()

> **isSegmentationValid**(`dsl`, `properties`, `settings`): `boolean` \| `Promise`\<`any`\>

Validates if the segmentation defined by the DSL is applicable given the properties and settings.

#### Parameters

• **dsl**: `Record`\<`string`, [`dynamic`](../../../../types/Common/type-aliases/dynamic.md)\>

The domain-specific language defining segmentation rules.

• **properties**: `Record`\<`string`, [`dynamic`](../../../../types/Common/type-aliases/dynamic.md)\>

The properties of the entity to be segmented.

• **settings**: [`SettingsModel`](../../../../models/settings/SettingsModel/classes/SettingsModel.md)

The settings model containing configuration details.

#### Returns

`boolean` \| `Promise`\<`any`\>

- True if the segmentation is valid, otherwise false or a Promise resolving to any type.

#### Source

packages/segmentation-evaluator/Segmentation.ts:32
