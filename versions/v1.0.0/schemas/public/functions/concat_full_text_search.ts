import { defineFunction } from '@redware/migration-utils';
import { PgType } from 'node-pg-migrate';
const fun = defineFunction({
  name: __filename.replace('.ts', ''),
  function: {
    params: [],
    options: {
      language: 'plv8',
      returns: PgType.TSVECTOR,
      behavior: 'IMMUTABLE',
    },
    definition: '',
  },
  columnType: (...params) => {
    return `ARRAY[${params.join(',')}]`;
  },
});

fun.schema('public');
export default fun;
