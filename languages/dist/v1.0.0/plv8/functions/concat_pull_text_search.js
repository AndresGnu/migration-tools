"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const migration_plv8_1 = require("@redware/migration-plv8");
const fs_1 = __importDefault(require("fs"));
console.log(__filename);
const run = ({ ARGS }) => {
    const { texts } = ARGS;
    //@INIT
    const l = texts.map((v) => {
        const n = Number(v);
        return !!n ? `${n} ${v}` : v;
    });
    const text = l.join(' ').toLowerCase();
    return text;
    //@END
};
const t = fs_1.default.readFileSync(__filename, 'utf8');
console.log(t);
exports.default = Object.assign({ run }, migration_plv8_1.getDefinition(__filename));
