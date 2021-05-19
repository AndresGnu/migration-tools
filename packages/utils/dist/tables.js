"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineTable = void 0;
const node_pg_migrate_1 = require("node-pg-migrate");
const columns_1 = require("./columns");
const R = __importStar(require("ramda"));
//*******Methors******* */
const getFlatList = (pgm, list) => {
    //
    const items = list.reduce((prev, current) => {
        return R.flatten(prev.concat(current({ pgm })));
    }, []);
    return items;
};
const buildUpDown = (_items, options) => {
    return {
        up: (pgm) => {
            const items = getFlatList(pgm, _items);
            items.forEach((item) => {
                options.up({ item, pgm });
            });
        },
        down: (pgm) => {
            const items = getFlatList(pgm, _items);
            items.forEach((item) => {
                options.down({ item, pgm });
            });
        },
    };
};
const usePolicies = (tableName, items) => {
    return buildUpDown(items, {
        up: ({ pgm, item }) => {
            pgm.createPolicy(tableName, item.name, item.options);
        },
        down: ({ pgm, item }) => {
            pgm.dropPolicy(tableName, item.name, item.dropOptions);
        },
    });
};
const useTriggers = (tableName, items) => {
    return buildUpDown(items, {
        up: ({ pgm, item }) => {
            pgm.createTrigger(tableName, item.name, item.triggerOptions);
        },
        down: ({ pgm, item }) => {
            pgm.dropPolicy(tableName, item.name, item.dropOptions);
        },
    });
};
const useConstraints = (tableName, items) => {
    return buildUpDown(items, {
        up: ({ pgm, item }) => {
            pgm.createConstraint(tableName, item.name, item.expression);
        },
        down: ({ pgm, item }) => {
            pgm.dropConstraint(tableName, item.name, item.dropOptions);
        },
    });
};
const useIndexes = (tableName, items) => {
    return buildUpDown(items, {
        up: ({ pgm, item }) => {
            pgm.addIndex(tableName, item.columns, item.options);
        },
        down: ({ pgm, item }) => {
            pgm.dropIndex(tableName, item.columns, item.dropOptions);
        },
    });
};
const useColumns = (tableName, _columns) => {
    const _parseColumns = (myColumns) => R.mapObjIndexed((v, n) => {
        if (v.referencesConstraintComment) {
            v.referencesConstraintName = `${tableName.name}_fk_${n}`;
        }
        return {
            ...v,
        };
    }, myColumns);
    const getColumns = (pgm) => {
        const contextColumns = {
            ...columns_1.useHelperColumns(pgm),
            schema: tableName.schema,
            pgm,
        };
        const columns = _columns.reduce((prev, current) => {
            return prev.concat(current(contextColumns));
        }, []);
        return columns;
    };
    return {
        _parseColumns,
        _getColumns: getColumns,
        up: (pgm) => {
            const columns = getColumns(pgm);
            columns.forEach((column) => {
                pgm.addColumns(tableName, _parseColumns(column.columns), column.options);
            });
        },
        down: (pgm) => {
            const columns = getColumns(pgm);
            columns.forEach((column) => {
                const keys = Object.keys(column.columns);
                pgm.dropColumns(tableName, keys, column.dropOptions);
            });
        },
    };
};
const useTable = (options, state) => {
    const tableName = { name: options.name, schema: state.schema };
    const table = (pgm) => {
        return {
            up: () => {
                const { _parseColumns, _getColumns } = useColumns(tableName, [
                    options.columns,
                ]);
                const columns = _getColumns(pgm).reduce((prev, current) => {
                    return {
                        ...prev,
                        ...current.columns,
                    };
                }, {});
                pgm.createTable(tableName, _parseColumns(columns), state.options.create);
            },
            down: () => {
                pgm.dropTable(tableName, state.options.drop);
            },
        };
    };
    // const columns = useColumns(tableName, state.columns);
    // const indexes = useIndexes(tableName, state.indexes);
    // const constrains = useConstraints(tableName, state.constrains);
    // const trigges = useTriggers(tableName, state.triggers);
    // const policies = usePolicies(tableName, state.policies);
    //
    const call = (pgm, action, method) => {
        if (action.type === 'index') {
            useIndexes(tableName, [action.method])[method](pgm);
        }
        else if (action.type === 'constrain') {
            useConstraints(tableName, [action.method])[method](pgm);
        }
        else if (action.type === 'trigger') {
            useTriggers(tableName, [action.method])[method](pgm);
        }
        else if (action.type === 'policy') {
            usePolicies(tableName, [action.method])[method](pgm);
        }
    };
    return {
        up: (pgm) => {
            table(pgm).up();
            state.actions[state.index].forEach((action) => {
                if (action.type === 'columns') {
                    useColumns(tableName, [action.method]).up(pgm);
                }
                call(pgm, action, 'up');
            });
        },
        down: (pgm) => {
            state.actions[state.index].reverse().forEach((action) => {
                if (action.type === 'columns') {
                    useColumns(tableName, [action.method]).down(pgm);
                }
                call(pgm, action, 'down');
            });
            table(pgm).down();
        },
    };
};
const defineTable = (options) => {
    const _name = options.name;
    const state = {
        name: _name,
        schema: 'public',
        actions: [[]],
        options: {},
        index: 0,
    };
    const tableInit = {
        name: _name,
        columns: typeof options.columns === 'function'
            ? options.columns
            : (() => ({ columns: options.columns })),
    };
    const assignAction = (type, v) => {
        if (!v) {
            return void 0;
        }
        if (typeof v === 'function') {
            state.actions[state.index].push({
                type,
                method: v,
            });
        }
        else {
            // return () => [v];
            state.actions[state.index].push({
                type,
                method: () => v,
            });
        }
    };
    assignAction('index', options.indexes);
    assignAction('constrain', options.constrains);
    assignAction('trigger', options.triggers);
    assignAction('policy', options.policies);
    const methods = {
        _name,
        _reference: (key = 'id') => {
            //
            const ctx = columns_1.useHelperColumns({ fun: () => '' });
            const tableColumns = tableInit.columns({
                ...ctx,
                pgm: {},
                schema: state.schema,
            });
            const columns = tableColumns.columns;
            const type = columns[key] ? columns[key].type : columns['code'].type;
            return {
                type: type === node_pg_migrate_1.PgType.BIGSERIAL
                    ? node_pg_migrate_1.PgType.BIGINT
                    : type === node_pg_migrate_1.PgType.SERIAL
                        ? node_pg_migrate_1.PgType.INTEGER
                        : type,
                references: {
                    name: options.name,
                    schema: state.schema,
                },
            };
        },
        // _state: state,
        columns: (columns) => {
            assignAction('columns', columns);
            return methods;
        },
        constrains: (constrains) => {
            assignAction('constrain', constrains);
            return methods;
        },
        indexes: (indexes) => {
            assignAction('index', indexes);
            return methods;
        },
        triggers: (triggers) => {
            assignAction('trigger', triggers);
            return methods;
        },
        policies: (policies) => {
            assignAction('policy', policies);
            return methods;
        },
        /**
         * Up table
         */
        $up: (pgm) => {
            const table = useTable(tableInit, state);
            table.up(pgm);
            state.index += 1;
        },
        $down: (pgm) => {
            const table = useTable(tableInit, state);
            table.down(pgm);
        },
        //Extra options
        options: (tableOptions) => {
            state.options = tableOptions;
            return methods;
        },
        schema: (nameSchema) => {
            state.schema = nameSchema;
            return methods;
        },
    };
    return methods;
};
exports.defineTable = defineTable;
