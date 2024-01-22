import { v4 as uuidv4 } from 'uuid';
import { v5 as uuidv5 } from 'uuid';

// import { Constants } from '../constants';

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
