import { MigrationBuilder } from 'node-pg-migrate';
import { createMigration } from '@redware/migration-utils';
import createExtensions from './extensions';
// * Importaciones
import SchemaPublic from './schemas/public';
import SchemaApps from './schemas/apps';
import SchemaCodes from './schemas/codes';
import SchemaBanks from './schemas/banks';

import * as TpPublic from './schemas/public/types';
import * as FPublic from './schemas/public/functions';
// * Import Tables
import * as TTables from './schemas/public/tables';
import * as TApps from './schemas/apps/tables';
import * as TCodes from './schemas/codes/tables';
import * as TBanks from './schemas/banks/tables';

export default (id: string) => {
  const extensions = createExtensions();

  const migration = createMigration(id);
  const Public = migration.defineSchema(SchemaPublic, true);

  Public.type(TpPublic.enum_crud)
    .type(TpPublic.enum_way_to_pay)
    .type(TpPublic.enum_sign);
  Public.function(FPublic.concat_full_text_search);
  Public.table(TTables.tables());

  const Apps = migration.defineSchema(SchemaApps, true);
  Apps.table(TApps.apps_permissions())
    .table(TApps.apps_settings())
    .table(TApps.apps_sequences());

  const Codes = migration.defineSchema(SchemaCodes, true);
  Codes.table(TCodes.bk_banks())
    .table(TCodes.bk_cost_centers())
    .table(TCodes.bk_movement_documents())
    .table(TCodes.bk_movement_types());

  const Banks = migration.defineSchema(SchemaBanks, true);
  Banks.table(TBanks.bk_accounts());

  //* Lista de llamadas
  // console.log(migration.state.actions);

  return {
    up: (pgm: MigrationBuilder) => {
      extensions.$up(pgm);
      migration.$up(pgm, id);
    },
    down: (pgm: MigrationBuilder) => {
      migration.$down(pgm, id);
      extensions.$down(pgm);
    },
  };
};
