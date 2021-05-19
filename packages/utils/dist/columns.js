"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHelperColumns = void 0;
const node_pg_migrate_1 = require("node-pg-migrate");
const helpers_1 = require("./helpers/index");
// export
const useHelperColumns = (pgm) => {
    // console.log(pgm);
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
    const timestamp = (nowDefault = true) => {
        const object = {
            type: node_pg_migrate_1.PgType.TIMESTAMP_WITH_TIME_ZONE,
        };
        if (nowDefault) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            object.default = pgm.func('NOW()');
            // delete object.default;
        }
        return object;
    };
    const $comments = {
        OmitManyToMany: () => '@omit manyToMany',
        ForeignFieldName: (name) => `@foreignFieldName ${name}`,
        ManyToMany: (name) => `@manyToManyFieldName ${name}\n@manyToManySimpleFieldName ${name}List`,
        Polymorphic: (tables) => {
            const tp = tables
                .map((t) => `@polymorphicTo ${helpers_1.parseTables(t)}`)
                .join('\n');
            return `@isPolymorphic\n${tp}`;
        },
    };
    const table = () => {
        //
        const _columns = {};
        return {
            _columns,
            timestamp: () => {
                _columns.created_at = timestamp();
                _columns.updated_at = timestamp(false);
                _columns.deleted_at = timestamp(false);
            },
            codeName: (...params) => {
                const c = codeName(...params);
                _columns.code = c.code;
                _columns.name = c.name;
                // _columns = { ..._columns, ... };
            },
            reference: (name, table, options) => {
                _columns[name] = { ...table._reference(), ...options };
                //
            },
        };
    };
    return {
        $types: { character, numeric },
        $comments,
        $table: table(),
        $columns: {
            codeName,
            idBigSerial,
            idSerial,
            timestamp,
        },
    };
};
exports.useHelperColumns = useHelperColumns;
