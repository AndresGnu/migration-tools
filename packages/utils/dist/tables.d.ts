import { MigrationBuilder, ColumnDefinitions, ColumnDefinition } from 'node-pg-migrate';
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
export interface TableObject<D extends Record<string, any[]> = Record<string, any[]>> {
    name: string;
    columns?: ColumnDefinitions | CallbackColumns;
    constrains?: TableConstrains | TableConstrains[] | CallbackConstrains;
    indexes?: TableIndexes | TableIndexes[] | CallbackIndexes;
    policies?: TablePolicies | TablePolicies[] | CallbackPolicies;
    triggers?: TableTrigges | TableTrigges[] | CallbackTriggers;
    data?: D;
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
export declare const defineTable: <D extends Record<string, any[]>>(options: TableObject<D>) => {
    _name: string;
    _data: D | undefined;
    _reference: (key?: string) => ColumnDefinition;
    columns: (columns: TableColumns | CallbackColumns) => any;
    constrains: (constrains: TableObject<any>['constrains']) => any;
    indexes: (indexes: TableObject<any>['indexes']) => any;
    triggers: (triggers: TableObject<any>['triggers']) => any;
    policies: (policies: TableObject<any>['policies']) => any;
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
