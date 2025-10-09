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
/**
 * Utility class for handling alias operations through network calls to gateway
 */
export declare class AliasingUtil {
    private static readonly KEY_USER_ID;
    private static readonly KEY_ALIAS_ID;
    private static readonly GET_ALIAS_URL;
    private static readonly SET_ALIAS_URL;
    /**
     * Retrieves alias for a given user ID
     * @param userId - The user identifier
     * @returns Promise<any | null> - The response from the gateway
     */
    static getAlias(userId: string): Promise<any | null>;
    /**
     * Sets alias for a given user ID
     * @param userId - The user identifier
     * @param aliasId - The alias identifier to set
     * @returns Promise<ResponseModel | null> - The response from the gateway
     */
    static setAlias(userId: string, aliasId: string): Promise<any | null>;
}
