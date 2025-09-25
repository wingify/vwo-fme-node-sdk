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

import { AliasingUtil } from './AliasingUtil';
import { SettingsService } from '../services/SettingsService';
import { ErrorLogMessagesEnum, InfoLogMessagesEnum } from '../enums/log-messages';
import { LogManager } from '../packages/logger';
import { buildMessage } from './LogMessageUtil';

export async function getUserId(userId: string, isAliasingEnabled: boolean): Promise<string> {
  if (isAliasingEnabled) {
    if (SettingsService.Instance.isGatewayServiceProvided) {
      // lets call getAlias here and return the alias id
      const alias = await AliasingUtil.getAlias(userId);
      // Backend returns array of results, find the matching one
      const result = alias.find((item) => item.aliasId === userId);
      LogManager.Instance.info(buildMessage(InfoLogMessagesEnum.ALIAS_ENABLED, { userId: result?.userId }));
      return result?.userId || userId;
    } else {
      LogManager.Instance.error(buildMessage(ErrorLogMessagesEnum.GATEWAY_URL_ERROR));
      return userId;
    }
  } else {
    return userId;
  }
}
