import { ServiceContainer } from '../services/ServiceContainer';
/**
 * Returns true when the user has explicitly denied consent.
 *
 * @param context - User context object from a public API call.
 * @returns {boolean} True when hasConsented is false.
 */
export declare function isConsentDenied(context?: Record<string, any>): boolean;
/**
 * When consent is denied, logs, optionally wipes stored decisions, and signals that the user API should not run.
 * Wipe runs on every denied call when context.id is set (connectors should treat remove as idempotent).
 *
 * @param context - User context object from a public API call.
 * @param apiName - Name of the API that would be skipped.
 * @param serviceContainer - Container used for logging.
 * @returns {boolean} True when the caller should no-op for this user.
 */
export declare function shouldSkipUserApiDueToConsent(
  context: Record<string, any> | undefined,
  apiName: string,
  serviceContainer: ServiceContainer,
): boolean;
