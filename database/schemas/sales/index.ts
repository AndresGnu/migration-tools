import { createSchemas } from '@redware/migration-utils';
import customers from './tables/customers';

const schema = createSchemas('sales', {});
schema.table(customers);

export default schema;
