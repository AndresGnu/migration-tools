import { Typenames } from './collections';
export * from './functions';
export type Prepare = (
  sql: string,
  typenames: Typenames[],
) => {
  execute: <R = any>(args: any[]) => R;
  free: () => void;
  cursor: (args: any[]) => {
    fetch: <R = any>(nrows: [number]) => R;
    move: <R = any>(nrows: [number]) => R;
    close: () => void;
  };
};
export declare type Subtransaction = (callback: () => void) => void;

export type PLV8 = {
  prepare: Prepare;
  subtransaction: Subtransaction;
  execute: <Return = any>(sql: string, ags?: any[]) => Return;
  find_function: <Params extends unknown[], Return = any>(
    name: string,
  ) => (...params: Params) => Return;
  $data: (data: unknown) => void;
  $function: (name: string, data: any) => void;
};
