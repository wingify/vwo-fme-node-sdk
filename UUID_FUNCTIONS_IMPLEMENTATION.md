# UUID Functions Implementation - Production Ready

## Overview
This document outlines the implementation of UUID generation functions that are now available at the same level as `getFlag()` and `trackEvent()` without requiring client initialization.

## Changes Made

### 1. Core Implementation
**File**: `lib/index.ts`
- Added direct exports for UUID functions
- Added comprehensive JSDoc documentation
- Functions available: `getUUID`, `generateUUID`, `getRandomUUID`

### 2. Documentation
**Files Created**:
- `docs/api/GenerateUUID/README.md` - Main API documentation
- `docs/index/functions/generateUUID.md` - Function documentation
- `docs/index/functions/generateRandomUUID.md` - Function documentation

### 3. Tests
**File**: `test/unit/GenerateUUID.test.ts`
- Unit tests for all UUID functions
- Tests for deterministic behavior, format validation, and error handling

## Client Usage

### Installation
```bash
npm install vwo-fme-node-sdk
```

### Import and Usage
```javascript
import { getUUID, generateUUID, getRandomUUID } from 'vwo-fme-node-sdk';

// Generate deterministic UUID for user
const userId = 'user123';
const accountId = 'account456';
const userUuid = getUUID(userId, accountId);
console.log(userUuid); // "C94974FF5921522392A4CF6A86B12B0C"

// Same function, different name
const userUuid2 = generateUUID(userId, accountId); // Same result

// Generate random UUID
const randomUuid = getRandomUUID('your-sdk-key');
console.log(randomUuid); // "550e8400-e29b-41d4-a716-446655440000"
```

### Key Benefits
1. **No Client Initialization Required** - Functions work standalone
2. **Same Level as getFlag/trackEvent** - Available from main SDK import
3. **Multiple Function Names** - Both `getUUID` and `generateUUID` available
4. **Type Safe** - Full TypeScript support
5. **Well Documented** - Complete JSDoc and markdown documentation

## Available Functions

### `getUUID(userId, accountId)`
- **Purpose**: Generates deterministic UUID for a user
- **Parameters**: 
  - `userId` (string): User's ID
  - `accountId` (string): Account ID
- **Returns**: UUID string (32 chars, uppercase, no dashes)
- **Example**: `getUUID('user123', 'account456')` → `"C94974FF5921522392A4CF6A86B12B0C"`

### `generateUUID(userId, accountId)`
- **Purpose**: Alias for `getUUID` - same functionality
- **Parameters**: Same as `getUUID`
- **Returns**: Same as `getUUID`

### `getRandomUUID(sdkKey)`
- **Purpose**: Generates random UUID based on SDK key
- **Parameters**: 
  - `sdkKey` (string): SDK key for namespace generation
- **Returns**: Standard UUID string with dashes
- **Example**: `getRandomUUID('sdk-key')` → `"550e8400-e29b-41d4-a716-446655440000"`

## Testing

### Local Testing
```bash
# In your test project
npm install vwo-fme-node-sdk
```

```javascript
const { getUUID, generateUUID, getRandomUUID } = require('vwo-fme-node-sdk');

// Test the functions
console.log(getUUID('test-user', 'test-account'));
console.log(generateUUID('test-user', 'test-account')); // Same result
console.log(getRandomUUID('test-sdk-key'));
```

### Unit Tests
```bash
npm test -- --testPathPattern=GenerateUUID.test.ts
```

## Production Deployment Steps

1. **Review Changes**: Ensure all changes are approved
2. **Run Tests**: Execute unit tests to verify functionality
3. **Build Package**: Run build process to generate distribution files
4. **Version Bump**: Update version number in package.json
5. **Publish**: Publish to npm registry
6. **Documentation**: Update main README with new functions

## Files Modified/Created

### Modified Files
- `lib/index.ts` - Added UUID function exports

### Created Files
- `docs/api/GenerateUUID/README.md`
- `docs/index/functions/generateUUID.md`
- `docs/index/functions/generateRandomUUID.md`
- `test/unit/GenerateUUID.test.ts`

### No Breaking Changes
- All existing functionality remains unchanged
- New functions are additive only
- Backward compatibility maintained

## Rollback Plan
If issues arise, simply remove the UUID function exports from `lib/index.ts` and delete the created documentation files.

## Support
For any questions or issues, refer to the comprehensive documentation in the `docs/` folder or contact the development team.
