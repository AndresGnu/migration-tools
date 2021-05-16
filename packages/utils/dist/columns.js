"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHelperColumns = void 0;
const node_pg_migrate_1 = require("node-pg-migrate");
// export
const useHelperColumns = (pgm) => {
    // Types
    const character = (number) => `${node_pg_migrate_1.PgType.CHARACTER_VARYING}${number ? '(' + number + ')' : ''}`;
    const numeric = (presicion, scale) => `${node_pg_migrate_1.PgType.NUMERIC}${presicion ? `(${presicion} ${scale ? ',' + scale : ''})` : ''}`;
    const codeName = ({ lengthCode, codePk, isNullName, }) => {
        return {
            code: codePk
                ? {
                    type: character(lengthCode),
                    primaryKey: true,
                }
                : {
                    type: character(lengthCode),
                    notNull: true,
                    unique: isNullName || true,
                },
            name: {
                type: character(140),
                unique: isNullName || true,
            },
        };
    };
    //
    const idBigSerial = () => {
        return {
            type: node_pg_migrate_1.PgType.BIGSERIAL,
            primaryKey: true,
        };
    };
    const idSerial = () => {
        return {
            type: node_pg_migrate_1.PgType.SERIAL,
            primaryKey: true,
        };
    };
    const timestamp = (isDefault = false) => {
        const object = {
            type: node_pg_migrate_1.PgType.TIMESTAMP_WITH_TIME_ZONE,
            default: pgm.func('NOW()'),
        };
        if (!isDefault) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            delete object.default;
        }
        return object;
    };
    return {
        $types: { character, numeric },
        $columns: {
            codeName,
            idBigSerial,
            idSerial,
            timestamp,
        },
    };
};
exports.useHelperColumns = useHelperColumns;
