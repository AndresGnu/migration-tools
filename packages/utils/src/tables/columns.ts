import { MigrationBuilder, PgType, ColumnDefinition } from 'node-pg-migrate';
import { parseTables } from '../helpers';
// Columns
interface CodeNameOptions {
  codePk?: boolean;
  lengthCode?: number;
  isNullName?: boolean;
}

const PrimitiveColumns = {
  character: (number?: number) =>
    `${PgType.CHARACTER_VARYING}${number ? '(' + number + ')' : ''}`,

  numeric: (presicion?: number, scale?: number) =>
    `${PgType.NUMERIC}${
      presicion ? `(${presicion} ${scale ? ',' + scale : ''})` : ''
    }`,
};
// export
export const useHelperColumns = (pgm: MigrationBuilder) => {
  // console.log(pgm);

  // Types

  const codeName = ({
    lengthCode,
    codePk,
    isNullName,
  }: CodeNameOptions): Record<string, ColumnDefinition> => {
    return {
      code: codePk
        ? {
            type: PrimitiveColumns.character(lengthCode),
            primaryKey: true,
          }
        : {
            type: PrimitiveColumns.character(lengthCode),
            notNull: true,
            unique: isNullName || true,
          },
      name: {
        type: PrimitiveColumns.character(140),
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
      pkSerial: (key: string) => {
        _columns[key] = idSerial();
      },
      pkBigSerial: (key: string) => {
        _columns[key] = idBigSerial();
      },
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
    $types: {
      character: PrimitiveColumns.character,
      numeric: PrimitiveColumns.numeric,
    },
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
