import { defineTable } from '@redware/migration-utils';
import path from 'path';
import columns from './columns';
import data from './_data';

const table = defineTable({
  name: path.basename(__dirname),
  columns,
  indexes: {
    columns: 'full_text',
    options: {
      method: 'gin',
    },
  },
  data,
});

export default table;
