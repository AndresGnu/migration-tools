import { basename } from 'path';
import { TableObject } from './tables/table';

export { createMigration } from './schemas';
export { defineTable } from './tables';
export { defineFunction } from './functions';
export { defineType } from './types';

export const useNames = (dirname: string) => {
  return {
    folder: basename(dirname),
  };
};
// export const schema
export const getName = (baseName: string) => {
  //
  const dir = basename(baseName);
  const file = basename(baseName).replace(/(\.js|\.ts)/g, '');
  const schema = basename(baseName.replace(`/table/${dir}`, ''));
  return {
    dir,
    file,
    schema,
  };
};

export { PgType, ColumnDefinitions, ColumnDefinition } from 'node-pg-migrate';

export type Columns = TableObject['columns'];
