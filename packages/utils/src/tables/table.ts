import {
  MigrationBuilder,
  ColumnDefinitions,
  Name,
  PgType,
  ColumnDefinition,
} from 'node-pg-migrate';
import {
  CallbackTable,
  TableIndexes,
  TableColumns,
  TableOptions,
  TableConstrains,
  TableTrigges,
  TablePolicies,
} from 'types';
import { useHelperColumns, HelperColumns } from './columns';
import * as R from 'ramda';
import { buildUpDown } from './_helpers';
import knex from 'knex';

type CallbackColumns = CallbackTable<
  TableColumns,
  HelperColumns & { schema: string; pgm: MigrationBuilder }
>;
type CallbackIndexes = CallbackTable<TableIndexes | TableIndexes[]>;
type CallbackConstrains = CallbackTable<TableConstrains | TableConstrains[]>;
type CallbackTriggers = CallbackTable<TableTrigges | TableTrigges[]>;
type CallbackPolicies = CallbackTable<TablePolicies | TablePolicies[]>;

export interface TableObject<
  D extends Record<string, any> = Record<string, any>,
> {
  name: string;
  columns?: ColumnDefinitions | CallbackColumns;
  constrains?: TableConstrains | TableConstrains[] | CallbackConstrains;
  indexes?: TableIndexes | TableIndexes[] | CallbackIndexes;
  policies?: TablePolicies | TablePolicies[] | CallbackPolicies;
  triggers?: TableTrigges | TableTrigges[] | CallbackTriggers;
  data?: D;
}

interface TableInternalObject {
  name: string;
  columns: CallbackColumns;
}
type Actions =
  | { type: 'columns'; method: CallbackColumns }
  | { type: 'index'; method: CallbackIndexes }
  | { type: 'constrain'; method: CallbackConstrains }
  | { type: 'trigger'; method: CallbackTriggers }
  | { type: 'policy'; method: CallbackPolicies };
export interface TableState {
  migration: string;
  name: string;
  schema: string;
  actions: Record<string, Actions[]>;
  firstMigration: string;
  options: Partial<TableOptions>;
}

const usePolicies = (tableName: Name, items: CallbackPolicies[]) => {
  return buildUpDown<TablePolicies>(items, {
    up: ({ pgm, item }) => {
      pgm.createPolicy(tableName, item.name, item.options);
    },
    down: ({ pgm, item }) => {
      pgm.dropPolicy(tableName, item.name, item.dropOptions);
    },
  });
};

const useTriggers = (tableName: Name, items: CallbackTriggers[]) => {
  return buildUpDown<TableTrigges>(items, {
    up: ({ pgm, item }) => {
      pgm.createTrigger(
        tableName,
        item.name,
        item.triggerOptions,
        // item.definition,
      );
    },
    down: ({ pgm, item }) => {
      pgm.dropPolicy(tableName, item.name, item.dropOptions);
    },
  });
};

const useConstraints = (tableName: Name, items: CallbackConstrains[]) => {
  return buildUpDown<TableConstrains>(items, {
    up: ({ pgm, item }) => {
      pgm.createConstraint(tableName, item.name, item.expression);
    },
    down: ({ pgm, item }) => {
      pgm.dropConstraint(tableName, item.name!, item.dropOptions);
    },
  });
};

const useIndexes = (tableName: Name, items: CallbackIndexes[]) => {
  return buildUpDown<TableIndexes>(items, {
    up: ({ pgm, item }) => {
      pgm.addIndex(tableName, item.columns, item.options);
    },
    down: ({ pgm, item }) => {
      pgm.dropIndex(tableName, item.columns, item.dropOptions);
    },
  });
};

