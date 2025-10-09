[**vwo-fme-node-sdk**](../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../modules.md) / api/GenerateUUID

# api/GenerateUUID

## Index

### Functions

- [generateUUID](../../index/functions/generateUUID.md)

## Description

The GenerateUUID API provides utility functions for generating UUIDs that can be used with VWO. These functions can be called without initializing the VWO client, making them useful for standalone UUID generation needs.

### Key Features

- **No Client Initialization Required**: These functions can be called directly without setting up a VWO client instance.
- **Deterministic UUIDs**: The `generateUUID` function creates consistent UUIDs for the same user and account combination.
- **Random UUIDs**: The `generateRandomUUID` function creates random UUIDs based on an SDK key.
- **Type Safety**: Full TypeScript support with proper type checking and error handling.

### Usage Examples

#### Generate User UUID

```javascript
import { generateUUID } from 'vwo-fme-node-sdk';

const userId = 'user123';
const accountId = 'account456';
const uuid = generateUUID(userId, accountId);
console.log(uuid); // Output: "A1B2C3D4E5F6..."
```


### Error Handling

The function includes comprehensive error handling:

- **Type Validation**: Ensures all parameters are valid strings
- **Error Logging**: Logs errors using the VWO logging system
- **TypeError Throwing**: Throws descriptive TypeErrors for invalid inputs

### Integration with VWO

These UUIDs are designed to work seamlessly with VWO's user identification system and can be used as user IDs in feature flag evaluations and event tracking.
