"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgType = exports.getName = exports.useNames = exports.defineType = exports.defineFunction = exports.defineTable = exports.createMigration = void 0;
const path_1 = require("path");
var schemas_1 = require("./schemas/index");
Object.defineProperty(exports, "createMigration", { enumerable: true, get: function () { return schemas_1.createMigration; } });
var tables_1 = require("./tables/index");
Object.defineProperty(exports, "defineTable", { enumerable: true, get: function () { return tables_1.defineTable; } });
var functions_1 = require("./functions");
Object.defineProperty(exports, "defineFunction", { enumerable: true, get: function () { return functions_1.defineFunction; } });
var types_1 = require("./types");
Object.defineProperty(exports, "defineType", { enumerable: true, get: function () { return types_1.defineType; } });
const useNames = (dirname) => {
    return {
        folder: path_1.basename(dirname),
    };
};
exports.useNames = useNames;
// export const schema
const getName = (baseName) => {
    //
    const dir = path_1.basename(baseName);
    const file = path_1.basename(baseName).replace(/(\.js|\.ts)/g, '');
    const schema = path_1.basename(baseName.replace(`/table/${dir}`, ''));
    return {
        dir,
        file,
        schema,
    };
};
exports.getName = getName;
var node_pg_migrate_1 = require("node-pg-migrate");
Object.defineProperty(exports, "PgType", { enumerable: true, get: function () { return node_pg_migrate_1.PgType; } });
