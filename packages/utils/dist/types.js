"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineType = void 0;
const defineType = (options) => {
    //
    const state = {
        name: options.name,
        schema: 'public',
    };
    const name = Array.isArray(options.type)
        ? `enum_${options.name}`
        : options.name;
    return {
        $up: (pgm) => {
            //
            pgm.createType({ name: name, schema: state.schema }, options.type);
        },
        $down: (pgm) => {
            pgm.dropType({ name: name, schema: state.schema }, options.dropOptions);
        },
        schema: (schemaName) => {
            state.schema = schemaName;
        },
        _name: name,
    };
};
exports.defineType = defineType;
