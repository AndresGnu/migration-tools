import { ContextFunction, getDefinition } from '@redware/migration-plv8';

export interface Args {
  sign: '+' | '-';
  value: any;
}

const run = ({ ARGS }: ContextFunction<Args>): string | number => {
  const { sign, value } = ARGS;
  //@INIT
  if (sign === '-') {
    return value * -1;
  } else {
    return value;
  }
  //@END
};

export default {
  run,
  ...getDefinition(__filename),
  // name: getName(__filename),
};
