/**
 * Copyright 2024 Wingify Software Pvt. Ltd.
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
import { v4 as uuidv4 } from 'uuid';
import { v5 as uuidv5 } from 'uuid';

/**
 * Generates a random UUID based on an API key.
 * @param apiKey The API key used to generate a namespace for the UUID.
 * @returns A random UUID string.
 */
export function getRandomUUID(apiKey: string): string {
  // Generate a namespace based on the API key using DNS namespace
  const namespace = uuidv5(apiKey, uuidv5.DNS);
  // Generate a random UUID using the namespace derived from the API key
  const randomUUID = uuidv5(uuidv4(), namespace);

  return randomUUID;
}

/**
 * Generates a UUID for a user based on their userId and accountId.
 * @param userId The user's ID.
 * @param accountId The account ID associated with the user.
 * @returns A UUID string formatted without dashes and in uppercase.
 */
export function getUUID(userId: string, accountId: string): string {
  const VWO_NAMESPACE = uuidv5('https://vwo.com', uuidv5.URL);
  // Convert userId and accountId to string to ensure proper type
  userId = String(userId);
  accountId = String(accountId);
  // Generate a namespace UUID based on the accountId
  const userIdNamespace = generateUUID(accountId, VWO_NAMESPACE);
  // Generate a UUID based on the userId and the previously generated namespace
  const uuidForUserIdAccountId = generateUUID(userId, userIdNamespace);

  // Remove all dashes from the UUID and convert it to uppercase
  const desiredUuid = uuidForUserIdAccountId?.replace(/-/gi, '').toUpperCase();

  return desiredUuid;
}

/**
 * Helper function to generate a UUID v5 based on a name and a namespace.
 * @param name The name from which to generate the UUID.
 * @param namespace The namespace used to generate the UUID.
 * @returns A UUID string or undefined if inputs are invalid.
 */
export function generateUUID(name: string, namespace: string) {
  // Check for valid input to prevent errors
  if (!name || !namespace) {
    return;
  }

  // Generate and return the UUID v5
  return uuidv5(name, namespace);
}
