import { MigrationBuilder } from 'node-pg-migrate';
import { DefineTable } from '../tables';
import { DefineFunction } from '../functions';
import { DefineType } from '../types';

export type Actions =
  | {
      schema: string;
      type: 'table';
      method: ReturnType<DefineTable>;
      options: { create: boolean };
    }
  | { schema: string; type: 'function'; method: ReturnType<DefineFunction> }
  | {
      schema: string;
      type: 'type';
      method: ReturnType<DefineType>;
    }
  | {
      type: 'generic';
      method: {
        up: (pgm: MigrationBuilder) => any;
        down: (pgm: MigrationBuilder) => any;
      };
    }
  | {
      schema: string;
      type: 'schema';
      // method: ReturnType<any>;
    };

export const useSchema = (
  migration: string,
  actions: Actions[],

  schemas: Record<string, boolean>,
) => {
  return {
    up: (pgm: MigrationBuilder) => {
      // pgm.createSchema(schema, { ifNotExists: true });
      actions.forEach((action) => {
        if (action.type === 'table') {
          action.method.schema(action.schema);
          action.method.$migrate.up(pgm, migration, action.options?.create);
        } else if (action.type === 'function') {
          action.method.schema(action.schema);
          action.method.$up(pgm);
        } else if (action.type === 'type') {
          action.method.schema(action.schema);
          action.method.$up(pgm);
        } else if (action.type === 'schema' && schemas[action.schema]) {
          pgm.createSchema(action.schema, { ifNotExists: true });
        } else if (action.type === 'generic') {
          action.method.up(pgm);
        }
      });
    },
    down: (pgm: MigrationBuilder) => {
      actions.reverse().forEach((action) => {
        if (action.type === 'table') {
          action.method.schema(action.schema);
          action.method.$migrate.down(pgm, migration, action.options?.create);
        } else if (action.type === 'function') {
          action.method.schema(action.schema);
          action.method.$down(pgm);
        } else if (action.type === 'type') {
          action.method.schema(action.schema);
          action.method.$down(pgm);
        } else if (
          action.type === 'schema' &&
          schemas[action.schema] &&
          action.schema !== 'public'
        ) {
          pgm.dropSchema(action.schema);
        } else if (action.type === 'generic') {
          action.method.down(pgm);
        }
      });
    },
  };
};
