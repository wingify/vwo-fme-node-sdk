/**
 * Constructs a message by replacing placeholders in a template with corresponding values from a data object.
 *
 * @param {string} template - The message template containing placeholders in the format `{key}`.
 * @param {Record<string, any>} data - An object containing keys and values used to replace the placeholders in the template.
 * @returns {string} The constructed message with all placeholders replaced by their corresponding values from the data object.
 */
export declare function buildMessage(template?: string, data?: Record<string, any>): string;
/**
 * Sends a log message to VWO.
 * @param {string} message - The message to log.
 * @param {string} messageType - The type of message to log.
 * @param {string} eventName - The name of the event to log.
 */
export declare function sendLogToVWO(message: string, messageType: string, extraData?: any): void;
