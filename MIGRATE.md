# Migrate to the Wingify Node.js / JavaScript FME SDK

This guide explains how to adopt the **Wingify** public API on the Node.js and JavaScript (browser) FME SDK. Existing **VWO** integrations (`vwo-fme-node-sdk` / `vwo-fme-javascript-sdk`) continue to work without changes.

For installation, requirements, and advanced configuration (storage, logger, gateway, proxy, polling, and more), see [README.md](README.md).

---

## Overview

The FME SDK is published as **two npm package families** built from the **same codebase** at the same version:

| npm package                                                                              | Runtime                                    | Public types                            |
| ---------------------------------------------------------------------------------------- | ------------------------------------------ | --------------------------------------- |
| [`wingify-fme-node-sdk`](https://www.npmjs.com/package/wingify-fme-node-sdk)             | Node.js (CommonJS bundle)                  | `IWingifyOptions`, `IWingifyClient`, …  |
| [`wingify-fme-javascript-sdk`](https://www.npmjs.com/package/wingify-fme-javascript-sdk) | Browser (bundled script / `browser` field) | Same Wingify type names                 |
| [`vwo-fme-node-sdk`](https://www.npmjs.com/package/vwo-fme-node-sdk)                     | Node.js                                    | `IVWOOptions`, `IVWOClient`, … (legacy) |
| [`vwo-fme-javascript-sdk`](https://www.npmjs.com/package/vwo-fme-javascript-sdk)         | Browser                                    | Same VWO type names (legacy)            |

Pick **one** package family for your app — do **not** install both `vwo-fme-node-sdk` and `wingify-fme-node-sdk` in the same project.

New integrations should use the **Wingify** package and types. When you install and initialize through `wingify-fme-node-sdk` (or the Wingify browser bundle), the SDK uses Wingify edge/collect endpoints and Wingify-branded logging (see [Runtime behavior](#runtime-behavior-wingify-build) below).

---

## Wingify API — implementation guide

Use npm package `wingify-fme-node-sdk` for Node.js and `wingify-fme-javascript-sdk` for browser apps. Public types use the `IWingify*` prefix.

Legacy `IVWO*` types on `vwo-fme-node-sdk` remain supported; they are thin aliases over the same core implementation.

### Implementation steps

1. **Add the dependency** — use only the Wingify coordinate (same semver you use on VWO today):

   ```bash
   # Node.js
   npm install wingify-fme-node-sdk --save
   # or
   yarn add wingify-fme-node-sdk
   ```

   For browser-only installs that rely on the `browser` export of the Node package, you may instead depend on `wingify-fme-javascript-sdk` where your bundler or CDN setup expects that name. Use **one** Wingify package line in `package.json`, not both VWO and Wingify.

2. **Initialize** — call `init()` with `accountId` and `sdkKey`. Initialization is **async** and returns a client (`IWingifyClient`).

3. **Build user context** — pass a plain object with at least `id` (string). Optional: `customVariables`, `userAgent`, `ipAddress`, `bucketingSeed`, etc. See [README.md](README.md#user-context).

4. **Evaluate flags** — `await client.getFlag(featureKey, context)`. Result is a `Flag` with `isEnabled()`, `getVariable()`, `getVariables()`, `getVariation()`.

5. **Track and attribute** — `trackEvent`, `setAttribute`, and `setAlias` on the initialized client.

6. **Early access before settings finish (optional)** — `onInit()` resolves when the client is ready if you started `init()` earlier (same pattern as on the VWO package).

### Node.js (CommonJS)

```javascript
const { init } = require('wingify-fme-node-sdk');

(async () => {
  const client = await init({
    accountId: '123456',
    sdkKey: '32-alpha-numeric-sdk-key',
    logger: { level: 'DEBUG' },
  });

  const context = { id: 'unique_user_id', customVariables: { plan: 'pro' } };

  const flag = await client.getFlag('feature_key', context);

  if (flag.isEnabled()) {
    const variable = flag.getVariable('feature_variable', 'default-value');
    console.log('Variable:', variable);
  }

  await client.trackEvent('event_name', context, { cartValue: 10 });
  await client.setAttribute('attribute_key', 'attribute_value', context);
  await client.setAlias(context, 'alias_id');
})();
```

### Node.js / TypeScript (ESM)

```typescript
import { init, IWingifyOptions, IWingifyClient, Flag } from 'wingify-fme-node-sdk';

const options: IWingifyOptions = {
  accountId: '123456',
  sdkKey: '32-alpha-numeric-sdk-key',
};

const client: IWingifyClient = await init(options);

const context = { id: 'unique_user_id' };
const flag: Flag = await client.getFlag('feature_key', context);
const enabled: boolean = flag.isEnabled();
```

For ESM resolution, use the package `exports` map (`import` → `dist/esm/…`). Confirm your installed version documents the Wingify ESM entry if you import subpaths directly.

### Browser (bundled script)

After building or installing the Wingify browser artifact:

```html
<script src="path/to/wingify-fme-javascript-sdk.min.js"></script>
<script>
  (async () => {
    const client = await init({
      accountId: '123456',
      sdkKey: '32-alpha-numeric-sdk-key',
    });

    const context = { id: 'unique_user_id' };
    const flag = await client.getFlag('feature_key', context);
    console.log(flag.isEnabled());
  })();
</script>
```

When using a **corporate proxy** (`proxyUrl`), route settings traffic to edge and event/batch traffic to collect on your proxy, or use separate stable proxy endpoints. See [README.md](README.md) and your internal gateway docs.

---

## Public API mapping

| Legacy (VWO package)                                               | Wingify package                                           |
| ------------------------------------------------------------------ | --------------------------------------------------------- |
| `init`                                                             | `init`                                                    |
| `onInit`                                                           | `onInit`                                                  |
| `IVWOOptions`                                                      | `IWingifyOptions`                                         |
| `IVWOClient`                                                       | `IWingifyClient`                                          |
| `IVWOContextModel`                                                 | `IWingifyContextModel`                                    |
| `vwoBuilder` on options                                            | `wingifyBuilder` (preferred); `vwoBuilder` still accepted |
| `Flag`, `getUUID`, `LogLevelEnum`, `StorageConnector`              | Same export names                                         |
| `NetworkTransportModeEnum`, `IRetryConfig`, `ClientStorageOptions` | Same export names                                         |

### Wingify entry points

| Concern              | Type / export                                             |
| -------------------- | --------------------------------------------------------- |
| Initialize           | `init(options: IWingifyOptions): Promise<IWingifyClient>` |
| Deferred ready       | `onInit(): Promise<IWingifyClient>`                       |
| Init options         | `IWingifyOptions`                                         |
| Client               | `IWingifyClient`                                          |
| User context (typed) | `IWingifyContextModel` (runtime: plain object with `id`)  |
| Flag result          | `Flag`                                                    |
| Custom storage       | `StorageConnector` (`Connector`)                          |
| Custom network       | `options.network.client` (`NetworkClientInterface`)       |
| Advanced builder     | `wingifyBuilder` / `WingifyBuilder`                       |

`IWingifyClient` supports the same operations as the legacy VWO client: `getFlag`, `trackEvent`, `setAttribute`, `setAlias`, `updateSettings`, `flushEvents`, and `shutdown`.

### Options that stay VWO-named (platform compatibility)

These names are unchanged on the Wingify package because the FME platform and existing integrations expect them:

| Option / field                                              | Notes                                                                   |
| ----------------------------------------------------------- | ----------------------------------------------------------------------- |
| `_vwo_meta`                                                 | Still supported; use for SDK metadata when needed                       |
| Context `_vwo` (browser)                                    | Still supported for UA / device hints                                   |
| Event / payload keys (e.g. `_vwo_meta` in network payloads) | Unchanged for server compatibility                                      |
| `vwoBuilder`                                                | Alias of `wingifyBuilder` on init options                               |
| Local storage key                                           | `vwo_fme_settings` for both brands (existing apps keep cached settings) |

For advanced examples in [README.md](README.md) that use `IVWOOptions` or `IVWOClient`, substitute the Wingify types from the table above — behavior is the same.

---

## Legacy VWO API

The following remain available for existing apps on **`vwo-fme-node-sdk`** / **`vwo-fme-javascript-sdk`**:

- `init`, `onInit`
- `IVWOOptions`, `IVWOClient`, `IVWOContextModel`
- `vwoBuilder`, `Flag`, storage and logger hooks
- VWO build-time hosts and `VWO-SDK` log prefix

No breaking change is required to stay on the VWO package. You can migrate imports and package name at your own pace.

---

## Runtime behavior (Wingify build)

When you install and run the **Wingify** npm build (not `vwo-fme-node-sdk`), you may notice:

| Area                          | Wingify build                                         | VWO build (legacy package)                    |
| ----------------------------- | ----------------------------------------------------- | --------------------------------------------- |
| Settings / pull / location    | `edge.wingify.net`                                    | `dev.visualwebsiteoptimizer.com`              |
| Events / batch                | `collect.wingify.net`                                 | Same host as settings (single host)           |
| Log prefix                    | `Wingify-SDK`                                         | `VWO-SDK`                                     |
| Log message branding          | Wingify where templated                               | VWO                                           |
| npm `name` in bundle metadata | `wingify-fme-node-sdk` / `wingify-fme-javascript-sdk` | `vwo-fme-node-sdk` / `vwo-fme-javascript-sdk` |

With **`proxyUrl`**, all requests go to your proxy host; your proxy must forward to the correct upstream (edge vs collect for Wingify). Without `proxyUrl`, the SDK selects hosts automatically per build brand.

Event and API payload field names (for example `_vwo_meta`, `vwo_*` event names) are **unchanged** for compatibility with the FME platform.

---

## Migrating from `vwo-fme-node-sdk` to `wingify-fme-node-sdk`

1. In `package.json`, replace the dependency:

   ```diff
   - "vwo-fme-node-sdk": "^1.43.0"
   + "wingify-fme-node-sdk": "^1.44.0"
   ```

   Use the same semver line you would have used for VWO. Remove the VWO package so only one SDK is installed.

2. Update imports:

   ```diff
   - const { init } = require('vwo-fme-node-sdk');
   + const { init } = require('wingify-fme-node-sdk');
   ```

   ```diff
   - import { init, IVWOClient, IVWOOptions } from 'vwo-fme-node-sdk';
   + import { init, IWingifyClient, IWingifyOptions } from 'wingify-fme-node-sdk';
   ```

3. Rename TypeScript types: `IVWOOptions` → `IWingifyOptions`, `IVWOClient` → `IWingifyClient`, `IVWOContextModel` → `IWingifyContextModel`.

4. If you pass a custom builder, prefer `wingifyBuilder` instead of `vwoBuilder` (either still works).

5. Reinstall, rebuild your app, and run your existing tests — flag evaluation, tracking, and attributes behave the same; only package name, exported type names, default hosts, and log branding change.

### Browser apps

Repeat the same steps with `vwo-fme-javascript-sdk` → `wingify-fme-javascript-sdk` (or switch the `browser` resolution to the Wingify bundle, depending on how you load the SDK).

### What you do **not** need to change

- `accountId`, `sdkKey`, feature keys, event names
- User context shape (`{ id: '...' }` and optional fields)
- Method signatures on the client (`getFlag`, `trackEvent`, etc.)
- Server-side campaign / settings JSON
- `_vwo` / `_vwo_meta` in context or payloads when you already send them

---

## Architecture note

The Wingify and VWO packages share one implementation (`Wingify` core). The VWO package entry re-exports `init` / `onInit` with `IVWO*` type aliases. The Wingify package exports the same functions with `IWingify*` names. Brand-specific hosts and logging are selected at **build time** (`vwo` vs `wingify`).

---

## Related documents

| Document                     | Content                                                             |
| ---------------------------- | ------------------------------------------------------------------- |
| [README.md](README.md)       | Installation, requirements, configuration, gateway, storage, logger |
| [CHANGELOG.md](CHANGELOG.md) | Version history and rebranding notes                                |
