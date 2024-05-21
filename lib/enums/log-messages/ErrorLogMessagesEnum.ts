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
export enum ErrorLogMessagesEnum {
  // Logger is not yet initialized when these logs are logged
  INIT_OPTIONS_ERROR = `[ERROR]: VWO-SDK {date} Options should be of type object`,
  INIT_OPTIONS_SDK_KEY_ERROR = `[ERROR]: VWO-SDK {date} Please provide the sdkKey in the options and should be a of type string`,
  INIT_OPTIONS_ACCOUNT_ID_ERROR = `[ERROR]: VWO-SDK {date} Please provide VWO account ID in the options and should be a of type string|number`,

  INIT_OPTIONS_INVALID = `Invalid {key} passed in options. Should be of type: {correctType} and greater than equal to 1000`,

  SETTINGS_FETCH_ERROR = `Settings could not be fetched. Error: {err}`,
  SETTINGS_SCHEMA_INVALID = `Settings are not valid. Failed schema validation`,

  POLLING_FETCH_SETTINGS_FAILED = 'Error while fetching VWO settings with polling',

  API_THROW_ERROR = 'API - {apiName} failed to execute. Trace - {err}',
  API_INVALID_PARAM = `{key} passed to {apiName} API is not of valid type. Got type: {type}, should be: {correctType}`,
  API_SETTING_INVALID = `Settings are not valid. Contact VWO Support`,
  API_CONTEXT_INVALID = `Context should be an object and must contain a mandatory key - id, which is User ID`,

  FEATURE_NOT_FOUND = `Feature not found for the key {featureKey}`,
  EVENT_NOT_FOUND = `Event {eventName} not found in any of the features metrics`,

  STORED_DATA_ERROR = `Error in getting data from storage. Error: {err}`,

  GATEWAY_URL_ERROR = `Please provide a valid URL for VWO Gateway Service`,

  NETWORK_CALL_FAILED = `Error occurred while sending {method} request. Error: {err}`,
}
