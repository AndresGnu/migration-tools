import { ContextFunction, getDefinition } from '@redware/migration-plv8';
import fs from 'fs';
interface Args {
  texts: string[];
}
console.log(__filename);

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
const t = fs.readFileSync(__filename, 'utf8');
console.log(t);

export default {
  run,
  ...getDefinition(__filename),
  // name: getName(__filename),
};
