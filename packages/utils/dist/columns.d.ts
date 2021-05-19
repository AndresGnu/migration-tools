import { MigrationBuilder, ColumnDefinition } from 'node-pg-migrate';
interface CodeNameOptions {
    codePk?: boolean;
    lengthCode?: number;
    isNullName?: boolean;
}
export declare const useHelperColumns: (pgm: MigrationBuilder) => {
    $types: {
        character: (number?: number | undefined) => string;
        numeric: (presicion?: number | undefined, scale?: number | undefined) => string;
    };
    $comments: {
        OmitManyToMany: () => string;
        ForeignFieldName: (name: string) => string;
        ManyToMany: (name: string) => string;
        Polymorphic: (tables: string[]) => string;
    };
    $table: {
        _columns: Record<string, ColumnDefinition>;
        timestamp: () => void;
        codeName: (params_0: CodeNameOptions) => void;
        reference: (name: string, table: {
            _reference: () => any;
        } & Record<string, any>, options: Omit<ColumnDefinition, 'type'>) => void;
    };
    $columns: {
        codeName: ({ lengthCode, codePk, isNullName, }: CodeNameOptions) => Record<string, ColumnDefinition>;
        idBigSerial: () => ColumnDefinition;
        idSerial: () => ColumnDefinition;
        timestamp: (nowDefault?: boolean) => ColumnDefinition;
    };
};
export declare type UseHelperColumns = typeof useHelperColumns;
export declare type HelperColumns = ReturnType<UseHelperColumns>;
export {};
