[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [api/TrackEvent](../README.md) / TrackApi

# Class: TrackApi

## Implements

- `ITrack`

## Constructors

### new TrackApi()

> **new TrackApi**(): [`TrackApi`](TrackApi.md)

#### Returns

[`TrackApi`](TrackApi.md)

## Methods

### track()

> **track**(`settings`, `eventName`, `eventProperties`, `context`, `hooksService`): `Promise`\<`Record`\<`string`, `boolean`\>\>

Implementation of the track method to handle event tracking.
Checks if the event exists, creates an impression, and executes hooks.

#### Parameters

• **settings**: [`SettingsModel`](../../../models/settings/SettingsModel/classes/SettingsModel.md)

• **eventName**: `string`

• **eventProperties**: `any`

• **context**: [`ContextModel`](../../../models/user/ContextModel/classes/ContextModel.md)

• **hooksService**: [`default`](../../../services/HooksService/classes/default.md)

#### Returns

`Promise`\<`Record`\<`string`, `boolean`\>\>

#### Implementation of

`ITrack.track`

#### Source

api/TrackEvent.ts:51
