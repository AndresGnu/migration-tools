import { TableObject } from '@redware/migration-utils';
import { ColumnDefinitions, PgType } from 'node-pg-migrate';

import tables from '../../../public/tables/tables';

const _: TableObject['columns'] = ({ $types, $columns }) => {
  const primitives: ColumnDefinitions = {
    id: $columns.idBigSerial(),
    table_id: {
      ...tables()._reference(),
      notNull: true,
    },
    key: {
      type: $types.character(40),
      notNull: true,
    },
    data: {
      type: PgType.JSONB,
      notNull: true,
    },
    plugin: {
      type: $types.character(40),
    },
  };

  return {
    columns: {
      ...primitives,
    },
  };
};
export default _;
