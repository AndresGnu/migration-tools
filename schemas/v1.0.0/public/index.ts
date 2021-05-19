import { createSchemas } from '@redware/migration-utils';
const schema = createSchemas('public', {});
export default () => schema;
