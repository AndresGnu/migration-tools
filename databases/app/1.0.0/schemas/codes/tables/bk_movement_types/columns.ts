import { TableObject } from '@redware/migration-utils';
import { ColumnDefinitions } from 'node-pg-migrate';

const _: TableObject['columns'] = ({ $table }) => {
  $table.codeName({ codePk: true, lengthCode: 4 });
  $table.timestamp();

  return {
    columns: {},
  };
};
export default _;
