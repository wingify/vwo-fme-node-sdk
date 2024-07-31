"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
// TODO: move to file
// enum ConnectorEnum {
//   MEMORY = 'memory',
//   REDIS = 'redis'
// }
var Storage = /** @class */ (function () {
    function Storage() {
    }
    // public storageType: dynamic;
    Storage.prototype.attachConnector = function (connector) {
        var _a, _b, _c, _d;
        if (((_d = (_c = (_b = (_a = connector === null || connector === void 0 ? void 0 : connector.prototype) === null || _a === void 0 ? void 0 : _a.constructor) === null || _b === void 0 ? void 0 : _b.toString()) === null || _c === void 0 ? void 0 : _c.trim()) === null || _d === void 0 ? void 0 : _d.substring(0, 5)) === 'class') {
            this.connector = new connector();
        }
        else {
            this.connector = connector;
        }
        return this.connector;
    };
    Object.defineProperty(Storage, "Instance", {
        get: function () {
            this.instance = this.instance || new Storage();
            return this.instance;
        },
        enumerable: false,
        configurable: true
    });
    Storage.prototype.getConnector = function () {
        return this.connector;
    };
    return Storage;
}());
exports.Storage = Storage;
//# sourceMappingURL=Storage.js.map