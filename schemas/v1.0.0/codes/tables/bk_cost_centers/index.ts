import { defineTable } from '@redware/migration-utils';
import path from 'path';
import columns from './columns';

const table = defineTable({
  name: path.basename(__dirname),
  columns,
  indexes: {
    columns: 'full_text',
    options: {
      method: 'gin',
    },
  },
});

export default table;
