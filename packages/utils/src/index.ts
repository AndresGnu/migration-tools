import path from 'path';
export { createSchemas } from './schemas';
export { defineTable, DefineTable, TableObject } from './tables';
export { defineFunction } from './functions';
export { defineType } from './types';

export const getName = (baseName: string) => {
  //
  const dir = path.basename(baseName);
  const file = path.basename(baseName).replace(/(\.js|\.ts)/g, '');
  const schema = path.basename(baseName.replace(`/table/${dir}`, ''));
  return {
    dir,
    file,
    schema,
  };
};
