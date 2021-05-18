"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getName = exports.defineType = exports.defineFunction = exports.defineTable = exports.createSchemas = void 0;
const path_1 = __importDefault(require("path"));
var schemas_1 = require("./schemas");
Object.defineProperty(exports, "createSchemas", { enumerable: true, get: function () { return schemas_1.createSchemas; } });
var tables_1 = require("./tables");
Object.defineProperty(exports, "defineTable", { enumerable: true, get: function () { return tables_1.defineTable; } });
var functions_1 = require("./functions");
Object.defineProperty(exports, "defineFunction", { enumerable: true, get: function () { return functions_1.defineFunction; } });
var types_1 = require("./types");
Object.defineProperty(exports, "defineType", { enumerable: true, get: function () { return types_1.defineType; } });
const getName = (baseName) => {
    //
    const dir = path_1.default.basename(baseName);
    const file = path_1.default.basename(baseName).replace(/(\.js|\.ts)/g, '');
    const schema = path_1.default.basename(baseName.replace(`/table/${dir}`, ''));
    return {
        dir,
        file,
        schema,
    };
};
exports.getName = getName;
