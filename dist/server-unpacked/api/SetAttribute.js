"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetAttributeApi = void 0;
var EventEnum_1 = require("../enums/EventEnum");
var NetworkUtil_1 = require("../utils/NetworkUtil");
var SetAttributeApi = /** @class */ (function () {
    function SetAttributeApi() {
    }
    /**
     * Implementation of setAttribute to create an impression for a user attribute.
     * @param settings Configuration settings.
     * @param attributeKey The key of the attribute to set.
     * @param attributeValue The value of the attribute.
     * @param context Context containing user information.
     */
    SetAttributeApi.prototype.setAttribute = function (settings, attributeKey, attributeValue, context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(0, NetworkUtil_1.getShouldWaitForTrackingCalls)()) return [3 /*break*/, 2];
                        return [4 /*yield*/, createImpressionForAttribute(settings, attributeKey, attributeValue, context)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        createImpressionForAttribute(settings, attributeKey, attributeValue, context);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return SetAttributeApi;
}());
exports.SetAttributeApi = SetAttributeApi;
/**
 * Creates an impression for a user attribute and sends it to the server.
 * @param settings Configuration settings.
 * @param attributeKey The key of the attribute.
 * @param attributeValue The value of the attribute.
 * @param user User details.
 */
var createImpressionForAttribute = function (settings, attributeKey, attributeValue, context) { return __awaiter(void 0, void 0, void 0, function () {
    var properties, payload;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                properties = (0, NetworkUtil_1.getEventsBaseProperties)(settings, EventEnum_1.EventEnum.VWO_SYNC_VISITOR_PROP, encodeURIComponent(context.getUserAgent()), context.getIpAddress());
                payload = (0, NetworkUtil_1.getAttributePayloadData)(settings, context.getId(), EventEnum_1.EventEnum.VWO_SYNC_VISITOR_PROP, attributeKey, attributeValue, context.getUserAgent(), context.getIpAddress());
                // Send the constructed payload via POST request
                return [4 /*yield*/, (0, NetworkUtil_1.sendPostApiRequest)(properties, payload)];
            case 1:
                // Send the constructed payload via POST request
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=SetAttribute.js.map