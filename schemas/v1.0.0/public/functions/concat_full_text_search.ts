import { defineFunction } from '@redware/migration-utils';
import { PgType } from 'node-pg-migrate';
import lang from '@db/languages';

const { definition, name } = lang.v1_0_0.plv8.functions.concat_full_text_search;

export const fun = defineFunction({
  name,
  function: {
    params: [
      {
        type: `${PgType.TEXT}[]`,
        name: 'texts',
      },
    ],
    options: {
      language: 'plv8',
      returns: PgType.TSVECTOR,
      behavior: 'IMMUTABLE',
    },
    definition,
  },
  columnType: (...params) => {
    return `ARRAY[${params.join(',')}]`;
  },
});

fun.schema('public');
export default fun;
