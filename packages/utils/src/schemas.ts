import {
  MigrationBuilder,
  CreateSchemaOptions,
  DropOptions,
} from 'node-pg-migrate';
import { DefineTable } from './tables';
import { DefineFunction } from './functions';
import { DefineType } from './types';
type Actions =
  | {
      type: 'table';
      method: ReturnType<DefineTable>;
    }
  | { type: 'function'; method: ReturnType<DefineFunction> }
  | {
      type: 'type';
      method: ReturnType<DefineType>;
    };
interface StateSchemas {
  actions: Actions[];
}

const useSchema = (schema: string, state: StateSchemas) => {
  //
  return {
    up: (pgm: MigrationBuilder) => {
      // tables.up(schema, pgm);
      pgm.createSchema(schema, { ifNotExists: true });
      state.actions.forEach((action) => {
        /**
         * Run tables
         */
        if (action.type === 'table') {
          action.method.schema(schema);
          action.method.$up(pgm);
        } else if (action.type === 'function') {
          action.method.schema(schema);
          action.method.$up(pgm);
        } else if (action.type === 'type') {
          action.method.schema(schema);
          action.method.$up(pgm);
        }
      });
    },
    down: (pgm: MigrationBuilder) => {
      state.actions.reverse().forEach((action) => {
        if (action.type === 'table') {
          action.method.schema(schema);
          action.method.$down(pgm);
        } else if (action.type === 'function') {
          action.method.schema(schema);
          action.method.$down(pgm);
        } else if (action.type === 'type') {
          action.method.schema(schema);
          action.method.$down(pgm);
        }
      });
      if (schema !== 'public') {
        pgm.dropSchema(schema);
      }
    },
  };
};

export const createSchemas = (
  nameSchema: string,
  options?: CreateSchemaOptions & DropOptions,
) => {
  // pgm.createSchema(nameSchema, {
  //   ...options,
  //   ifNotExists: true,
  // });
  const states: StateSchemas[] = [
    {
      actions: [],
    },
  ];
  let index = 0;
  const methods = {
    // table: (nameTable: string, optionsTable: any) => {
    //   return methods;
    // },
    $up: (pgm: MigrationBuilder) => {
      const schemas = useSchema(nameSchema, states[index]);
      schemas.up(pgm);
      // Reset actions
      index += 1;
    },
    $down: (pgm: MigrationBuilder) => {
      //
      const schemas = useSchema(nameSchema, states[index]);
      schemas.down(pgm);
      // Reset actions
      index -= 0;
    },
    table: (theTable: ReturnType<DefineTable>) => {
      states[index].actions.push({
        type: 'table',
        method: theTable,
      });
      return methods;
    },
    type: (theTable: ReturnType<DefineType>) => {
      states[index].actions.push({
        type: 'type',
        method: theTable,
      });
      return methods;
    },
    function: (theFunction: ReturnType<DefineFunction>) => {
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
// createSchemas()
