[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [api/SetAttribute](../README.md) / SetAttributeApi

# Class: SetAttributeApi

## Implements

- `ISetAttribute`

## Constructors

### new SetAttributeApi()

> **new SetAttributeApi**(): [`SetAttributeApi`](SetAttributeApi.md)

#### Returns

[`SetAttributeApi`](SetAttributeApi.md)

## Methods

### setAttribute()

> **setAttribute**(`settings`, `attributeKey`, `attributeValue`, `context`): `void`

Implementation of setAttribute to create an impression for a user attribute.

#### Parameters

• **settings**: [`SettingsModel`](../../../models/settings/SettingsModel/classes/SettingsModel.md)

Configuration settings.

• **attributeKey**: `string`

The key of the attribute to set.

• **attributeValue**: `any`

The value of the attribute.

• **context**: [`ContextModel`](../../../models/user/ContextModel/classes/ContextModel.md)

Context containing user information.

#### Returns

`void`

#### Implementation of

`ISetAttribute.setAttribute`

#### Source

api/SetAttribute.ts:40
