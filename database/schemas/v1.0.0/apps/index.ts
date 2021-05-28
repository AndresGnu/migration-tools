import { createSchemas } from '@redware/migration-utils';
const schema = createSchemas('apps', {});
export default () => schema;
