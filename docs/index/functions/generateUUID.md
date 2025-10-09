[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [index](../../index/README.md) / generateUUID

# Function: generateUUID()

> **generateUUID**(`userId`, `accountId`): `string`

Generates a UUID for a user based on their userId and accountId.
This function can be called without initializing the VWO client.

## Parameters

• **userId**: `string`

The user's ID.

• **accountId**: `string`

The account ID associated with the user.

## Returns

`string`

A UUID string formatted without dashes and in uppercase.

## Throws

`TypeError`

If userId or accountId are not valid strings.

## Example

```javascript
import { generateUUID } from 'vwo-fme-node-sdk';

const userId = 'user123';
const accountId = 'account456';
const uuid = generateUUID(userId, accountId);
console.log(uuid); // Output: "A1B2C3D4E5F6..."
```

## Description

This function generates a deterministic UUID for a user based on their userId and accountId. The UUID is generated using UUID v5 with a namespace derived from the VWO seed URL and account ID. The resulting UUID is formatted without dashes and converted to uppercase for consistency.

The function can be called without initializing the VWO client, making it useful for standalone UUID generation needs or for generating user IDs before client initialization.

## Source

index.ts:52
