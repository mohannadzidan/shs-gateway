"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const API_1 = __importDefault(require("../API"));
class Testing extends API_1.default {
    constructor(app) {
        super("Testing", app);
        this.app = app;
    }
    initialize() {
        throw new Error("Method not implemented.");
    }
}
exports.default = Testing;
//# sourceMappingURL=testing.api.js.map