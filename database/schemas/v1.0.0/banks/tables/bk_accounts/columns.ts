import { TableObject } from '@redware/migration-utils';
import { ColumnDefinitions } from 'node-pg-migrate';
import { concat_full_text_search } from '../../../public/functions';
import { bk_cost_centers } from '../../../codes/tables';

const _: TableObject['columns'] = ({ $types, $columns, $comments, $table }) => {
  const primitives: ColumnDefinitions = {
    id: $columns.idBigSerial(),
    number: {
      type: $types.character(60),
    },
    full_text: concat_full_text_search._expressionGenerated(
      'code',
      'name',
      'number',
    ),
  };

  $table.reference('cost_center_id', bk_cost_centers(), {
    referencesConstraintComment: [
      $comments.OmitManyToMany(),
      $comments.ForeignFieldName('accounts'),
    ].join('\n'),
  });
  $table.codeName({ lengthCode: 5 });
  $table.timestamp();
  return {
    columns: {
      ...primitives,
    },
  };
};
export default _;
