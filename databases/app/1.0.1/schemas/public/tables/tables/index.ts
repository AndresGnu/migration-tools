import { PgType } from 'node-pg-migrate';
import { table } from '../../../../../1.0.0/schemas/public/tables/tables';

export default (id: string) => {
  table.$migration(id);
  table.columns(() => {
    return {
      columns: {
        r: { type: PgType.BIGINT },
      },
    };
  });

  return table;
};
