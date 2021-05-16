import {
  MigrationBuilder,
  ColumnDefinitions,
  CreateIndex,
  Name,
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
import { useHelperColumns } from './columns';
import * as R from 'ramda';
import type { HelperColumns } from './columns';

type CallbackColumns = CallbackTable<
  TableColumns,
  HelperColumns & { schema: string; pgm: MigrationBuilder }
>;
type CallbackIndexes = CallbackTable<TableIndexes | TableIndexes[]>;
type CallbackConstrains = CallbackTable<TableConstrains | TableConstrains[]>;
type CallbackTriggers = CallbackTable<TableTrigges | TableTrigges[]>;
type CallbackPolicies = CallbackTable<TablePolicies | TablePolicies[]>;

export interface TableObject {
  name: string;
  columns?: ColumnDefinitions | CallbackColumns;
  constrains?: TableConstrains | TableConstrains | CallbackConstrains;
  indexes?: TableIndexes | TableIndexes[] | CallbackIndexes;
  policies?: TablePolicies | TablePolicies[] | CallbackPolicies;
  triggers?: TableTrigges | TableTrigges[] | CallbackTriggers;
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
  name: string;
  schema: string;
  actions: Actions[][];
  index: number;

  options: Partial<TableOptions>;
}

//*******Methors******* */
const getFlatList = <R = any>(
  pgm: MigrationBuilder,
  list: CallbackTable[],
): R[] => {
  //
  const items = list.reduce((prev, current) => {
    return R.flatten(prev.concat(current({ pgm })));
  }, []);
  return items;
};
interface BuildContext<I> {
  pgm: MigrationBuilder;
  item: I;
}
interface OptionsBuild<Item = unknown> {
  up: (options: BuildContext<Item>) => void;
  down: (options: BuildContext<Item>) => void;
}
const buildUpDown = <Item = unknown>(
  _items: CallbackTable[],
  options: OptionsBuild<Item>,
) => {
  return {
    up: (pgm: MigrationBuilder) => {
      const items = getFlatList(pgm, _items);
      items.forEach((item) => {
        options.up({ item, pgm });
      });
    },
    down: (pgm: MigrationBuilder) => {
      const items = getFlatList(pgm, _items);
      items.forEach((item) => {
        options.down({ item, pgm });
      });
    },
  };
};

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
  const getColumns = (pgm: MigrationBuilder) => {
    const contextColumns = {
      ...useHelperColumns(pgm),
      schema: (tableName as any).schema,
      pgm,
    };
    const columns = _columns.reduce((prev, current) => {
      return prev.concat(current(contextColumns));
    }, [] as TableColumns[]);
    return columns;
  };
  return {
    _getColumns: getColumns,
    up: (pgm: MigrationBuilder) => {
      const columns = getColumns(pgm);
      columns.forEach((column) => {
        pgm.addColumns(tableName, column.columns, column.options);
      });
    },
    down: (pgm: MigrationBuilder) => {
      const columns = getColumns(pgm);
      columns.forEach((column) => {
        const keys = Object.keys(column.columns);
        pgm.dropColumns(tableName, keys, column.dropOptions);
      });
    },
  };
};

const useTable = (options: TableInternalObject, state: TableState) => {
  const tableName = { name: options.name, schema: state.schema };

  const table = (pgm: MigrationBuilder) => {
    return {
      up: () => {
        const columns = useColumns(tableName, [options.columns])
          ._getColumns(pgm)
          .reduce((prev, current) => {
            return {
              ...prev,
              ...current.columns,
            };
          }, {} as ColumnDefinitions);

        pgm.createTable(tableName, columns, state.options.create);
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
  const call = (
    pgm: MigrationBuilder,
    action: Actions,
    method: 'up' | 'down',
  ) => {
    if (action.type === 'index') {
      useIndexes(tableName, [action.method])[method](pgm);
    } else if (action.type === 'constrain') {
      useConstraints(tableName, [action.method])[method](pgm);
    } else if (action.type === 'trigger') {
      useTriggers(tableName, [action.method])[method](pgm);
    } else if (action.type === 'policy') {
      usePolicies(tableName, [action.method])[method](pgm);
    }
  };
  return {
    up: (pgm: MigrationBuilder) => {
      table(pgm).up();
      /**
       * Extra options
       */
      state.actions[state.index].forEach((action) => {
        if (action.type === 'columns') {
          useColumns(tableName, [action.method]).up(pgm);
        }
        call(pgm, action, 'up');
      });
    },
    down: (pgm: MigrationBuilder) => {
      /**
       * Extra options
       */

      state.actions[state.index].reverse().forEach((action) => {
        if (action.type === 'columns') {
          useColumns(tableName, [action.method]).up(pgm);
        }
        call(pgm, action, 'up');
      });
      table(pgm).down();
    },
  };
};

export const defineTable = (options: TableObject) => {
  const _name = options.name;
  const state: TableState = {
    name: _name,
    schema: 'plubic',
    actions: [],
    options: {},
    index: 0,
  };
  const tableInit: TableInternalObject = {
    name: _name,
    columns:
      typeof options.columns === 'function'
        ? options.columns
        : ((() => ({ columns: options.columns })) as CallbackColumns),
  };

  const table = useTable(tableInit, state);
  const assignAction = (
    type: 'columns' | 'index' | 'constrain' | 'trigger' | 'policy',
    v: any,
  ) => {
    if (!v) {
      return void 0;
    }
    if (typeof v === 'function') {
      state.actions[state.index].push({
        type,
        method: v,
      });
    } else {
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
    // _state: state,
    columns: (columns: TableColumns | CallbackColumns) => {
      assignAction('columns', columns);
      return methods;
    },
    constrains: (constrains: TableObject['constrains']) => {
      assignAction('constrain', constrains);
      return methods;
    },
    indexes: (indexes: TableObject['indexes']) => {
      assignAction('index', indexes);
      return methods;
    },
    triggers: (triggers: TableObject['triggers']) => {
      assignAction('trigger', triggers);
      return methods;
    },
    policies: (policies: TableObject['policies']) => {
      assignAction('policy', policies);
      return methods;
    },
    /**
     * Up table
     */
    $up: (pgm: MigrationBuilder) => {
      table.up(pgm);
      state.index += 1;
    },
    $down: (pgm: MigrationBuilder) => {
      table.down(pgm);
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
  return methods;
};

export type DefineTable = typeof defineTable;
