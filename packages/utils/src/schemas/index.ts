import {
  MigrationBuilder,
  CreateSchemaOptions,
  DropOptions,
} from 'node-pg-migrate';
import { DefineTable } from '../tables';
import { DefineFunction } from '../functions';
import { DefineType } from '../types';
import { Actions, useSchema } from './use';

interface StateSchemas {
  actions: Record<string, Actions[]>;
  migration: string;
  schemas: Record<string, boolean>;
}

export const createMigration = (id: string) => {
  const state: StateSchemas = {
    migration: id,
    actions: {},
    schemas: {},
  };
  state.actions[id] = [];

  const methods = (nameSchema: string) => ({
    _actions: state.actions,

    table: (
      theTable: ReturnType<DefineTable>,
      options: { create?: boolean } = {},
    ) => {
      const { create = true } = options;
      theTable.$migration(state.migration);
      state.actions[state.migration].push({
        schema: nameSchema,
        type: 'table',
        method: theTable,
        options: { create: create },
      });
      return methods(nameSchema);
    },
    type: (theType: ReturnType<DefineType>) => {
      state.actions[state.migration].push({
        schema: nameSchema,
        type: 'type',
        method: theType,
      });
      return methods(nameSchema);
    },
    function: (theFunction: ReturnType<DefineFunction>) => {
      state.actions[state.migration].push({
        schema: nameSchema,
        type: 'function',
        method: theFunction,
      });
      return methods(nameSchema);
    },
  });
  return {
    defineSchema: (nameSchema: string, create = false) => {
      state.actions[state.migration].push({
        type: 'schema',
        schema: nameSchema,
      });
      if (create) {
        state.schemas[nameSchema] = create;
      }
      return methods(nameSchema);
    },
    $up: (pgm: MigrationBuilder, id: string) => {
      state.migration = id;
      const actions = useSchema(
        id,
        state.actions[state.migration],
        state.schemas,
      );
      actions.up(pgm);
    },
    $down: (pgm: MigrationBuilder, id: string) => {
      state.migration = id;
      const actions = useSchema(
        id,
        state.actions[state.migration],
        state.schemas,
      );
      actions.down(pgm);
    },
    state,
  };
};
// createSchemas()
