// TODO: move to file
// enum ConnectorEnum {
//   MEMORY = 'memory',
//   REDIS = 'redis'
// }
export class Storage {
    // public storageType: dynamic;
    constructor(connector) {
        if (connector?.prototype?.constructor?.toString()?.trim()?.substring(0, 5) === 'class') {
            this.connector = new connector();
        }
        else {
            this.connector = connector;
        }
    }
    getConnector() {
        return this.connector;
    }
}
//# sourceMappingURL=Storage.js.map