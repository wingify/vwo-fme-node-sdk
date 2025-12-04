/**
 * A class responsible for creating and modifying request models based on a global configuration.
 */
export class RequestHandler {
    /**
     * Creates a new request by merging properties from a base request and a configuration model.
     * If both the request URL and the base URL from the configuration are missing, it returns null.
     * Otherwise, it merges the properties from the configuration into the request if they are not already set.
     *
     * @param {RequestModel} request - The initial request model.
     * @param {GlobalRequestModel} config - The global request configuration model.
     * @returns {RequestModel} The merged request model or null if both URLs are missing.
     */
    createRequest(request, config) {
        // Check if both the request URL and the configuration base URL are missing
        if ((config.getBaseUrl() === null || config.getBaseUrl() === undefined) &&
            (request.getUrl() === null || request.getUrl() === undefined)) {
            return null; // Return null if no URL is specified
        }
        // Set the request URL, defaulting to the configuration base URL if not set
        request.setUrl(request.getUrl() || config.getBaseUrl());
        // Set the request timeout, defaulting to the configuration timeout if not set
        request.setTimeout(request.getTimeout() || config.getTimeout());
        // Set the request body, defaulting to the configuration body if not set
        request.setBody(request.getBody() || config.getBody());
        // Set the request headers, defaulting to the configuration headers if not set
        request.setHeaders(request.getHeaders() || config.getHeaders());
        // Initialize request query parameters, defaulting to an empty object if not set
        const requestQueryParams = request.getQuery() || {};
        // Initialize configuration query parameters, defaulting to an empty object if not set
        const configQueryParams = config.getQuery() || {};
        // Merge configuration query parameters into the request query parameters if they don't exist
        for (const queryKey in configQueryParams) {
            if (!Object.prototype.hasOwnProperty.call(requestQueryParams, queryKey)) {
                requestQueryParams[queryKey] = configQueryParams[queryKey];
            }
        }
        // Set the merged query parameters back to the request
        request.setQuery(requestQueryParams);
        return request; // Return the modified request
    }
}
//# sourceMappingURL=RequestHandler.js.map