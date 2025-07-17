"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ConductorSubLayout = () => {
    return (react_1.default.createElement("div", { className: "conductor-layout" },
        react_1.default.createElement("div", { className: "conductor-top" },
            react_1.default.createElement("div", { className: "conductor-header" }, "\u2220CONDUCTOR")),
        react_1.default.createElement("div", { className: "conductor-bottom" },
            react_1.default.createElement("div", { className: "conductor-output-header" }, "Generated Output"),
            react_1.default.createElement("div", { className: "conductor-output-body" }, "Generated content will appear here--"))));
};
exports.default = ConductorSubLayout;
