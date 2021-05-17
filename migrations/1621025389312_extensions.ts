import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createExtension('uuid-ossp', {
    ifNotExists: true,
  });
  pgm.createExtension('ltree', { ifNotExists: true });
  pgm.createExtension('unaccent', { ifNotExists: true });
  pgm.createExtension('plv8', {
    ifNotExists: true,
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  // publicSchema.$down(pgm);
}
