"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ConductorMainLayout = () => {
    return (react_1.default.createElement("div", { className: "conductor-layout" },
        react_1.default.createElement("div", { className: "conductor-left" },
            react_1.default.createElement("div", { className: "conductor-header" }, "\u2220CONDUCTOR"),
            react_1.default.createElement("div", { className: "conductor-body" },
                react_1.default.createElement("div", { className: "conductor-message" }, "assistant: Hello! Main Layout."),
                react_1.default.createElement("input", { className: "conductor-input", type: "text", placeholder: "Type message..." }))),
        react_1.default.createElement("div", { className: "conductor-right" },
            react_1.default.createElement("div", { className: "conductor-output-header" }, "Generated Output"),
            react_1.default.createElement("div", { className: "conductor-output-body" }, "Generated content will appear here--"))));
};
exports.default = ConductorMainLayout;
