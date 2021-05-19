import { defineTable } from '@redware/migration-utils';
import path from 'path';
// import

const table = defineTable({
  name: path.basename(__dirname),
  columns: ({ $types }) => ({
    columns: {
      id: {
        type: $types.character(80),
        primaryKey: true,
      },
    },
  }),
});

table.schema('public');

export default table;
