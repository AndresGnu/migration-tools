import { TableObject } from '@redware/migration-utils';
import { ColumnDefinitions } from 'node-pg-migrate';
import { concat_full_text_search } from '../../../public/functions';
const _: TableObject['columns'] = ({ $columns }) => {
  const primitives: ColumnDefinitions = {
    id: $columns.idBigSerial(),
    ...$columns.codeName({ lengthCode: 2 }),
    full_text: concat_full_text_search._expressionGenerated('code', 'name'),
  };

  return {
    columns: {
      ...primitives,
    },
  };
};
export default _;
