import { TableObject } from '@redware/migration-utils';
import { ColumnDefinitions } from 'node-pg-migrate';
import { concat_full_text_search } from '../../../public/functions';
import { bk_cost_centers } from '../../../codes/tables';

const _: TableObject['columns'] = ({ $types, $columns, $comments }) => {
  const primitives: ColumnDefinitions = {
    id: $columns.idBigSerial(),
    ...$columns.codeName({ lengthCode: 5 }),
    number: {
      type: $types.character(60),
    },
    full_text: concat_full_text_search._expressionGenerated(
      'code',
      'name',
      'number',
    ),

    // full_text:
  };
  const references: ColumnDefinitions = {
    cost_center_id: {
      ...bk_cost_centers._reference(),
      referencesConstraintComment: [
        $comments.OmitManyToMany(),
        $comments.ForeignFieldName('accounts'),
      ].join('\n'),

      // referencesConstraintName
    },
  };

  return {
    columns: {
      ...primitives,
      ...references,
    },
  };
};
export default _;
