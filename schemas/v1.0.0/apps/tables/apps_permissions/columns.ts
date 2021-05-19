import { TableObject } from '@redware/migration-utils';
import { ColumnDefinitions } from 'node-pg-migrate';
import { enum_crud } from '../../../public/types';

import tables from '../../../public/tables/tables';

const _: TableObject['columns'] = ({ $types, $columns, pgm }) => {
  const primitives: ColumnDefinitions = {
    id: $columns.idBigSerial(),
    table_id: {
      ...tables._reference(),
      notNull: true,
    },
    action: {
      type: enum_crud._name,
      notNull: true,
    },
    group: {
      type: $types.character(40),
      notNull: true,
    },
  };

  return {
    columns: {
      ...primitives,
    },
  };
};
export default _;
