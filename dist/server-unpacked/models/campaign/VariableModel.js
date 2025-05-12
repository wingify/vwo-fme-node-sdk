"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableModel = void 0;
var VariableModel = /** @class */ (function () {
    function VariableModel(id, type, key, value) {
        this.value = value;
        this.type = type;
        this.key = key;
        this.id = id;
    }
    VariableModel.modelFromDictionary = function (variable) {
        var _a, _b, _c;
        return new VariableModel((_a = variable.i) !== null && _a !== void 0 ? _a : variable.id, variable.type, (_b = variable.k) !== null && _b !== void 0 ? _b : variable.key, (_c = variable.val) !== null && _c !== void 0 ? _c : variable.value);
    };
    VariableModel.prototype.setValue = function (value) {
        this.value = value;
    };
    VariableModel.prototype.setKey = function (key) {
        this.key = key;
    };
    VariableModel.prototype.setType = function (type) {
        this.type = type;
    };
    VariableModel.prototype.getId = function () {
        return this.id;
    };
    VariableModel.prototype.getValue = function () {
        return this.value;
    };
    VariableModel.prototype.getType = function () {
        return this.type;
    };
    VariableModel.prototype.getKey = function () {
        return this.key;
    };
    return VariableModel;
}());
exports.VariableModel = VariableModel;
//# sourceMappingURL=VariableModel.js.map