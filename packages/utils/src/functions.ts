import { MigrationBuilder, DropOptions } from 'node-pg-migrate';
import { FunctionDefinition } from 'types';
interface FunctionOptions<Params extends unknown[]> {
  name: string;
  function: FunctionDefinition;
  columnType?: (...params: Params) => string;
  dropOptions?: DropOptions;
}
interface StateFunction {
  name: string;
  schema: string;
}

export const defineFunction = <P extends unknown[]>(
  options: FunctionOptions<P>,
) => {
  const state: StateFunction = {
    name: options.name,
    schema: 'public',
  };
  const functionName = {
    name: options.name,
    schema: state.schema,
  };
  return {
    columnType: (...params: P) => {
      const _params = options?.columnType?.(...params);
      const nameFunction = `"${state.schema}"."${state.name}"`;
      if (_params) {
        return `${nameFunction}(${_params})`;
      } else {
        return `${nameFunction}(${params.join(',')})`;
      }
    },
    schema: (schema: string) => {
      state.schema = schema;
    },
    $up: (pgm: MigrationBuilder) => {
      pgm.createFunction(
        functionName,
        options.function.params,
        options.function.options,
        options.function.definition,
      );
    },
    $down: (pgm: MigrationBuilder) => {
      pgm.dropFunction(
        functionName,
        options.function.params,
        options.dropOptions,
      );
    },
  };
};

export type DefineFunction = typeof defineFunction;
// export
