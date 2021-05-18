import { MigrationBuilder } from 'node-pg-migrate';
import createExtensions from '@db/extensions/v1.0.0';

const extensions = createExtensions();

export async function up(pgm: MigrationBuilder): Promise<void> {
  extensions.$up(pgm);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  extensions.$down(pgm);
}
