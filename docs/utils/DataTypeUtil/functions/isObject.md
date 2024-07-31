[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [utils/DataTypeUtil](../README.md) / isObject

# Function: isObject()

> **isObject**\<`T`\>(`val`): val is Record\<any, dynamic\> & Exclude\<T, RegExp \| Date \| dynamic\[\] \| FunctionType \| Promise\<dynamic\>\>

Checks if a value is an object excluding arrays, functions, regexes, promises, and dates.

## Type parameters

• **T**

## Parameters

• **val**: `T`

The value to check.

## Returns

val is Record\<any, dynamic\> & Exclude\<T, RegExp \| Date \| dynamic\[\] \| FunctionType \| Promise\<dynamic\>\>

True if the value is an object, false otherwise.

## Source

utils/DataTypeUtil.ts:25
