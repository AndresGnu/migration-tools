import { TableObject } from '@redware/migration-utils';
import { ColumnDefinitions } from 'node-pg-migrate';
import { concat_full_text_search as fts } from '../../../public/functions';
const _: TableObject['columns'] = ({ $columns, $table }) => {
  const primitives: ColumnDefinitions = {
    id: $columns.idBigSerial(),
    full_text: fts._expressionGenerated('code', 'name'),
  };

  $table.codeName({ lengthCode: 2 });
  $table.timestamp();

  return {
    columns: {
      ...primitives,
    },
  };
};
export default _;
