"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableModel = void 0;
var VariableModel = /** @class */ (function () {
    function VariableModel() {
    }
    VariableModel.prototype.modelFromDictionary = function (variable) {
        this.value = variable.val || variable.value;
        this.type = variable.type;
        this.key = variable.k || variable.key;
        this.id = variable.i || variable.id;
        return this;
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