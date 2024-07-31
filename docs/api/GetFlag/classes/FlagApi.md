[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [api/GetFlag](../README.md) / FlagApi

# Class: FlagApi

## Implements

- `IGetFlag`

## Constructors

### new FlagApi()

> **new FlagApi**(): [`FlagApi`](FlagApi.md)

#### Returns

[`FlagApi`](FlagApi.md)

## Methods

### get()

> **get**(`featureKey`, `settings`, `context`, `hooksService`): `Promise`\<[`FeatureModel`](../../../models/campaign/FeatureModel/classes/FeatureModel.md)\>

#### Parameters

• **featureKey**: `string`

• **settings**: [`SettingsModel`](../../../models/settings/SettingsModel/classes/SettingsModel.md)

• **context**: [`ContextModel`](../../../models/user/ContextModel/classes/ContextModel.md)

• **hooksService**: [`default`](../../../services/HooksService/classes/default.md)

#### Returns

`Promise`\<[`FeatureModel`](../../../models/campaign/FeatureModel/classes/FeatureModel.md)\>

#### Implementation of

`IGetFlag.get`

#### Source

api/GetFlag.ts:51
