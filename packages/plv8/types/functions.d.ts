import { PLV8 } from './index';
export type ContextFunction<Args = any> = {
  ARGS: Args;
  plv8: PLV8;
};

export type ContextTriggeFun<ARGS = any, ROW = any, TG_ARGS = string[]> = {
  plv8: PLV8;
  ARGS: ARGS;
  NEW: ROW;
  OLD: ROW;
  TG_OP: 'INSERT' | 'UPDATE' | 'DELETE' | 'TRUNCATE';
};
