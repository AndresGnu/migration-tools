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
  const name = Array.isArray(options.type)
    ? `enum_${options.name}`
    : options.name;
  return {
    $up: (pgm: MigrationBuilder) => {
      //

      pgm.createType({ name: name, schema: state.schema }, options.type);
    },
    $down: (pgm: MigrationBuilder) => {
      pgm.dropType({ name: name, schema: state.schema }, options.dropOptions);
    },
    schema: (schemaName: string) => {
      state.schema = schemaName;
    },
    _name: name,
  };
};

export type DefineType = typeof defineType;
