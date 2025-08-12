/**
 * Copyright 2024-2025 Wingify Software Pvt. Ltd.
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

const fs = require('fs');
const path = require('path');

// Get the root directory of the project (parent of scripts directory)
const projectRoot = path.resolve(__dirname, '..');

// Read package.json
const packageJsonPath = path.join(projectRoot, 'package.json');
const versionFilePath = path.join(projectRoot, 'VERSION.json');

try {
  // Read and parse package.json
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(packageJsonContent);

  // Extract version
  const version = packageJson.version;

  if (!version) {
    console.error('Error: No version found in package.json');
    process.exit(1);
  }

  // Write version to VERSION file
  fs.writeFileSync(versionFilePath, JSON.stringify({ version }));

  console.log(`\n✅ Successfully wrote version ${version} to VERSION.json file\n`);
} catch (error) {
  console.error('\n\nError generating SDK version:', error.message, '. Please check scripts/generate-sdk-version.js file.\n\n');
  process.exit(1);
}
