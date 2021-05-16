import { Value, Type, DropOptions, MigrationBuilder } from 'node-pg-migrate';
interface TypeOptions {
  name: string;
  type: (
    | Value[]
    | {
        [name: string]: Type;
      }
  ) &
    DropOptions;
  dropOptions?: DropOptions;
}
interface TypeState {
  name: string;
  schema: string;
}

export const defineType = (options: TypeOptions) => {
  //
  const state: TypeState = {
    name: options.name,
    schema: 'public',
  };
  return {
    $up: (pgm: MigrationBuilder) => {
      //
      pgm.createType(
        { name: options.name, schema: state.schema },
        options.type,
      );
    },
    $down: (pgm: MigrationBuilder) => {
      pgm.dropType(
        { name: options.name, schema: state.schema },
        options.dropOptions,
      );
    },
    schema: (schemaName: string) => {
      state.schema = schemaName;
    },
  };
};

export type DefineType = typeof defineType;
