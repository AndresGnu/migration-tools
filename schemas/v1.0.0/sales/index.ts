import { createSchemas } from '@redware/migration-utils';
import customers from './tables/customers';
import path from 'path';

const schema = createSchemas(path.basename(__dirname), {});
schema.table(customers);

export default () => schema;
