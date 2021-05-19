import { defineTable } from '@redware/migration-utils';
import path from 'path';
import columns from './columns';
// import
const name = path.basename(__dirname);
const table = defineTable({
  name,
  columns,
  constrains: {
    name: `u_${name}_table_key_key`,
    expression: {
      unique: ['table_id', 'key'],
    },
  },
});

export default table;
