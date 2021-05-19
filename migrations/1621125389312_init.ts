import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';
// * Importaciones
import publicSchema from '@db/schemas/v1.0.0/public';
import appsSchema from '@db/schemas/v1.0.0/apps';
import codesSchema from '@db/schemas/v1.0.0/codes';
import banksSchema from '@db/schemas/v1.0.0/banks';

import {
  enum_crud,
  enum_sign,
  enum_way_to_pay,
} from '@db/schemas/v1.0.0/public/types';
import { concat_full_text_search } from '@db/schemas/v1.0.0/public/functions';
// * Import Tables
import tables from '@db/schemas/v1.0.0/public/tables/tables';
import {
  apps_permissions,
  apps_sequences,
  apps_settings,
} from '@db/schemas/v1.0.0/apps/tables';
import {
  bk_banks,
  bk_cost_centers,
  bk_movement_documents,
  bk_movement_types,
  bk_origins,
} from '@db/schemas/v1.0.0/codes/tables';
import { bk_accounts } from '@db/schemas/v1.0.0/banks/tables';
// * Defintitions

const Public = publicSchema();
Public.type(enum_crud);
Public.type(enum_way_to_pay);
Public.type(enum_sign);
Public.function(concat_full_text_search);
Public.table(tables());

const Apps = appsSchema();
Apps.table(apps_permissions());
Apps.table(apps_settings());
Apps.table(apps_sequences());

const Codes = codesSchema();
Codes.table(bk_banks());
Codes.table(bk_cost_centers());
Codes.table(bk_movement_documents());
Codes.table(bk_movement_types());
Codes.table(bk_origins());

const Banks = banksSchema();

Banks.table(
  bk_accounts().columns({
    columns: { d: { type: 'Integer' } },
  }),
);

// bk_accounts._queryData.insert.default

// ? Lista de llamadas
const calls = [Public, Apps, Codes, Banks];

// * Actions to migrate
export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  calls.forEach((s) => s.$up(pgm));
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  calls.reverse().forEach((s) => s.$down(pgm));
}
