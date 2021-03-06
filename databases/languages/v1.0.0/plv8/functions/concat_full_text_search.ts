import { ContextFunction, getDefinition } from '@redware/migration-plv8';
export interface Args {
  texts: string[];
}

const run = ({ ARGS }: ContextFunction<Args>): string => {
  const { texts } = ARGS;
  //@INIT
  const l = texts.map((v) => {
    const n = Number(v);
    return !!n ? `${n} ${v}` : v;
  });
  const text = l.join(' ').toLowerCase();
  return text;
  //@END
};

export default {
  run,
  ...getDefinition(__filename),
  // name: getName(__filename),
};
