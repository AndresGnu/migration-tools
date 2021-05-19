import {
  MigrationBuilder,
  PgType,
  ColumnDefinitions,
  ColumnDefinition,
} from 'node-pg-migrate';
import { parseTables } from './helpers';
import { DefineTable } from './tables';
// Columns
interface CodeNameOptions {
  codePk?: boolean;
  lengthCode?: number;
  isNullName?: boolean;
}

// export
export const useHelperColumns = (pgm: MigrationBuilder) => {
  // console.log(pgm);

  // Types
  const character = (number?: number) =>
    `${PgType.CHARACTER_VARYING}${number ? '(' + number + ')' : ''}`;
  const numeric = (presicion?: number, scale?: number) =>
    `${PgType.NUMERIC}${
      presicion ? `(${presicion} ${scale ? ',' + scale : ''})` : ''
    }`;

  const codeName = ({
    lengthCode,
    codePk,
    isNullName,
  }: CodeNameOptions): Record<string, ColumnDefinition> => {
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
  const idBigSerial = (): ColumnDefinition => {
    return {
      type: PgType.BIGSERIAL,
      primaryKey: true,
    };
  };
  const idSerial = (): ColumnDefinition => {
    return {
      type: PgType.SERIAL,
      primaryKey: true,
    };
  };

  const timestamp = (nowDefault = true): ColumnDefinition => {
    const object: ColumnDefinition = {
      type: PgType.TIMESTAMP_WITH_TIME_ZONE,
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
    ForeignFieldName: (name: string) => `@foreignFieldName ${name}`,
    ManyToMany: (name: string) =>
      `@manyToManyFieldName ${name}\n@manyToManySimpleFieldName ${name}List`,
    Polymorphic: (tables: string[]) => {
      const tp = tables
        .map((t) => `@polymorphicTo ${parseTables(t)}`)
        .join('\n');
      return `@isPolymorphic\n${tp}`;
    },
  };

  const table = () => {
    //
    const _columns: Record<string, ColumnDefinition> = {};

    return {
      _columns,
      timestamp: () => {
        _columns.created_at = timestamp();
        _columns.updated_at = timestamp(false);
        _columns.deleted_at = timestamp(false);
      },
      codeName: (...params: Parameters<typeof codeName>) => {
        const c = codeName(...params);
        _columns.code = c.code;
        _columns.name = c.name;
        // _columns = { ..._columns, ... };
      },
      reference: (
        name: string,
        table: { _reference: () => any } & Record<string, any>,
        options: Omit<ColumnDefinition, 'type'>,
      ) => {
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

export type UseHelperColumns = typeof useHelperColumns;
export type HelperColumns = ReturnType<UseHelperColumns>;
