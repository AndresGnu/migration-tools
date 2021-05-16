import {
  MigrationBuilder,
  ColumnDefinitions,
  TableOptions,
} from 'node-pg-migrate';
// import { PgColumn, PgColumns, PgTypeExt } from './columns';
export * from './table';
export * from './functions';

// export * from '@redware/migration-utils/d/table';
export namespace Pg {
  export type Columns = PgColumns;
  export type Column = PgColumn;
  export type TypeExt = PgTypeExt;
}
