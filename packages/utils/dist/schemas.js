"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchemas = void 0;
const useSchema = (schema, state) => {
    //
    return {
        up: (pgm) => {
            // tables.up(schema, pgm);
            pgm.createSchema(schema, { ifNotExists: true });
            state.actions.forEach((action) => {
                /**
                 * Run tables
                 */
                if (action.type === 'table') {
                    action.method.schema(schema);
                    action.method.$up(pgm);
                }
                else if (action.type === 'function') {
                    action.method.schema(schema);
                    action.method.$up(pgm);
                }
                else if (action.type === 'type') {
                    action.method.schema(schema);
                    action.method.$up(pgm);
                }
            });
        },
        down: (pgm) => {
            state.actions.reverse().forEach((action) => {
                if (action.type === 'table') {
                    action.method.schema(schema);
                    action.method.$down(pgm);
                }
                else if (action.type === 'function') {
                    action.method.schema(schema);
                    action.method.$down(pgm);
                }
                else if (action.type === 'type') {
                    action.method.schema(schema);
                    action.method.$down(pgm);
                }
            });
            pgm.dropSchema(schema);
        },
    };
};
const createSchemas = (nameSchema, options) => {
    // pgm.createSchema(nameSchema, {
    //   ...options,
    //   ifNotExists: true,
    // });
    const states = [
        {
            actions: [],
        },
    ];
    let index = 0;
    const methods = {
        // table: (nameTable: string, optionsTable: any) => {
        //   return methods;
        // },
        $up: (pgm) => {
            const schemas = useSchema(nameSchema, states[index]);
            schemas.up(pgm);
            // Reset actions
            states[index].actions = [];
            index += 1;
        },
        $down: (pgm) => {
            //
        },
        table: (theTable) => {
            states[index].actions.push({
                type: 'table',
                method: theTable,
            });
            return methods;
        },
        type: (theTable) => {
            states[index].actions.push({
                type: 'type',
                method: theTable,
            });
            return methods;
        },
        function: (theFunction) => {
            //
            states[index].actions.push({
                type: 'function',
                method: theFunction,
            });
            return methods;
        },
    };
    return methods;
};
exports.createSchemas = createSchemas;
// createSchemas()
