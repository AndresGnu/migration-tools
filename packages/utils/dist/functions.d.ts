import { MigrationBuilder, DropOptions, ColumnDefinition } from 'node-pg-migrate';
import { FunctionDefinition } from "../types/index";
interface FunctionOptions<Params extends unknown[]> {
    name: string;
    function: FunctionDefinition;
    columnType?: (...params: Params) => string;
    dropOptions?: DropOptions;
}
export declare const defineFunction: <P extends unknown[]>(options: FunctionOptions<P>) => {
    _columnType: (...params: P) => string;
    _expressionGenerated: (...params: P) => ColumnDefinition;
    schema: (schema: string) => void;
    $up: (pgm: MigrationBuilder) => void;
    $down: (pgm: MigrationBuilder) => void;
};
export declare type DefineFunction = typeof defineFunction;
export {};
