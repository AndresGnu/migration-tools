"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineFunction = void 0;
const defineFunction = (options) => {
    const state = {
        name: options.name,
        schema: 'public',
    };
    const functionName = {
        name: options.name,
        schema: state.schema,
    };
    return {
        columnType: (...params) => {
            const _params = options?.columnType?.(...params);
            const nameFunction = `"${state.schema}"."${state.name}"`;
            if (_params) {
                return `${nameFunction}(${_params})`;
            }
            else {
                return `${nameFunction}(${params.join(',')})`;
            }
        },
        schema: (schema) => {
            state.schema = schema;
        },
        $up: (pgm) => {
            pgm.createFunction(functionName, options.function.params, options.function.options, options.function.definition);
        },
        $down: (pgm) => {
            pgm.dropFunction(functionName, options.function.params, options.dropOptions);
        },
    };
};
exports.defineFunction = defineFunction;
// export
