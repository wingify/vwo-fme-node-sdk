/**
 * Generates a random UUID based on an API key.
 * @param sdkKey The API key used to generate a namespace for the UUID.
 * @returns A random UUID string.
 */
export declare function getRandomUUID(sdkKey: string): string;
/**
 * Generates a UUID for a user based on their userId and accountId.
 * @param userId The user's ID.
 * @param accountId The account ID associated with the user.
 * @returns A UUID string formatted without dashes and in uppercase.
 */
export declare function getUUID(userId: string, accountId: string): string;
/**
 * Helper function to generate a UUID v5 based on a name and a namespace.
 * @param name The name from which to generate the UUID.
 * @param namespace The namespace used to generate the UUID.
 * @returns A UUID string or undefined if inputs are invalid.
 */
export declare function generateUUID(name: string, namespace: string): any;
