import path from 'path';
export { createMigration } from './schemas';
export { defineTable } from './tables';
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
