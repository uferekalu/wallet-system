"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomlyGeneratedString = void 0;
const randomstring_1 = __importDefault(require("randomstring"));
const randomlyGeneratedString = () => {
    const generatedTransactionReference = randomstring_1.default.generate({
        length: 10,
        charset: "alphanumeric",
        capitalization: "uppercase",
    });
    return generatedTransactionReference;
};
exports.randomlyGeneratedString = randomlyGeneratedString;
