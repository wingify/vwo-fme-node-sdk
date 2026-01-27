/**
 * Copyright 2024-2026 Wingify Software Pvt. Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Post-process the compiled ESM output so that Node's native ESM loader
 * can resolve all internal imports without needing a bundler.
 *
 * 1. Append `.js` (or `/index.js`) to every relative import path.
 * 2. Handle both static and dynamic imports.
 *
 * Keeping this as a build step lets us keep TypeScript sources unchanged
 * while publishing spec-compliant output in `dist/esm`.
 */

const fs = require('fs');
const path = require('path');

const ESM_DIR = path.join(__dirname, '../dist/esm');

function isDirectoryWithIndex(importPath, currentFileDir) {
  const resolvedPath = path.resolve(currentFileDir, importPath);
  if (!fs.existsSync(resolvedPath)) {
    return false;
  }

  const stats = fs.statSync(resolvedPath);
  if (!stats.isDirectory()) {
    return false;
  }

  return fs.existsSync(path.join(resolvedPath, 'index.js'));
}

function appendExtension(importPath, currentFileDir) {
  if (importPath.endsWith('/')) {
    return importPath;
  }

  if (/\.\w+$/.test(importPath)) {
    return importPath;
  }

  if (isDirectoryWithIndex(importPath, currentFileDir)) {
    return `${importPath}/index.js`;
  }

  return `${importPath}.js`;
}

function addJsExtensions(dir) {
  const entries = fs.readdirSync(dir);

  entries.forEach((entry) => {
    const entryPath = path.join(dir, entry);
    const stats = fs.statSync(entryPath);

    if (stats.isDirectory()) {
      addJsExtensions(entryPath);
      return;
    }

    if (!entry.endsWith('.js')) {
      return;
    }

    let content = fs.readFileSync(entryPath, 'utf8');
    let modified = false;
    const currentFileDir = path.dirname(entryPath);

    // Static imports / exports
    const importRegex = /((?:import|export)\s+[^'"]*\sfrom\s+)(['"])(\.\.?\/[^'"]+)\2/g;
    content = content.replace(importRegex, (match, prefix, quote, importPath) => {
      // Skip JSON imports - they should not be in the codebase anymore
      if (importPath.endsWith('.json')) {
        return match;
      }

      const updatedPath = appendExtension(importPath, currentFileDir);
      if (updatedPath === importPath) {
        return match;
      }

      modified = true;
      return `${prefix}${quote}${updatedPath}${quote}`;
    });

    // Bare import specifiers: import './foo'
    const bareImportRegex = /(import\s+)(['"])(\.\.?\/[^'"]+)\2\s*;/g;
    content = content.replace(bareImportRegex, (match, prefix, quote, importPath) => {
      // Skip JSON imports
      if (importPath.endsWith('.json')) {
        return match;
      }

      const updatedPath = appendExtension(importPath, currentFileDir);
      if (updatedPath === importPath) {
        return match;
      }

      modified = true;
      return `${prefix}${quote}${updatedPath}${quote};`;
    });

    // Dynamic imports
    const dynamicImportRegex = /(import\s*\(\s*)(['"])(\.\.?\/[^'"]+)\2(\s*\))/g;
    content = content.replace(dynamicImportRegex, (match, prefix, quote, importPath, suffix) => {
      // Skip JSON imports
      if (importPath.endsWith('.json')) {
        return match;
      }

      const updatedPath = appendExtension(importPath, currentFileDir);
      if (updatedPath === importPath) {
        return match;
      }

      modified = true;
      return `${prefix}${quote}${updatedPath}${quote}${suffix}`;
    });

    if (modified) {
      fs.writeFileSync(entryPath, content, 'utf8');
      console.log(`Updated imports in ${path.relative(ESM_DIR, entryPath)}`);
    }
  });
}

if (!fs.existsSync(ESM_DIR)) {
  console.error(`ESM directory not found: ${ESM_DIR}`);
  process.exit(1);
}

console.log('Ensuring ESM imports include file extensions…');
addJsExtensions(ESM_DIR);
console.log('Done updating ESM imports.');
