import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';
import Run from '@db/app/1.0.0';

// * MigrationId

const migration = Run(__filename);

// * Actions to migrate
export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  migration.up(pgm);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  migration.down(pgm);
}
