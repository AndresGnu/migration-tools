import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';
import publicSchema from '@database/v1/schemas/public';
import concat_full_text_search from '@database/v1/schemas/public/functions/concat_full_text_search';
import {
  enum_crud,
  enum_sign,
  enum_way_to_pay,
} from '@database/v1/schemas/public/types';
// import * as Schemas from '@database/v1/schemas';
// import

export const shorthands: ColumnDefinitions | undefined = undefined;

publicSchema.function(concat_full_text_search);
publicSchema.type(enum_crud);
publicSchema.type(enum_way_to_pay);
publicSchema.type(enum_sign);

export async function up(pgm: MigrationBuilder): Promise<void> {
  publicSchema.$up(pgm);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  publicSchema.$down(pgm);
}
