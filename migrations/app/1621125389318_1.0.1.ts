import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';
import Migration from '@db/app/1.0.1';

// * MigrationId

const migration = Migration(__filename);

// * Actions to migrate
export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  migration.up(pgm);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  migration.down(pgm);
}
