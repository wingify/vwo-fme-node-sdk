[**vwo-fme-node-sdk**](../../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../../modules.md) / [packages/logger/LogMessageBuilder](../README.md) / LogMessageBuilder

# Class: LogMessageBuilder

Implements the ILogMessageBuilder interface to provide a concrete log message builder.

## Implements

- `ILogMessageBuilder`

## Constructors

### new LogMessageBuilder()

> **new LogMessageBuilder**(`loggerConfig`, `transportConfig`): [`LogMessageBuilder`](LogMessageBuilder.md)

Constructs a new LogMessageBuilder instance.

#### Parameters

• **loggerConfig**: `Record`\<`string`, `any`\>

Configuration for the logger.

• **transportConfig**: `Record`\<`string`, `any`\>

Configuration for the transport mechanism.

#### Returns

[`LogMessageBuilder`](LogMessageBuilder.md)

#### Source

packages/logger/LogMessageBuilder.ts:57

## Properties

### dateTimeFormat

> **dateTimeFormat**: `any`

#### Implementation of

`ILogMessageBuilder.dateTimeFormat`

#### Source

packages/logger/LogMessageBuilder.ts:50

---

### loggerConfig

> **loggerConfig**: `Record`\<`string`, `any`\>

#### Implementation of

`ILogMessageBuilder.loggerConfig`

#### Source

packages/logger/LogMessageBuilder.ts:47

---

### prefix

> **prefix**: `string`

#### Implementation of

`ILogMessageBuilder.prefix`

#### Source

packages/logger/LogMessageBuilder.ts:49

---

### transportConfig

> **transportConfig**: `Record`\<`string`, `any`\>

#### Implementation of

`ILogMessageBuilder.transportConfig`

#### Source

packages/logger/LogMessageBuilder.ts:48

## Methods

### formatMessage()

> **formatMessage**(`level`, `message`): `string`

Formats a log message combining level, prefix, date/time, and the actual message.

#### Parameters

• **level**: `string`

The log level.

• **message**: `string`

The message to log.

#### Returns

`string`

The formatted log message.

#### Implementation of

`ILogMessageBuilder.formatMessage`

#### Source

packages/logger/LogMessageBuilder.ts:73

---

### getFormattedDateTime()

> **getFormattedDateTime**(): `string`

Retrieves the current date and time formatted according to the specified format.

#### Returns

`string`

The formatted date and time.

#### Implementation of

`ILogMessageBuilder.getFormattedDateTime`

#### Source

packages/logger/LogMessageBuilder.ts:119

---

### getFormattedLevel()

> **getFormattedLevel**(`level`): `string`

Returns the formatted log level with appropriate coloring based on the log level.

#### Parameters

• **level**: `string`

The log level.

#### Returns

`string`

The formatted log level.

#### Implementation of

`ILogMessageBuilder.getFormattedLevel`

#### Source

packages/logger/LogMessageBuilder.ts:90

---

### getFormattedPrefix()

> **getFormattedPrefix**(`prefix`): `string`

#### Parameters

• **prefix**: `string`

#### Returns

`string`

#### Source

packages/logger/LogMessageBuilder.ts:77
