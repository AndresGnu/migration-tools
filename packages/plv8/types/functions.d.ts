export type ContextFunction<Args = any> = {
  ARGS: Args;
  plv8: any;
};

export type ContextTriggeFun<ARGS = any, TABLE = any, TG_ARGS = string[]> = {
  plv8: any;
  ARGS: ARGS;
  NEW: TABLE;
  OLD: TABLE;
  TG_OP: 'INSERT' | 'UPDATE' | 'DELETE' | 'TRUNCATE';
};
