import { defineTable } from '@redware/migration-utils';
import path from 'path';
import columns from './columns';
import data from './_data';

const table = defineTable({
  name: path.basename(__dirname),
  columns,
  data,
  indexes: {
    columns: 'full_text',
    options: {
      method: 'gin',
    },
    dropOptions: {
      ifExists: true,
    },
  },
});

export default () => table;
