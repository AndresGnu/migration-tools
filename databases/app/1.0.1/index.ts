import { MigrationBuilder } from 'node-pg-migrate';
import { createMigration } from '@redware/migration-utils';
// * Importaciones
import SchemaPublic from './schemas/public';

// * Import Tables
import * as TTables from './schemas/public/tables';

export default (id: string) => {
  const migration = createMigration(id);

  const Public = migration.defineSchema(SchemaPublic);
  Public.table(TTables.tables(id), { create: false });

  return {
    up: (pgm: MigrationBuilder) => {
      migration.$up(pgm, id);
    },
    down: (pgm: MigrationBuilder) => {
      migration.$down(pgm, id);
    },
  };
};
