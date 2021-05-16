// import type { HelperColumns } from '@redware/migration-utils/d/columns.d';

import {
  ColumnDefinitions,
  MigrationBuilder,
  CreateIndex,
  AddColumns,
  DropOptions,
  DropIndexOptions,
  CreateTable,
  CreateConstraint,
  CreateTrigger,
  CreatePolicy,
  IfExistsOption,
} from 'node-pg-migrate';

type ParamsIndexes = Parameters<CreateIndex>;
type ParamsColumns = Parameters<AddColumns>;
type ParamsTable = Parameters<CreateTable>;
type ParamsConstrains = Parameters<CreateConstraint>;
type PTrigges = Parameters<CreateTrigger>;
type PPolicies = Parameters<CreatePolicy>;

export interface TableIndexes {
  columns: ParamsIndexes[1];
  options?: ParamsIndexes[2];
  dropOptions?: DropIndexOptions;
}
export interface TableColumns {
  columns: ParamsColumns[1];
  options?: ParamsColumns[2];
  dropOptions?: DropOptions;
}
export interface TableConstrains {
  name: ParamsConstrains[1];
  expression: ParamsConstrains[2];
  dropOptions?: DropOptions;
}

export interface TableOptions {
  create: ParamsTable[2];
  drop: DropOptions;
}
export interface TableTrigges {
  name: PTrigges[1];
  triggerOptions: PTrigges[2];
  definition?: PTrigges[3];
  dropOptions?: IfExistsOption;
}
export interface TablePolicies {
  name: PPolicies[1];
  options: PPolicies[2];
  dropOptions?: IfExistsOption;
}

export type CallbackTable<Return = any, Context = { pgm: MigrationBuilder }> = (
  ctx: Context,
) => Return;
