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

const VWO_NAMESPACE = uuidv5('https://vwo.com', uuidv5.URL);

export function getRandomUUID(apiKey: string): string {
  const namespace = uuidv5(apiKey, uuidv5.DNS);
  const randomUUID = uuidv5(uuidv4(), namespace);

  return randomUUID;
}

export function getUUID(userId: string, accountId: string): string {
  // type case userId to string
  userId = String(userId);
  accountId = String(accountId);
  const userIdNamespace = generateUUID(accountId, VWO_NAMESPACE);
  const uuidForUserIdAccountId = generateUUID(userId, userIdNamespace);

  const desiredUuid = uuidForUserIdAccountId.replace(/-/gi, '').toUpperCase();

  return desiredUuid;
}

function generateUUID(name: string, namespace: string) {
  if (!name || !namespace) {
    return;
  }

  return uuidv5(name, namespace);
}
