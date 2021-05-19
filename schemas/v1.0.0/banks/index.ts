import { createSchemas } from '@redware/migration-utils';
const schema = createSchemas('banks');
export default () => schema;