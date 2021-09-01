import { TableObject } from "./tables/table";
export { createMigration } from "./schemas/index";
export { defineTable } from "./tables/index";
export { defineFunction } from "./functions";
export { defineType } from "./types";
export declare const getName: (baseName: string) => {
    dir: string;
    file: string;
    schema: string;
};
export { PgType, ColumnDefinitions, ColumnDefinition } from 'node-pg-migrate';
export declare type Columns = TableObject['columns'];
