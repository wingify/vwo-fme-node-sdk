[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [utils/MegUtil](../README.md) / evaluateGroups

# Function: evaluateGroups()

> **evaluateGroups**(`settings`, `feature`, `groupId`, `evaluatedFeatureMap`, `context`, `storageService`): `Promise`\<`any`\>

Evaluates groups for a given feature and group ID.

## Parameters

• **settings**: [`SettingsModel`](../../../models/settings/SettingsModel/classes/SettingsModel.md)

The settings model.

• **feature**: [`FeatureModel`](../../../models/campaign/FeatureModel/classes/FeatureModel.md)

The feature model to evaluate.

• **groupId**: `number`

The ID of the group.

• **evaluatedFeatureMap**: `Map`\<`string`, `any`\>

A map containing evaluated features.

• **context**: [`ContextModel`](../../../models/user/ContextModel/classes/ContextModel.md)

The context model.

• **storageService**: [`IStorageService`](../../../services/StorageService/interfaces/IStorageService.md)

The storage service.

## Returns

`Promise`\<`any`\>

A promise that resolves to the evaluation result.

## Source

utils/MegUtil.ts:54
