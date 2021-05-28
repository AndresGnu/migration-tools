import { TableObject } from '@redware/migration-utils';
import { ColumnDefinitions, PgType } from 'node-pg-migrate';
import { concat_full_text_search } from '../../../public/functions';
import { bk_cost_centers } from '../../../codes/tables';
import { enum_sign } from '../../../public/types';

const _: TableObject['columns'] = ({ $types, $columns, $comments, $table }) => {
  const primitives: ColumnDefinitions = {
    id: $columns.idBigSerial(),
    sign: {
      type: enum_sign._name,
      notNull: true,
    },
    date: {
      type: PgType.DATE,
      notNull: true,
    },
    concept: {
      type: $types.character(140),
    },
    beneficiary: {
      type: $types.character(45),
    },
    responsable: {
      type: $types.character(45),
    },
    number: {
      type: $types.character(45),
    },
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
