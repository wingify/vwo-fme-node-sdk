/**
 * Copyright 2019-2020 Wingify Software Pvt. Ltd.
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

import { isNull, isUndefined, isFunction } from '../utils/DataTypeUtil';

const nargs = /\{([0-9a-zA-Z_]+)\}/g;

export function buildMessage(template: string, data: Record<string, any>): string {
  try {
    return template.replace(nargs, (match, key, index) => {
      let result;
      let isKey;

      if (template[index - 1] === '{' && template[index + match.length] === '}') {
        return key;
      } else {
        isKey = Object.prototype.hasOwnProperty.call(data, key);

        if (isKey) {
          let value = data[key];

          if (isFunction(value)) {
            value = data[key]();
          }
          result = value;
        } else {
          result = null;
        }
        if (isNull(result) || isUndefined(result)) {
          return '';
        }

        return result;
      }
    });
  } catch (err) {
    return template;
  }
}