const useColumns = (tableName: Name, _columns: CallbackColumns[]) => {
  const _parseColumns = (myColumns: unknown) =>
    R.mapObjIndexed((v, n) => {
      if (v.referencesConstraintComment) {
        v.referencesConstraintName = `${(tableName as any).name}_fk_${n}`;
      }
      return {
        ...v,
      };
    }, myColumns as Record<string, ColumnDefinition>);

  const getColumns = (pgm: MigrationBuilder) => {
    const contextColumns = {
      ...useHelperColumns(pgm),
      schema: (tableName as any).schema,
      pgm,
    };
    const columns = R.flatten(_columns).reduce((prev, current) => {
      return prev.concat(current(contextColumns));
    }, [] as TableColumns[]);

    columns.push({ columns: contextColumns.$table._columns });

    return columns;
  };
  return {
    _parseColumns,
    _getColumns: getColumns,
    up: (pgm: MigrationBuilder) => {
      const columns = getColumns(pgm);

      columns.forEach((column) => {
        if (Object.keys(column.columns).length) {
          pgm.addColumns(
            tableName,
            _parseColumns(column.columns),
            column.options,
          );
        }
      });
    },
    down: (pgm: MigrationBuilder) => {
      const columns = getColumns(pgm);
      columns.forEach((column) => {
        const keys = Object.keys(column.columns);
        if (keys.length) {
          pgm.dropColumns(tableName, keys, column.dropOptions);
        }
      });
    },
  };
};

const useTable = (
  options: TableInternalObject,
  state: TableState,
  create = true,
) => {
  const tableName = { name: options.name, schema: state.schema };

  const createTable = (pgm: MigrationBuilder) => {
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
        }, {} as ColumnDefinitions);

        pgm.createTable(
          tableName,
          _parseColumns(columns),
          state.options.create,
        );
      },
      down: () => {
        pgm.dropTable(tableName, state.options.drop);
      },
    };
  };

  const runTableExtensions = (action: Actions) => {
    if (action.type === 'index') {
      return useIndexes(tableName, [action.method]);
    } else if (action.type === 'constrain') {
      return useConstraints(tableName, [action.method]);
    } else if (action.type === 'trigger') {
      return useTriggers(tableName, [action.method]);
    } else if (action.type === 'policy') {
      return usePolicies(tableName, [action.method]);
    }
  };
  const MIGRATION = state.migration;
  return {
    up: (pgm: MigrationBuilder) => {
      const run = (action: Actions) => {
        if (action.type === 'columns') {
          useColumns(tableName, [action.method]).up(pgm);
        }
        runTableExtensions(action)?.up(pgm);
      };

      if (create) {
        createTable(pgm).up();
        state.actions['init'].forEach(run);
      }

      state.actions?.[state.migration].forEach(run);
    },
    down: (pgm: MigrationBuilder) => {
      const run = (action: Actions) => {
        if (action.type === 'columns') {
          useColumns(tableName, [action.method]).down(pgm);
        }
        runTableExtensions(action)?.down(pgm);
      };
      state.actions?.[state.migration].reverse().forEach(run);
      if (create) {
        state.actions['init'].reverse().forEach(run);
        createTable(pgm).down();
      }
    },
  };
};

export interface ReturnTable<D> {
  _name: string;
  _state: TableState;
  _data: D | undefined;
  _queryData: {
    insert: Record<keyof D, string>;
  };
  _reference: (key?: string) => ColumnDefinition;
  columns: (columns: TableColumns | CallbackColumns) => ReturnTable<D>;
  constrains: (constrains: TableObject<any>['constrains']) => ReturnTable<D>;
  indexes: (indexes: TableObject<any>['indexes']) => any;
  triggers: (triggers: TableObject<any>['triggers']) => ReturnTable<D>;
  policies: (policies: TableObject<any>['policies']) => ReturnTable<D>;
  /**
   * Up table
   */
  $migration: (id: string) => ReturnTable<D>;
  $migrate: {
    up: (pgm: MigrationBuilder, id: string, create?: boolean) => void;
    down: (pgm: MigrationBuilder, id: string, create?: boolean) => void;
  };
  options: (tableOptions: Partial<TableOptions>) => ReturnTable<D>;
  schema: (nameSchema: string) => ReturnTable<D>;
}
export type DefineTable = <D extends Record<string, any>>(
  options: TableObject<D>,
) => ReturnTable<D>;

