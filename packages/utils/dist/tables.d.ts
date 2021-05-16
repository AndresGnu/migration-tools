import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';
import { CallbackTable, TableIndexes, TableColumns, TableOptions, TableConstrains, TableTrigges, TablePolicies } from "../types/index";
import type { HelperColumns } from "./columns";
declare type CallbackColumns = CallbackTable<TableColumns, HelperColumns & {
    schema: string;
    pgm: MigrationBuilder;
}>;
declare type CallbackIndexes = CallbackTable<TableIndexes | TableIndexes[]>;
declare type CallbackConstrains = CallbackTable<TableConstrains | TableConstrains[]>;
declare type CallbackTriggers = CallbackTable<TableTrigges | TableTrigges[]>;
declare type CallbackPolicies = CallbackTable<TablePolicies | TablePolicies[]>;
export interface TableObject {
    name: string;
    columns?: ColumnDefinitions | CallbackColumns;
    constrains?: TableConstrains | TableConstrains | CallbackConstrains;
    indexes?: TableIndexes | TableIndexes[] | CallbackIndexes;
    policies?: TablePolicies | TablePolicies[] | CallbackPolicies;
    triggers?: TableTrigges | TableTrigges[] | CallbackTriggers;
}
declare type Actions = {
    type: 'columns';
    method: CallbackColumns;
} | {
    type: 'index';
    method: CallbackIndexes;
} | {
    type: 'constrain';
    method: CallbackConstrains;
} | {
    type: 'trigger';
    method: CallbackTriggers;
} | {
    type: 'policy';
    method: CallbackPolicies;
};
export interface TableState {
    name: string;
    schema: string;
    actions: Actions[][];
    index: number;
    options: Partial<TableOptions>;
}
export declare const defineTable: (options: TableObject) => {
    _name: string;
    columns: (columns: TableColumns | CallbackColumns) => any;
    constrains: (constrains: TableObject['constrains']) => any;
    indexes: (indexes: TableObject['indexes']) => any;
    triggers: (triggers: TableObject['triggers']) => any;
    policies: (policies: TableObject['policies']) => any;
    /**
     * Up table
     */
    $up: (pgm: MigrationBuilder) => void;
    $down: (pgm: MigrationBuilder) => void;
    options: (tableOptions: Partial<TableOptions>) => any;
    schema: (nameSchema: string) => any;
};
export declare type DefineTable = typeof defineTable;
export {};
