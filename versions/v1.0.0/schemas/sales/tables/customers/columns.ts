import { TableObject } from '@redware/migration-utils';
import { ColumnDefinitions, PgType } from 'node-pg-migrate';
import textSearch from '@database/v1/schemas/public/functions/concat_full_text_search';

const _: TableObject['columns'] = ({ $types, pgm }) => {
  const primitives: ColumnDefinitions = {
    path: {
      type: 'ltree',
      primaryKey: true,
    },
    name: {
      type: $types.character(80),
      notNull: true,
    },
    description: {
      type: $types.character(240),
    },
    reference: {
      type: $types.character(240),
    },
    uuid: {
      type: $types.character(36),
      notNull: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    is_selected: {
      type: PgType.BOOLEAN,
      default: false,
    },
    cost: {
      type: PgType.BOOLEAN,
      default: false,
    },
    fun: {
      type: PgType.BOOLEAN,
      default: false,
    },
    full_text: textSearch.columnType('path::TEXT', 'name'),
  };

  return {
    columns: {
      ...primitives,
    },
  };
};
export default _;
