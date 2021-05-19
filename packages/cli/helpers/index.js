import fs from 'fs-extra';
import path from 'path';
export const pathBase = process.cwd();
export const getLastVersions = () => {
  //
  const versions = fs
    .readdirSync(path.join(pathBase, 'schemas'))
    .filter((folder) => folder.startsWith('v'));
  console.log(versions);
  return versions[0];
};
