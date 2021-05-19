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
    const methods = {
        _columnType: (...params) => {
            const _params = options?.columnType?.(...params);
            const nameFunction = `"${state.schema}"."${state.name}"`;
            if (_params) {
                return `${nameFunction}(${_params})`;
            }
            else {
                return `${nameFunction}(${params.join(',')})`;
            }
        },
        _expressionGenerated: (...params) => {
            return {
                type: options.function.options.returns,
                expressionGenerated: methods._columnType(...params),
            };
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
    return methods;
};
exports.defineFunction = defineFunction;
// export
