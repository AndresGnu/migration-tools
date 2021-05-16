import { defineTable } from '@redware/migration-utils';
import path from 'path';
import columns from './columns';
// import

const table = defineTable({
  name: path.basename(__dirname),
  columns,
  indexes: [
    {
      columns: 'path',
      options: {
        method: 'gist',
      },
    },
    {
      columns: 'full_name',
      options: {
        method: 'gin',
      },
    },
  ],
});

export default table;
