import { TableObject } from '@redware/migration-utils';
import { ColumnDefinitions } from 'node-pg-migrate';

const _: TableObject['columns'] = ({ $columns }) => {
  const primitives: ColumnDefinitions = {
    ...$columns.codeName({ codePk: true, lengthCode: 2 }),
  };

  return {
    columns: {
      ...primitives,
    },
  };
};
export default _;
