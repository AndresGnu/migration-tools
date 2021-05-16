"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineType = void 0;
const defineType = (options) => {
    //
    const state = {
        name: options.name,
        schema: 'public',
    };
    return {
        $up: (pgm) => {
            //
            pgm.createType({ name: options.name, schema: state.schema }, options.type);
        },
        $down: (pgm) => {
            pgm.dropType({ name: options.name, schema: state.schema }, options.dropOptions);
        },
        schema: (schemaName) => {
            state.schema = schemaName;
        },
    };
};
exports.defineType = defineType;
