//@ts-check
import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import { getLastVersions, pathBase } from '../helpers';
const createSchema = (version, name) => {
  //
  const pathSchema = path.join(pathBase, 'schemas', version, name);
  fs.ensureDirSync(pathSchema);
  fs.ensureFileSync(path.join(pathSchema, 'index.ts'));
  fs.writeFileSync(
    path.join(pathSchema, 'index.ts'),
    `
  import { createSchemas } from '@redware/migration-utils';
const schema = createSchemas('${name}');
export default () => schema;
`.trim(),
    'utf8',
  );
};
export default async (type) => {
  //
  // console.log(create);
  const lastVersion = getLastVersions();
  const getName = () =>
    inquirer.prompt([
      {
        type: 'input',
        name: 'name',
      },
    ]);
  console.log(lastVersion);
  if (type === 'schema') {
    console.log('Create schema');
    const { name } = await getName();
    if (!name) {
      throw 'No name';
    }
    createSchema(lastVersion, name);
  } else if (type === 'table') {
    const pathSchemas = path.join(pathBase, 'schemas', lastVersion);
    const schemas = fs.readdirSync(pathSchemas);
    const { schema, name } = await inquirer.prompt([
      {
        type: 'list',
        name: 'schema',
        message: 'Selecciona el esquema',
        choices: schemas,
      },
      {
        type: 'input',
        name: 'name',
        message: 'Escribe el nombre de la tabla',
      },
    ]);
    const pathTable = path.join(pathSchemas, schema, 'tables', name);
    fs.ensureDirSync(pathTable);
    const fileTable = path.join(pathTable, 'index.ts');
    const fileColumns = path.join(pathTable, 'columns.ts');
    fs.ensureFileSync(fileTable);
    fs.ensureFileSync(fileColumns);

    fs.writeFileSync(
      fileTable,
      `import { defineTable } from '@redware/migration-utils';
import path from 'path';
import columns from './columns';

const table = defineTable({
  name: path.basename(__dirname),
  columns,
});

export default table;
`.trim(),
      'utf8',
    );
    fs.writeFileSync(
      fileColumns,
      `import { TableObject } from '@redware/migration-utils';
import { ColumnDefinitions } from 'node-pg-migrate';

const _: TableObject['columns'] = ({}) => {
  const primitives: ColumnDefinitions = {};

  return {
    columns: {
      ...primitives,
    },
  };
};
export default _;
`,
      'utf8',
    );

    // console.log(schema);
    //
  }
};
