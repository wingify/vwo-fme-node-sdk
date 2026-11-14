"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceContainerRegistry = void 0;
var registeredServiceContainers = new Set();
/**
 * Tracks every initialized SDK client so consent withdrawal can clear storage on all of them.
 */
exports.ServiceContainerRegistry = {
    /**
     * Adds a client container when init completes.
     *
     * @param serviceContainer - Container for one initialized client instance.
     * @returns {void}
     */
    register: function (serviceContainer) {
        // Consent withdrawal later walks every live client, so init must record this one.
        registeredServiceContainers.add(serviceContainer);
    },
    /**
     * Removes a client container when shutdown completes.
     *
     * @param serviceContainer - Container that is shutting down.
     * @returns {void}
     */
    unregister: function (serviceContainer) {
        // A shut-down client must not receive later storage deletes.
        registeredServiceContainers.delete(serviceContainer);
    },
    /**
     * Returns all live client containers in this process.
     *
     * @returns {ServiceContainer[]} Array of registered service containers.
     */
    getAll: function () {
        // Copy the set so callers cannot mutate the registry by editing the array.
        return Array.from(registeredServiceContainers);
    },
    /**
     * Clears the registry. Used by tests only.
     *
     * @returns {void}
     */
    clearForTests: function () {
        // Tests share one process, so leftover clients would leak into the next case.
        registeredServiceContainers.clear();
    },
};
//# sourceMappingURL=ServiceContainerRegistry.js.map