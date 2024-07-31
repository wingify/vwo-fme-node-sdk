[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [utils/LogMessageUtil](../README.md) / buildMessage

# Function: buildMessage()

> **buildMessage**(`template`, `data`): `string`

Constructs a message by replacing placeholders in a template with corresponding values from a data object.

## Parameters

• **template**: `string`

The message template containing placeholders in the format `{key}`.

• **data**: `Record`\<`string`, `any`\>= `{}`

An object containing keys and values used to replace the placeholders in the template.

## Returns

`string`

The constructed message with all placeholders replaced by their corresponding values from the data object.

## Source

utils/LogMessageUtil.ts:27
