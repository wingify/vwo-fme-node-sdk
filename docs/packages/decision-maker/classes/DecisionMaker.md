[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [packages/decision-maker](../README.md) / DecisionMaker

# Class: DecisionMaker

## Constructors

### new DecisionMaker()

> **new DecisionMaker**(): [`DecisionMaker`](DecisionMaker.md)

#### Returns

[`DecisionMaker`](DecisionMaker.md)

## Methods

### calculateBucketValue()

> **calculateBucketValue**(`str`, `multiplier`?, `maxValue`?): `number`

Calculates the bucket value for a given string with optional multiplier and maximum value.

#### Parameters

• **str**: `string`

The input string to calculate the bucket value for

• **multiplier?**: `number`= `1`

Optional multiplier to adjust the value

• **maxValue?**: `number`= `10000`

The maximum value for bucket scaling

#### Returns

`number`

- The calculated bucket value

#### Source

packages/decision-maker/index.ts:62

---

### generateBucketValue()

> **generateBucketValue**(`hashValue`, `maxValue`, `multiplier`?): `number`

Generates a bucket value based on the hash value, maximum value, and an optional multiplier.

#### Parameters

• **hashValue**: `number`

The hash value used for calculation

• **maxValue**: `number`

The maximum value for bucket scaling

• **multiplier?**: `number`= `1`

Optional multiplier to adjust the value

#### Returns

`number`

- The calculated bucket value

#### Source

packages/decision-maker/index.ts:29

---

### generateHashValue()

> **generateHashValue**(`hashKey`): `number`

Generates the hash value for a given hash key using murmurHash v3.

#### Parameters

• **hashKey**: `string`

The hash key for which the hash value is generated

#### Returns

`number`

- The generated hash value

#### Source

packages/decision-maker/index.ts:74

---

### getBucketValueForUser()

> **getBucketValueForUser**(`hashKey`, `maxValue`?): `number`

Gets the bucket value for a user based on the hash key and maximum value.

#### Parameters

• **hashKey**: `string`

The hash key for the user

• **maxValue?**: `number`= `100`

The maximum value for bucket scaling

#### Returns

`number`

- The calculated bucket value for the user

#### Source

packages/decision-maker/index.ts:47