export const defineTable: DefineTable = (options) => {
  const _name = options.name;
  const state: TableState = {
    migration: 'init',
    name: _name,
    schema: 'public',
    actions: { init: [] },
    firstMigration: '',
    options: {},
  };
  const tableInit: TableInternalObject = {
    name: _name,
    columns:
      typeof options.columns === 'function'
        ? options.columns
        : ((() => ({ columns: options.columns })) as CallbackColumns),
  };

  const assignAction = (
    type: 'columns' | 'index' | 'constrain' | 'trigger' | 'policy',
    v: any,
  ) => {
    if (type === 'columns') console.log(v);

    if (!v) {
      return void 0;
    }
    if (typeof v === 'function') {
      state.actions[state.migration].push({
        type,
        method: v,
      });
    } else {
      // return () => [v];
      state.actions[state.migration].push({
        type,
        method: () => v,
      });
    }
  };
  assignAction('index', options.indexes);
  assignAction('constrain', options.constrains);
  assignAction('trigger', options.triggers);
  assignAction('policy', options.policies);

  const insertQuery = (data: any) => {
    //
    const client = knex({
      client: 'pg',
    });
    const queryInsert = client(state.name)
      .withSchema(state.schema)
      .insert(data)
      .toQuery();
    return queryInsert;
  };
  const methods = {
    _name,
    _state: state,
    _data: options.data,
    _queryData: {
      insert: R.mapObjIndexed((v) => {
        return insertQuery(v);
      }, options.data || {}) as any,
    },
    _reference: (key = 'id'): ColumnDefinition => {
      //
      const ctx = useHelperColumns({ func: () => '' } as any);
      const tableColumns = tableInit.columns({
        ...ctx,
        pgm: {} as any,
        schema: state.schema,
      });
      const columns = tableColumns.columns as Record<string, ColumnDefinition>;
      // columns = { ...columns, ...ctx.$table._columns };
      const type = columns[key] ? columns[key].type : columns['code'].type;
      return {
        type:
          type === PgType.BIGSERIAL
            ? PgType.BIGINT
            : type === PgType.SERIAL
            ? PgType.INTEGER
            : type,
        references: {
          name: options.name,
          schema: state.schema,
        },
      };
    },
    // _state: state,
    columns: (columns: TableColumns | CallbackColumns) => {
      assignAction('columns', columns);
      return methods;
    },
    constrains: (constrains: TableObject<any>['constrains']) => {
      assignAction('constrain', constrains);
      return methods;
    },
    indexes: (indexes: TableObject<any>['indexes']) => {
      assignAction('index', indexes);
      return methods;
    },
    triggers: (triggers: TableObject<any>['triggers']) => {
      assignAction('trigger', triggers);
      return methods;
    },
    policies: (policies: TableObject<any>['policies']) => {
      assignAction('policy', policies);
      return methods;
    },
    /**
     * Up table
     */
    $migration: (_migration: string) => {
      state.migration = _migration;
      if (!state.firstMigration) {
        state.firstMigration = _migration;
      }
      if (!state.actions[_migration]) {
        state.actions[_migration] = [];
      }
      return methods;
    },
    $migrate: {
      up: (pgm: MigrationBuilder, id: string, create = true) => {
        state.migration = id;
        const table = useTable(tableInit, state, create);

        // console.log(table);

        table.up(pgm);
        if (options.data?.default && create) {
          pgm.sql(insertQuery(options.data.default));
        }
      },
      down: (pgm: MigrationBuilder, id: string, create = true) => {
        state.migration = id;
        const table = useTable(tableInit, state, create);

        table.down(pgm);
      },
    },
    //Extra options
    options: (tableOptions: Partial<TableOptions>) => {
      state.options = tableOptions;
      return methods;
    },
    schema: (nameSchema: string) => {
      state.schema = nameSchema;
      return methods;
    },
  };
  // type M = typeof methods;
  return methods;
};
