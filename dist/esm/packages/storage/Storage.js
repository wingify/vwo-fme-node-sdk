"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
// TODO: move to file
// enum ConnectorEnum {
//   MEMORY = 'memory',
//   REDIS = 'redis'
// }
class Storage {
    // public storageType: dynamic;
    attachConnector(connector) {
        if (connector?.prototype?.constructor?.toString()?.trim()?.substring(0, 5) === 'class') {
            this.connector = new connector();
        }
        else {
            this.connector = connector;
        }
        return this.connector;
    }
    static get Instance() {
        this.instance = this.instance || new Storage();
        return this.instance;
    }
    getConnector() {
        return this.connector;
    }
}
exports.Storage = Storage;
//# sourceMappingURL=Storage.js.map