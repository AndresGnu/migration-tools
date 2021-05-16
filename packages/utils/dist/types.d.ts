import { Value, Type, DropOptions, MigrationBuilder } from 'node-pg-migrate';
interface TypeOptions {
    name: string;
    type: (Value[] | {
        [name: string]: Type;
    }) & DropOptions;
    dropOptions?: DropOptions;
}
export declare const defineType: (options: TypeOptions) => {
    $up: (pgm: MigrationBuilder) => void;
    $down: (pgm: MigrationBuilder) => void;
    schema: (schemaName: string) => void;
};
export declare type DefineType = typeof defineType;
export {};
