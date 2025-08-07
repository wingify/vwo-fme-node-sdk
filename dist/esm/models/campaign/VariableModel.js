"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableModel = void 0;
class VariableModel {
    constructor(id, type, key, value) {
        this.value = value;
        this.type = type;
        this.key = key;
        this.id = id;
    }
    static modelFromDictionary(variable) {
        return new VariableModel(variable.i ?? variable.id, variable.type, variable.k ?? variable.key, variable.val ?? variable.value);
    }
    setValue(value) {
        this.value = value;
    }
    setKey(key) {
        this.key = key;
    }
    setType(type) {
        this.type = type;
    }
    getId() {
        return this.id;
    }
    getValue() {
        return this.value;
    }
    getType() {
        return this.type;
    }
    getKey() {
        return this.key;
    }
}
exports.VariableModel = VariableModel;
//# sourceMappingURL=VariableModel.js.map