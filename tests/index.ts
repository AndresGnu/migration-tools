import {
  createSchemas,
  defineFunction,
  defineTable,
} from '@redware/migration-utils';
const logger =
  (name: string) =>
  (...params: any) =>
    console.log(`Run ${name}:`, params);
const pgm = {} as any;
['createSchema', 'createTable', 'addColumns'].forEach((name) => {
  pgm[name] = logger(name);
});
const saleSchema = createSchemas('sales', {});
const tableSales = defineTable({
  name: 'sales',
  columns: {
    id: {
      type: 'Character',
    },
  },
});

// tableSales.
saleSchema.table(tableSales);
saleSchema.$up(pgm);

// saleSchema.$down(pgm);
