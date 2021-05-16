import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';
import publicSchema from '@database/v1/schemas/public';
import {
  enum_crud,
  enum_sign,
  enum_way_to_pay,
} from '@database/v1/schemas/public/types';

export const shorthands: ColumnDefinitions | undefined = undefined;

// publicSchema.function(concat_full_text_search);
publicSchema.type(enum_crud);
publicSchema.type(enum_way_to_pay);
publicSchema.type(enum_sign);

export async function up(pgm: MigrationBuilder): Promise<void> {
  publicSchema.$up(pgm);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  publicSchema.$down(pgm);
}
