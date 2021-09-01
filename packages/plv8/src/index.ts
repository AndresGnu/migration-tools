import { PLV8 } from 'types';
import path from 'path';
import fs from 'fs';
export { ContextFunction, ContextTriggeFun } from 'types';
interface StatePlv8 {
  functions: Record<string, any>;
  datas: any[];
  index: number;
}

const useExecute = (state: StatePlv8) => (sql: string, args?: any[]) => {
  if (sql.includes('DELETE')) {
    return 0;
  } else {
    const data = state.datas[state.index];
    state.index += 1;
    return data;
  }
};
const find_function =
  (state: StatePlv8) =>
  (name: string) =>
  (...params: any[]) => {
    if (state.functions[name]) {
      const data = state.functions[name]();
      // state.index += 1;
      return data;
    } else {
      throw new Error('No data return');
    }
  };
const elog = (level: string, ...msg: string[]) => {
  console.log(msg);
};

const prepare = (state: StatePlv8) => (sql: string, typenames: string[]) => {
  const _execute = (args: any[]) => {
    useExecute(state)(sql, args);
  };
  const cursor = (args: any[]) => {
    return {
      fetch: (nrows: [number]) => {
        return {};
      },
      move: (nrows: [number]) => {
        return {};
      },
      close: () => {
        //
      },
    };
  };
  return {
    execute: _execute,
    free: () => {
      //
    },
    cursor,
  };
};
const subtransaction = (callback: () => void) => {
  //
};
export const createPlv8 = (): PLV8 => {
  const state: StatePlv8 = {
    functions: {},
    index: 0,
    datas: [],
  };

  return {
    execute: useExecute(state),
    prepare: prepare(state),
    find_function: find_function(state),
    elog,
    subtransaction,
    $data: (data: unknown) => {
      state.datas.push(data);
    },
    $function: (name: string, data: any) => {
      //
      state.functions[name] = () => data;
    },
  } as any;
};

export const getDefinition = (fileName: string) => {
  const file = fs.readFileSync(fileName, 'utf8');
  const re = /@INIT([^@]+)?@/g;
  const match = re.exec(file);
  // return match[1].trim();
  if (!match) throw new Error(`Incorrect definition: ${fileName}`);
  return {
    name: path.basename(fileName).replace(/(\.js|\.ts)/g, ''),
    definition: match[1].trim(),
  };
};
