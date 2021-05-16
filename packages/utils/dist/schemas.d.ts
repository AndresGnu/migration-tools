import { MigrationBuilder, CreateSchemaOptions } from 'node-pg-migrate';
import { DefineTable } from "./tables";
import { DefineFunction } from "./functions";
import { DefineType } from "./types";
export declare const createSchemas: (nameSchema: string, options: CreateSchemaOptions) => {
    $up: (pgm: MigrationBuilder) => void;
    $down: (pgm: MigrationBuilder) => void;
    table: (theTable: ReturnType<DefineTable>) => any;
    type: (theTable: ReturnType<DefineType>) => any;
    function: (theFunction: ReturnType<DefineFunction>) => any;
};
