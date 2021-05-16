import { MigrationBuilder, ColumnDefinitions, ColumnDefinition } from 'node-pg-migrate';
interface CodeNameOptions {
    codePk: boolean;
    lengthCode: number;
    isNullName: boolean;
}
export declare const useHelperColumns: (pgm: MigrationBuilder) => {
    $types: {
        character: (number?: number | undefined) => string;
        numeric: (presicion?: number | undefined, scale?: number | undefined) => string;
    };
    $columns: {
        codeName: ({ lengthCode, codePk, isNullName, }: CodeNameOptions) => ColumnDefinitions;
        idBigSerial: () => ColumnDefinition;
        idSerial: () => ColumnDefinition;
        timestamp: (isDefault?: boolean) => ColumnDefinition;
    };
};
export declare type UseHelperColumns = typeof useHelperColumns;
export declare type HelperColumns = ReturnType<UseHelperColumns>;
export {};
