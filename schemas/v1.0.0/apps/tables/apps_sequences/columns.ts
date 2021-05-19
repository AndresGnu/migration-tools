import { TableObject } from '@redware/migration-utils';
import { ColumnDefinitions, PgType } from 'node-pg-migrate';

import tables from '../../../public/tables/tables';

const _: TableObject['columns'] = ({ $types, $columns }) => {
  const primitives: ColumnDefinitions = {
    id: $columns.idBigSerial(),
    table_id: {
      ...tables._reference(),
      notNull: true,
    },
    key: {
      type: $types.character(2),
    },
    serie: {
      type: $types.character(11),
    },
    prefix: {
      type: $types.character(6),
    },
    number: {
      type: PgType.BIGINT,
      notNull: true,
      default: 0,
    },
    second_number: {
      type: PgType.BIGINT,
    },
    description: {
      type: $types.character(300),
    },
  };

  return {
    columns: {
      ...primitives,
    },
  };
};
export default _;
