import { defineTable } from '@redware/migration-utils';
import path from 'path';
// import

export const table = defineTable({
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

export default () => table;
