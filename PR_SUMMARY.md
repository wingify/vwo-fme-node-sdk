# Pull Request Summary: Add UUID Functions to Main SDK Export

## 🎯 Objective
Make UUID generation functions available at the same level as `getFlag()` and `trackEvent()` without requiring client initialization.

## 📋 Changes Summary

### Core Changes
- **Modified**: `lib/index.ts` - Added UUID function exports with documentation
- **Created**: 4 new documentation files
- **Created**: 1 new test file

### Files Changed
```
Modified: lib/index.ts
Created:  docs/api/GenerateUUID/README.md
Created:  docs/index/functions/generateUUID.md
Created:  docs/index/functions/generateRandomUUID.md
Created:  test/unit/GenerateUUID.test.ts
```

## 🚀 New Functionality

### Available Functions
1. **`getUUID(userId, accountId)`** - Deterministic user UUID (32 chars, uppercase, no dashes)
2. **`generateUUID(userId, accountId)`** - Alias for getUUID

### Usage Example
```javascript
import { getUUID, generateUUID } from 'vwo-fme-node-sdk';

// No client initialization required!
const userUuid = getUUID('user123', 'account456');
const userUuid2 = generateUUID('user123', 'account456'); // Same result
```

## ✅ Benefits
- **No Client Initialization Required** - Functions work standalone
- **Same Level as getFlag/trackEvent** - Available from main SDK import
- **Backward Compatible** - No breaking changes
- **Well Documented** - Complete JSDoc and markdown documentation
- **Fully Tested** - Unit tests included

## 🧪 Testing
- ✅ Local testing completed successfully
- ✅ Unit tests created and passing
- ✅ Functions work without client initialization
- ✅ Deterministic behavior verified
- ✅ Format validation confirmed

## 📚 Documentation
- Complete API documentation created
- Usage examples provided
- JSDoc comments added to all functions
- Markdown documentation in docs/ folder

## 🔄 No Breaking Changes
- All existing functionality remains unchanged
- New functions are additive only
- Existing imports continue to work

## 🎯 Ready for Review
This PR is ready for team review and can be merged after approval. All functionality has been tested locally and is working correctly.

## 📝 Next Steps
1. Team review and approval
2. Merge to main branch
3. Version bump and npm publish
4. Update main README with new functions
