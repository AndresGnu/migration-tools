import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';
// * Importaciones
import publicSchema from '@db/schemas/v1.0.0/public';
import {
  enum_crud,
  enum_sign,
  enum_way_to_pay,
} from '@db/schemas/v1.0.0/public/types';

// * Defintitions

const Public = publicSchema();
Public.type(enum_crud);
Public.type(enum_way_to_pay);
Public.type(enum_sign);

// * Actions to migrate
export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  Public.$up(pgm);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  Public.$down(pgm);
}
